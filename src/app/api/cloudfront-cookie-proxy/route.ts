import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authToken = request.headers.get("authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 外部APIを呼び出し
    const externalApiUrl = process.env.CLOUDFRONT_COOKIE_API_URL;
    if (!externalApiUrl) {
      return NextResponse.json(
        { error: "External API URL not configured" },
        { status: 500 }
      );
    }

    const externalResponse = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    });

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: "External API request failed" },
        { status: externalResponse.status }
      );
    }

    const cloudfrontData = await externalResponse.json();

    // レスポンスを作成
    const response = NextResponse.json({
      success: true,
      message: "CloudFront cookies set via external API",
    });

    // 外部APIから取得したデータでクッキーを設定
    if (cloudfrontData.keyPairId) {
      response.cookies.set("CloudFront-Key-Pair-Id", cloudfrontData.keyPairId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });
    }

    if (cloudfrontData.policy) {
      response.cookies.set("CloudFront-Policy", cloudfrontData.policy, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });
    }

    if (cloudfrontData.signature) {
      response.cookies.set("CloudFront-Signature", cloudfrontData.signature, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error in proxy API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
