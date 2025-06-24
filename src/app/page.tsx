import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Next.js アプリケーション
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/chat"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              チャット
            </h2>
            <p className="text-gray-600">チャット機能にアクセス</p>
          </Link>

          <Link
            href="/tyrano-viewer"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              ティラノスクリプト
            </h2>
            <p className="text-gray-600">ティラノスクリプトゲームをプレイ</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
