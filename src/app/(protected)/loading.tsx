export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}
