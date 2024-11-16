import NavBar from './components/NavBar';

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="items-center justify-center min-h-screen p-16 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-4 items-center">
          <p className="font-semibold text-6xl tracking-wide">SIJARTA</p>
          <p className="text-lg text-center">Sistem Informasi Jasa Rumah Tangga</p>
        </main>
      </div>
    </>
  );
}
