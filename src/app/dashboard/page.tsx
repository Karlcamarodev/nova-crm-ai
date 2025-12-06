"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type ClientStatus = "ACTIVE" | "INACTIVE" | "LEAD";

type Client = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: ClientStatus;
  createdAt: string; // viene como string del API
};

type ClientsApiResponse = {
  data: Client[];
  error?: string;
};

type MonthlyPoint = {
  month: string;
  total: number;
  active: number;
  inactive: number;
  leads: number;
};

type StatusPoint = {
  status: string;
  count: number;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales desde la API /api/clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const json: ClientsApiResponse = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Error al cargar los clientes.");
        }

        setClients(json.data ?? []);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Error inesperado al cargar los clientes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // KPIs principales
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => c.status === "ACTIVE"
  ).length;
  const leadClients = clients.filter((c) => c.status === "LEAD").length;

  // Datos agrupados por mes
  const monthlyData: MonthlyPoint[] = useMemo(() => {
    const map = new Map<
      string,
      { total: number; active: number; inactive: number; leads: number }
    >();

    clients.forEach((client) => {
      const date = new Date(client.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      const current = map.get(key) ?? {
        total: 0,
        active: 0,
        inactive: 0,
        leads: 0,
      };

      current.total += 1;
      if (client.status === "ACTIVE") current.active += 1;
      if (client.status === "INACTIVE") current.inactive += 1;
      if (client.status === "LEAD") current.leads += 1;

      map.set(key, current);
    });

    const result: MonthlyPoint[] = Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, value]) => {
        const [year, monthIndex] = key.split("-").map(Number);
        const label = new Date(year, monthIndex - 1, 1).toLocaleDateString(
          "es-ES",
          { month: "short", year: "2-digit" }
        );

        return {
          month: label,
          total: value.total,
          active: value.active,
          inactive: value.inactive,
          leads: value.leads,
        };
      });

    return result;
  }, [clients]);

  // Datos para gráfica de barras (por estado)
  const statusData: StatusPoint[] = useMemo(
    () => [
      { status: "Activos", count: activeClients },
      {
        status: "Leads",
        count: leadClients,
      },
      {
        status: "Inactivos",
        count: clients.filter((c) => c.status === "INACTIVE").length,
      },
    ],
    [clients, activeClients, leadClients]
  );

  return (
    <main className="min-h-screen bg-slate-950 py-8 text-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Resumen analítico de tus clientes en{" "}
            <span className="font-semibold text-cyan-300">
              NovaCRM AI
            </span>
            . Los datos provienen de la base PostgreSQL vía Prisma.
          </p>
        </header>

        {/* KPIs */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
            <p className="text-[11px] font-medium text-slate-400">
              Clientes totales
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalClients}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Registros únicos en tu CRM.
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg shadow-emerald-900/40">
            <p className="text-[11px] font-medium text-emerald-200">
              Clientes activos
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {activeClients}
            </p>
            <p className="mt-1 text-[11px] text-emerald-200/70">
              Clientes con estado <span className="font-semibold">ACTIVE</span>.
            </p>
          </article>

          <article className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 shadow-lg shadow-cyan-900/40">
            <p className="text-[11px] font-medium text-cyan-200">
              Leads
            </p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">
              {leadClients}
            </p>
            <p className="mt-1 text-[11px] text-cyan-200/70">
              Clientes en estado <span className="font-semibold">LEAD</span>.
            </p>
          </article>
        </section>

        {/* Estado de carga / error */}
        {loading && (
          <p className="mt-2 text-[11px] text-slate-400">
            Cargando datos del dashboard...
          </p>
        )}
        {error && (
          <p className="mt-2 text-[11px] text-amber-300">
            {error}
          </p>
        )}

        {/* Gráficos */}
        {!loading && !error && (
          <section className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {/* LineChart: evolución mensual */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
              <h2 className="text-sm font-semibold text-slate-100">
                Evolución de clientes por mes
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Altas mensuales de clientes, segmentadas por estado.
              </p>

              <div className="mt-4 h-64">
                {monthlyData.length === 0 ? (
                  <p className="text-[11px] text-slate-500">
                    Aún no hay suficientes datos históricos. Crea más
                    clientes para ver la evolución.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "#1e293b",
                          borderRadius: 12,
                          fontSize: 11,
                          color: "#e2e8f0",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="active"
                        name="Activos"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        name="Leads"
                        stroke="#eab308"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            {/* BarChart: distribución por estado */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
              <h2 className="text-sm font-semibold text-slate-100">
                Distribución por estado
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Cómo se reparten tus clientes entre activos, leads e
                inactivos.
              </p>

              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#1e293b",
                        borderRadius: 12,
                        fontSize: 11,
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Clientes"
                      radius={[8, 8, 0, 0]}
                      fill="#22c55e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
