"use client";

import { useSession, signOut } from "../../../auth-client";
import { useRouter } from "next/navigation";
import { $getHello, type GetHelloRequest, type GetHelloResponse } from "../../../clients";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [helloResult, setHelloResult] = useState<GetHelloResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("Hello");

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const handleHello = async () => {
    setIsLoading(true);
    setError(null);
    setHelloResult(null);
    
    try {
      if (!message.trim()) {
        throw new Error("メッセージを入力してください");
      }
      
      const requestData: GetHelloRequest = {
        json: {
          text: message,
        },
      };
      
      const response = await $getHello(requestData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "リクエストに失敗しました");
      }
      
      const data: GetHelloResponse = await response.json();
      setHelloResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">ダッシュボード</h1>
        
        {session?.user ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-semibold mb-2">
              ログインしています
            </div>
            <p className="text-black">
              ユーザー: {session.user.name || session.user.email}
            </p>
            
            {/* Hello API テスト */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-xl font-bold mb-4 text-black">Hello API テスト</h2>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージ
                </label>
                <input
                  id="message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  placeholder="メッセージを入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                />
              </div>
              
              <button
                onClick={handleHello}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
              >
                {isLoading ? "処理中..." : "Hello API を呼び出す"}
              </button>
              
              {helloResult && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">レスポンス</h3>
                  <pre className="text-left text-sm text-green-700 whitespace-pre-wrap">
                    {JSON.stringify(helloResult, null, 2)}
                  </pre>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">エラー</h3>
                  <p className="text-left text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-red-600 text-lg font-semibold mb-2">
              ログインしていません
            </div>
            <p className="text-black">
              ログインページに移動してください
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ログインページへ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
