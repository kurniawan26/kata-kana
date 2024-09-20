export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center flex-col h-screen">
      <h1 className="text-4xl font-bold text-center">Welcome To Katakana</h1>
      <p className="text-center mt-4">Simple app to learn japanese letter</p>
      <button className="mt-4 font-bold bg-slate-100 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-800 hover:text-slate-100 transition-all duration-300">
        Start Learning
      </button>
    </main>
  );
}
