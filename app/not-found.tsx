import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center text-center p-6"
      style={{ backgroundColor: '#020617' }}
    >
      <h1 className="text-9xl font-black mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent opacity-30">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-slate-400 mb-10 max-w-md text-base leading-relaxed">
        요청하신 페이지를 찾을 수 없습니다. <br />
        입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 rounded-full text-sm font-semibold tracking-wide"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
