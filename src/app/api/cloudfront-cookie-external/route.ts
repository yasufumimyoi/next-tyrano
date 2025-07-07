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

    // 外部APIのレスポンスをそのまま返す
    const responseData = await externalResponse.json();

    // 外部APIのSet-Cookieヘッダーを取得
    const setCookieHeaders = externalResponse.headers.getSetCookie();

    // レスポンスを作成
    const response = NextResponse.json(responseData);

    // 外部APIのSet-Cookieヘッダーを転送
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error) {
    console.error("Error calling external API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
