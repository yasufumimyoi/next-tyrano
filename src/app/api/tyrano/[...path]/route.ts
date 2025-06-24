import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(
      process.cwd(),
      "src",
      "app",
      "tyrano",
      ...params.path
    );

    // セキュリティチェック：tyranoディレクトリ外へのアクセスを防ぐ
    if (!filePath.includes("tyrano")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    // ファイルの拡張子に基づいてContent-Typeを設定
    const ext = filePath.split(".").pop()?.toLowerCase();
    let contentType = "text/plain";

    switch (ext) {
      case "html":
        contentType = "text/html";
        break;
      case "css":
        contentType = "text/css";
        break;
      case "js":
        contentType = "application/javascript";
        break;
      case "json":
        contentType = "application/json";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "svg":
        contentType = "image/svg+xml";
        break;
      case "mp3":
        contentType = "audio/mpeg";
        break;
      case "wav":
        contentType = "audio/wav";
        break;
      case "ogg":
        contentType = "audio/ogg";
        break;
      case "mp4":
        contentType = "video/mp4";
        break;
      case "webm":
        contentType = "video/webm";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // 1時間キャッシュ
      },
    });
  } catch (error) {
    console.error("Error serving tyrano file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
