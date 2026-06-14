import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center flex-col h-screen gap-3">
      <h1 className="text-4xl font-bold text-center">Welcome To QKana</h1>
      <p className="text-center text-muted-foreground">Simple app to learn Japanese Hiragana & Katakana</p>
      <div className="flex gap-3 mt-2">
        <Link
          href="/learning"
          className="font-medium bg-slate-100 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-200 transition-all duration-200 text-sm"
        >
          Study Chart
        </Link>
        <Link
          href="/quiz"
          className="font-medium bg-slate-800 text-slate-100 px-4 py-2 rounded-md hover:bg-slate-900 transition-all duration-200 text-sm"
        >
          Start Quiz →
        </Link>
      </div>
    </main>
  );
}
