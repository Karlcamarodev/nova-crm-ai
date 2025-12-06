export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#020617] text-white">
      <h1 className="text-5xl font-bold mb-4 tracking-tight">
        NovaCRM <span className="text-cyan-400">AI</span>
      </h1>

      <p className="text-lg text-gray-300 max-w-xl mb-10">
        Plataforma moderna de gestión empresarial.  
        Optimizada, modular y lista para potenciarse con inteligencia artificial.
      </p>

      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
        >
          Ir al Dashboard
        </a>

        <a
          href="/clients"
          className="px-6 py-3 rounded-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-semibold transition"
        >
          Gestión de Clientes
        </a>
      </div>

      <footer className="mt-20 text-sm text-gray-500">
        Construido por KarlCamarodev • NovaCRM AI © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
