import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloudfrontCookie } = body;

    if (!cloudfrontCookie) {
      return NextResponse.json(
        { error: "CloudFront cookie is required" },
        { status: 400 }
      );
    }

    // 外部APIからCloudFrontクッキーを受け取った場合の処理
    const response = NextResponse.json(
      { success: true, message: "CloudFront cookie set" },
      { status: 200 }
    );

    // クッキーを設定
    response.cookies.set("CloudFront-Key-Pair-Id", cloudfrontCookie.keyPairId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1時間
    });

    response.cookies.set("CloudFront-Policy", cloudfrontCookie.policy, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });

    response.cookies.set("CloudFront-Signature", cloudfrontCookie.signature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Error setting CloudFront cookie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 認証チェック関数（実際の認証ロジックに置き換えてください）
async function checkAuthentication(request: NextRequest): Promise<boolean> {
  // 例：JWTトークンやセッションクッキーをチェック
  const authToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  const sessionCookie = request.cookies.get("session-token");

  if (!authToken && !sessionCookie) {
    return false;
  }

  // 実際の認証ロジックをここに実装
  // 例：JWTの検証、セッションの確認など
  try {
    // 認証チェックの実装
    // const user = await verifyToken(authToken);
    // const session = await validateSession(sessionCookie?.value);
    return true; // 仮の実装
  } catch (error) {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const isAuthenticated = await checkAuthentication(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 外部APIからCloudFrontクッキーを取得
    const externalApiUrl = process.env.CLOUDFRONT_COOKIE_API_URL;
    if (!externalApiUrl) {
      return NextResponse.json(
        { error: "CloudFront API URL not configured" },
        { status: 500 }
      );
    }

    // 外部APIを呼び出してCloudFrontクッキーを取得
    const externalResponse = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "Content-Type": "application/json",
      },
    });

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get CloudFront cookie from external API" },
        { status: externalResponse.status }
      );
    }

    const cloudfrontData = await externalResponse.json();

    // レスポンスを作成
    const response = NextResponse.json({
      success: true,
      message: "CloudFront cookie set successfully",
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1時間後
    });

    // CloudFrontクッキーを設定
    if (cloudfrontData.keyPairId) {
      response.cookies.set("CloudFront-Key-Pair-Id", cloudfrontData.keyPairId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1時間
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
    console.error("Error setting CloudFront cookie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
