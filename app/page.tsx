"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // 사용자가 입력한 URL을 담을 상태 추가
  const [inputUrl, setInputUrl] = useState("");
  const [news, setNews] = useState({ title: "", summary: "" });
  const [loading, setLoading] = useState(false);

  const fetchAiSummary = async () => {
    if (!inputUrl.trim()) {
      alert("요약할 뉴스 기사의 URL을 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const LAMBDA_URL = "https://v4xrn4xija7ewrclywuizj37ya0ctxmq.lambda-url.us-east-1.on.aws/";
      
      // 사용자가 입력한 URL을 body에 담아 POST 요청을 보냅니다.
      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`서버 응답 에러: ${response.status}`);
      }

      const data = await response.json();
      
      let result;
      if (data.body) {
        result = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      } else {
        result = data;
      }

      setNews({
        title: result.title || "제목 분석 실패",
        summary: result.summary || "내용을 요약할 수 없습니다.",
      });

    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      alert("뉴스를 가져오는 중에 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-3xl bg-white p-10 shadow-2xl dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
        <header className="flex flex-col gap-4 text-center items-center">
          <Image
            className="dark:invert mb-2"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
          <h1 className="text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            AI NEWS INSIGHT
          </h1>
          <p className="text-lg text-slate-500 dark:text-zinc-400">
            요약하고 싶은 기사 주소를 입력하고 버튼을 눌러보세요.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {/* URL 입력창 추가 */}
          <input
            type="text"
            placeholder="뉴스 기사 URL을 입력하세요 (예: https://...)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          
          <button
            onClick={fetchAiSummary}
            disabled={loading}
            className="flex h-16 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-xl font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all disabled:bg-slate-300 dark:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                AI 분석 중...
              </span>
            ) : "지금 요약하기"}
          </button>
        </div>

        {/* 결과창 */}
        {news.title && (
          <div className="mt-2 flex flex-col gap-4 border-t border-slate-100 pt-8 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold w-fit dark:bg-indigo-900/30 dark:text-indigo-400">
              분석 결과
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 leading-tight">
              📌 {news.title}
            </h2>
            <div className="rounded-2xl bg-slate-50 p-7 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-zinc-300 text-lg">
                {news.summary}
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-8 text-slate-400 text-sm">
        © 2024 AI News Summarizer Team. All rights reserved.
      </footer>
    </div>
  );
}