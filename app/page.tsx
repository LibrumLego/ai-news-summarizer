"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [news, setNews] = useState({ title: "", summary: "" });
  const [loading, setLoading] = useState(false);

  const fetchAiSummary = async () => {
    setLoading(true);
    try {
      const LAMBDA_URL = "https://v4xrn4xija7ewrclywuizj37ya0ctxmq.lambda-url.us-east-1.on.aws/";
      
      const response = await fetch(LAMBDA_URL);
      
      if (!response.ok) {
        throw new Error(`서버 응답 에러: ${response.status}`);
      }

      const data = await response.json();
      console.log("받은 데이터:", data); // 터미널/콘솔 확인용

      // 데이터 파싱 방어 로직: 
      // 람다 설정에 따라 데이터가 body 안에 문자열로 올 수도 있고, 바로 객체로 올 수도 있습니다.
      let result;
      if (data.body) {
        // body가 문자열이면 파싱, 아니면 그대로 사용
        result = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      } else {
        result = data;
      }

      setNews({
        title: result.title || "제목을 가져오지 못했습니다.",
        summary: result.summary || "요약 내용을 가져오지 못했습니다.",
      });

    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      alert("뉴스를 가져오는 중에 에러가 발생했습니다. 브라우저 콘솔을 확인해주세요.");
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