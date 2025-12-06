// src/app/clients/page.tsx
"use client";

import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  status: "ACTIVE" | "INACTIVE" | "LEAD";
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Cargar clientes desde la API al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Error al cargar los clientes.");
        }

        setClients(json.data || []);
      } catch (err: unknown) {
        console.error(err);
        const error = err as Error;
        setError(error.message ?? "Error inesperado al cargar clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "No se pudo crear el cliente.");
      }

      setClients((prev) => [json.data as Client, ...prev]);

      setForm({
        name: "",
        email: "",
        company: "",
        notes: "",
      });
    } catch (err: unknown) {
      console.error(err);
      const error = err as Error;
      setError(error.message ?? "Error inesperado al crear el cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 py-8 text-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Clientes
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Gestiona tus clientes de NovaCRM AI. Esta página usa la API
            <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-[10px]">
              /api/clients
            </code>
            conectada a PostgreSQL mediante Prisma.
          </p>
        </header>

        {/* Layout: formulario + tabla */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {/* Formulario */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40 backdrop-blur">
            <h2 className="text-sm font-semibold text-slate-100">
              Nuevo cliente
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Crea un registro básico. Más adelante podrás vincularlo con
              proyectos, tareas y facturas.
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-[11px] font-medium text-slate-200"
                >
                  Nombre completo *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="Ej: Ana Pérez"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-[11px] font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="cliente@empresa.com"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="company"
                  className="text-[11px] font-medium text-slate-200"
                >
                  Empresa
                </label>
                <input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="Ej: Acme Corp"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="notes"
                  className="text-[11px] font-medium text-slate-200"
                >
                  Notas
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="Contexto, tipo de cliente, intereses..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-cyan-500 px-4 py-2 text-[12px] font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {submitting ? "Creando..." : "Crear cliente"}
              </button>

              {error && (
                <p className="mt-1 text-[11px] text-amber-300">{error}</p>
              )}
            </form>
          </article>

          {/* Tabla */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40 backdrop-blur">
            <h2 className="text-sm font-semibold text-slate-100">
              Clientes registrados
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Estos registros vienen directamente de la base de datos.
            </p>

            {loading ? (
              <p className="mt-4 text-[11px] text-slate-400">
                Cargando clientes...
              </p>
            ) : clients.length === 0 ? (
              <p className="mt-4 text-[11px] text-slate-400">
                No hay clientes aún. Crea el primero usando el formulario.
              </p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60">
                <table className="min-w-full border-separate border-spacing-0 text-left text-[11px]">
                  <thead className="bg-slate-950/90 text-slate-400">
                    <tr>
                      <th className="px-3 py-2 font-medium">Nombre</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                      <th className="px-3 py-2 font-medium">Empresa</th>
                      <th className="px-3 py-2 font-medium">Estado</th>
                      <th className="px-3 py-2 font-medium">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, idx) => (
                      <tr
                        key={client.id}
                        className={
                          idx % 2 === 0
                            ? "bg-slate-950/40"
                            : "bg-slate-900/40"
                        }
                      >
                        <td className="px-3 py-2 text-slate-100">
                          {client.name}
                        </td>
                        <td className="px-3 py-2 text-slate-300">
                          {client.email || "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-300">
                          {client.company || "—"}
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                            {client.status === "ACTIVE"
                              ? "Activo"
                              : client.status === "LEAD"
                              ? "Lead"
                              : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-400">
                          {new Date(client.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
