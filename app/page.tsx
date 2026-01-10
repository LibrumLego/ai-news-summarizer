"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // 상태 관리: 뉴스 제목, 요약 내용, 로딩 상태
  const [news, setNews] = useState({ title: "", summary: "" });
  const [loading, setLoading] = useState(false);

  const fetchAiSummary = async () => {
    setLoading(true);
    try {
      // ⭐ 팀장님의 람다 URL을 여기에 붙여넣으세요!
      const LAMBDA_URL = "https://v4xrn4xija7ewrclywuizj37ya0ctxmq.lambda-url.us-east-1.on.aws/";
      
      const response = await fetch(LAMBDA_URL);
      const data = await response.json();
      
      // 람다가 보낸 body는 string 형태이므로 JSON으로 한 번 더 파싱
      const result = JSON.parse(data.body);

      setNews({
        title: result.title,
        summary: result.summary,
      });
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      alert("뉴스를 가져오는 중에 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-2xl bg-white p-12 shadow-xl dark:bg-zinc-900">
        <header className="flex flex-col gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI 뉴스 요약기
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            버튼을 누르면 실시간 테크 뉴스를 AI가 분석하여 요약해 드립니다.
          </p>
        </header>

        <button
          onClick={fetchAiSummary}
          disabled={loading}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-black px-6 text-xl font-medium text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {loading ? "AI가 요약 중..." : "최신 뉴스 요약하기"}
        </button>

        {/* 결과창: 제목과 요약이 있을 때만 표시 */}
        {news.title && (
          <div className="mt-4 flex flex-col gap-4 border-t border-zinc-100 pt-8 dark:border-zinc-800 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              📌 {news.title}
            </h2>
            <div className="rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800">
              <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300 text-lg">
                {news.summary}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}