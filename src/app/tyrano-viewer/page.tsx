"use client";

import { useEffect, useRef } from "react";

export default function TyranoViewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // iframeが読み込まれた後の処理
    const handleIframeLoad = () => {
      console.log("TyranoScript iframe loaded");
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          ティラノスクリプトビューアー
        </h1>

        <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            ref={iframeRef}
            src="/api/tyrano/index.html"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; microphone; camera"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="TyranoScript Game"
          />
        </div>

        <div className="mt-4 text-gray-300 text-sm">
          <p>
            ※
            ティラノスクリプトが正常に表示されない場合は、ブラウザの設定でJavaScriptを有効にしてください。
          </p>
        </div>
      </div>
    </div>
  );
}
