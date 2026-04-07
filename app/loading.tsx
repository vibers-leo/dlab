export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#020617' }}
    >
      <div className="w-12 h-12 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin mb-4"></div>
      <div className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase animate-pulse">
        Loading
      </div>
    </div>
  );
}
