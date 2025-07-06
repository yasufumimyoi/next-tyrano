"use client";

import { useState } from "react";

export default function CloudFrontExample() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getCloudFrontCookie = async () => {
    setLoading(true);
    try {
      // 認証トークンを取得（実際の実装に合わせて調整）
      const authToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!authToken) {
        setMessage("認証が必要です。ログインしてください。");
        return;
      }

      // 認証付きでCloudFrontクッキーを取得
      const response = await fetch("/api/cloudfront-cookie", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setMessage("認証に失敗しました。再度ログインしてください。");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`エラー: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      setMessage(
        result.success
          ? "CloudFrontクッキーが正常に設定されました"
          : "エラーが発生しました"
      );
    } catch (error) {
      console.error("Error:", error);
      setMessage("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const checkCloudFrontCookie = async () => {
    try {
      // クッキーの存在確認（クライアントサイド）
      const cookies = document.cookie.split(";");
      const cloudfrontCookies = cookies.filter((cookie) =>
        cookie.trim().startsWith("CloudFront-")
      );

      if (cloudfrontCookies.length > 0) {
        setMessage(
          `CloudFrontクッキーが設定されています (${cloudfrontCookies.length}個)`
        );
      } else {
        setMessage("CloudFrontクッキーが設定されていません");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("エラーが発生しました");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        認証付きCloudFrontクッキー設定例
      </h1>

      <div className="mb-4 p-4 bg-yellow-100 rounded">
        <p className="text-sm">
          <strong>注意:</strong> このAPIは認証済みユーザーのみが利用できます。
          認証トークンが必要です。
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={getCloudFrontCookie}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "取得中..." : "CloudFrontクッキーを取得"}
        </button>

        <button
          onClick={checkCloudFrontCookie}
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          クッキー状態を確認
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
