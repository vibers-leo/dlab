"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#020617' }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
        문제가 발생했습니다
      </h2>
      <p className="text-slate-400 mb-8 max-w-md text-base leading-relaxed">
        일시적인 오류일 수 있습니다.
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 rounded-full font-semibold text-sm"
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-slate-700 text-slate-300 hover:border-red-500/30 hover:text-white transition-all duration-300 rounded-full font-semibold text-sm inline-flex items-center"
        >
          홈으로 가기
        </a>
      </div>
    </div>
  );
}
