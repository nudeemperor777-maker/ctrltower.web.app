"use client";

import { useState, useMemo, useCallback } from "react";

/* ───── Types ───── */

type Task = {
  id: string;
  title: string;
  status: string;
  source?: string;
  type?: string;
  priority?: string;
  blocked?: boolean;
  parent?: string;
  notes?: string;
  execution_mode?: string;
};

type Product = {
  name: string;
  status: string;
  price: number | null;
  currency: string;
};

type BlinkPortfolio = {
  timestamp?: string;
  metrics?: {
    sites_built?: number;
    sites_live?: number;
    monthly_revenue_usd?: number;
  };
};

type HumanTask = {
  id: string;
  title: string;
  status: string;
};

type UpworkMessage = {
  id: string;
  job: string;
  client: string;
  last_message_at: string | null;
  last_snippet: string;
  needs_reply: boolean;
};

type OsHealth = {
  status: string;
  reason: string;
  metrics?: {
    worker_runs?: number | null;
    tasks_completed?: number | null;
    needs_session_saturated_tasks?: number | null;
  };
  updated_at?: string;
};

type Props = {
  tasks: Task[];
  products: Product[];
  humanTasks: HumanTask[];
  upworkMessages: UpworkMessage[];
  osHealth?: OsHealth | null;
  blinkPortfolio?: BlinkPortfolio | null;
};

/* ───── Helpers ───── */

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    if (!groups[k]) groups[k] = [];
    groups[k].push(item);
  }
  return groups;
}

/** Decide glow class based on task source */
function sourceGlow(source?: string): string {
  if (!source) return "glow-cyan";
  const s = source.toLowerCase();
  if (s.includes("upwork")) return "glow-emerald";
  if (s.includes("brand")) return "glow-magenta";
  if (s.includes("web") || s.includes("howler")) return "glow-cyan";
  if (s.includes("os")) return "glow-violet";
  if (s.includes("autonomy") || s.includes("auto")) return "glow-amber";
  if (s.includes("logician")) return "glow-magenta";
  return "glow-cyan";
}

/** Priority badge color */
function priorityColor(priority?: string): string {
  switch (priority) {
    case "High":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "Medium":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Low":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    default:
      return "bg-slate-700/30 text-slate-500 border-slate-600/30";
  }
}

/** Lane column header accent */
function laneAccent(lane: string): string {
  switch (lane) {
    case "Backlog":
      return "border-l-slate-500";
    case "Active":
      return "border-l-cyan-400";
    case "Done":
      return "border-l-emerald-400";
    default:
      return "border-l-slate-600";
  }
}

/* ───── Sub-Components ───── */

function TaskCard({ task, isExpanded, onToggle }: {
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`
        jarvis-card ${sourceGlow(task.source)}
        rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 cursor-pointer
        select-none backdrop-blur-sm
        ${isExpanded ? "task-card-expanded ring-1 ring-cyan-500/20" : ""}
      `}
    >
      {/* Compact view */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="task-id text-slate-500">{task.id}</div>
          <div className="text-sm text-slate-200 leading-snug mt-0.5">
            {task.title}
          </div>
        </div>
        {task.priority && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded border shrink-0 mt-1 ${priorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      {/* Expanded detail view */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <Detail label="Status" value={task.status} />
            <Detail label="Source" value={task.source || "—"} />
            <Detail label="Type" value={task.type || "—"} />
            <Detail label="Priority" value={task.priority || "—"} />
            <Detail label="Exec Mode" value={task.execution_mode || "—"} />
            <Detail
              label="Blocked"
              value={task.blocked ? "⚠ Yes" : "No"}
              warn={task.blocked}
            />
            {task.parent && <Detail label="Parent" value={task.parent} />}
          </div>
          {task.notes && (
            <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 rounded p-2 mt-2 border border-slate-800/40">
              <span className="text-slate-500 font-semibold">Notes:</span>{" "}
              {task.notes}
            </div>
          )}
          <div className="text-[10px] text-slate-600 pt-1">
            Click to collapse • ● {task.id}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <span className="text-slate-500">{label}:</span>{" "}
      <span className={warn ? "text-amber-400" : "text-slate-300"}>
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  sigil,
  glowClass,
  pulse,
}: {
  label: string;
  value: number;
  sub: string;
  sigil: string;
  glowClass: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`
        jarvis-card ${glowClass}
        rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2
        backdrop-blur-sm
        ${pulse && value > 0 ? "pulse-subtle" : ""}
      `}
    >
      <div className={`text-[10px] uppercase tracking-wider text-slate-500 section-label sigil sigil-${sigil}`}>
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-lg font-semibold text-slate-100 tabular-nums">
          {value}
        </span>
        <span className="text-[10px] text-slate-500">{sub}</span>
      </div>
    </div>
  );
}

/* ───── Agile Reports Widget ───── */

function AgileReports({ tasks }: { tasks: Task[] }) {
  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "Done");
    const active = tasks.filter((t) => t.status === "Active");
    const backlog = tasks.filter((t) => t.status === "Backlog");
    const total = tasks.length;

    // Group by source/project
    const activeByProject = groupBy(active, (t) => t.source || "Unknown");
    const doneByProject = groupBy(done, (t) => t.source || "Unknown");

    // Unique projects
    const allProjects = [...new Set(tasks.map((t) => t.source || "Unknown"))];

    // Types breakdown
    const typeBreakdown = groupBy(tasks, (t) => t.type || "other");

    // Blocked count
    const blocked = tasks.filter((t) => t.blocked).length;

    // Velocity proxy: done / total
    const velocityPct = total > 0 ? Math.round((done.length / total) * 100) : 0;

    return {
      done: done.length,
      active: active.length,
      backlog: backlog.length,
      total,
      blocked,
      velocityPct,
      activeByProject,
      doneByProject,
      allProjects,
      typeBreakdown,
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 stagger-children">
        <MiniStat label="Done" value={stats.done} color="text-emerald-400" />
        <MiniStat label="Active" value={stats.active} color="text-cyan-400" />
        <MiniStat label="Backlog" value={stats.backlog} color="text-slate-400" />
        <MiniStat label="Blocked" value={stats.blocked} color="text-amber-400" />
      </div>

      {/* Velocity bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Completion velocity</span>
          <span className="text-slate-300 font-mono">{stats.velocityPct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full metric-bar-fill"
            style={{ width: `${stats.velocityPct}%` }}
          />
        </div>
      </div>

      {/* Active by project */}
      <div>
        <h4 className="text-xs text-slate-500 font-semibold mb-2 section-label">
          ⟶ Active by project
        </h4>
        <div className="space-y-1">
          {Object.entries(stats.activeByProject)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([project, items]) => (
              <ProjectBar
                key={project}
                project={project}
                count={items.length}
                max={stats.active}
                color="bg-cyan-500/60"
              />
            ))}
          {stats.active === 0 && (
            <div className="text-xs text-slate-600">No active tasks</div>
          )}
        </div>
      </div>

      {/* Done by project */}
      <div>
        <h4 className="text-xs text-slate-500 font-semibold mb-2 section-label">
          ◉ Done by project
        </h4>
        <div className="space-y-1">
          {Object.entries(stats.doneByProject)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 8)
            .map(([project, items]) => (
              <ProjectBar
                key={project}
                project={project}
                count={items.length}
                max={stats.done}
                color="bg-emerald-500/60"
              />
            ))}
        </div>
      </div>

      {/* Type breakdown */}
      <div>
        <h4 className="text-xs text-slate-500 font-semibold mb-2 section-label">
          ∿ Task types
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(stats.typeBreakdown)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([type, items]) => (
              <span
                key={type}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50"
              >
                {type}{" "}
                <span className="text-slate-500 font-mono">{items.length}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

function OsHealthCard({ osHealth }: { osHealth?: OsHealth | null }) {
  const status = osHealth?.status || "unknown";
  const reason = osHealth?.reason || "OS health metrics not available yet.";
  const updatedAt = osHealth?.updated_at;

  let badgeColor = "bg-slate-700/40 text-slate-300 border-slate-600/40";
  let label = "OS Health";

  if (status === "green") {
    badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    label = "OS Health · Green";
  } else if (status === "yellow") {
    badgeColor = "bg-amber-500/20 text-amber-200 border-amber-500/40";
    label = "OS Health · Yellow";
  } else if (status === "red") {
    badgeColor = "bg-red-500/20 text-red-200 border-red-500/40";
    label = "OS Health · Red";
  }

  return (
    <div className="jarvis-card glow-violet rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 backdrop-blur-sm flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 section-label sigil sigil-os">
          OS Health
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeColor}`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <div className="text-[11px] text-slate-300 leading-snug line-clamp-2">
        {reason}
      </div>
      {updatedAt && (
        <div className="text-[9px] text-slate-500 mt-0.5">
          Updated at {updatedAt}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg px-3 py-2 text-center backdrop-blur-sm">
      <div className={`text-xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function BlinkPortfolioCard({
  blinkPortfolio,
}: {
  blinkPortfolio?: BlinkPortfolio | null;
}) {
  const metrics = blinkPortfolio?.metrics || {};
  const sitesBuilt = metrics.sites_built ?? 0;
  const sitesLive = metrics.sites_live ?? 0;
  const mrr = metrics.monthly_revenue_usd ?? 0;
  const ts = blinkPortfolio?.timestamp;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Sites Built
          </div>
          <div className="text-xl font-semibold text-slate-100 tabular-nums mt-0.5">
            {sitesBuilt}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Sites Live
          </div>
          <div className="text-xl font-semibold text-emerald-400 tabular-nums mt-0.5">
            {sitesLive}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Monthly Revenue
          </div>
          <div className="text-xl font-semibold text-amber-300 tabular-nums mt-0.5">
            ${mrr.toFixed(2)}
          </div>
        </div>
      </div>
      {ts && (
        <div className="text-[10px] text-slate-500">
          Updated: {ts}
        </div>
      )}
      {!blinkPortfolio && (
        <div className="text-xs text-slate-600">
          No Blink.new portfolio data found yet (state/blink-portfolio.json).
        </div>
      )}
    </div>
  );
}

function ProjectBar({
  project,
  count,
  max,
  color,
}: {
  project: string;
  count: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 w-28 truncate shrink-0">{project}</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full metric-bar-fill`}
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <span className="text-slate-500 font-mono w-6 text-right">{count}</span>
    </div>
  );
}

/* ───── Main Dashboard Client ───── */

export default function JarvisDashboardClient({
  tasks,
  products,
  humanTasks,
  upworkMessages,
  osHealth,
  blinkPortfolio,
}: Props) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncButtonEnabled = process.env.NEXT_PUBLIC_LOCAL_SYNC_BUTTON === "true";

  const handleSyncClick = useCallback(async () => {
    if (!syncButtonEnabled || syncing) return;
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/local-sync-dashboard", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        setSyncError(data.error || "Sync failed");
        setSyncStatus(null);
      } else {
        setSyncStatus(data.timestamp || "Synced");
      }
    } catch (err: any) {
      setSyncError(err?.message || "Sync failed");
      setSyncStatus(null);
    } finally {
      setSyncing(false);
    }
  }, [syncButtonEnabled, syncing]);

  const backlogTasks = useMemo(() => tasks.filter((t) => t.status === "Backlog"), [tasks]);
  const activeTasks = useMemo(() => tasks.filter((t) => t.status === "Active"), [tasks]);
  const doneTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === "Done")
      .slice()
      .sort((a: any, b: any) => {
        const aTs = a.completed_at || "";
        const bTs = b.completed_at || "";
        if (aTs && bTs) return bTs.localeCompare(aTs);
        if (aTs) return -1;
        if (bTs) return 1;
        return 0;
      });
  }, [tasks]);
  const activeHumanTasks = useMemo(() => humanTasks.filter((t) => t.status === "Open"), [humanTasks]);
  const needsReplyMessages = useMemo(() => upworkMessages.filter((m) => m.needs_reply), [upworkMessages]);

  const toggleTask = useCallback((id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <main className="jarvis-bg text-slate-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <header className="relative z-10 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl opacity-40" aria-hidden="true">⊛</span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Jarvis Control Tower
              <span className="text-xs font-normal text-slate-500 ml-2">v2.5</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              People&apos;s Palantir — esoteric ops at a glance
            </p>
          </div>
        </div>

        {/* Local sync control (local-only via env) */}
        {syncButtonEnabled && (
          <div className="jarvis-card glow-cyan mb-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <div className="font-semibold">Sync dashboard → public /ctrltower</div>
              <div className="text-[10px] text-slate-500">
                Push latest workspace tasks/human tasks to the live control tower.
              </div>
              {syncStatus && (
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  Last sync: {syncStatus}
                </div>
              )}
              {syncError && (
                <div className="text-[10px] text-amber-400 mt-0.5">
                  Sync error: {syncError}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={syncing}
              className="text-[11px] px-3 py-1.5 rounded-md border border-cyan-500/60 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {syncing ? "Syncing…" : "Run sync"}
            </button>
          </div>
        )}

        {/* Status strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 stagger-children">
          <OsHealthCard osHealth={osHealth} />
          <StatCard
            label="Tasks"
            value={activeTasks.length}
            sub={`active · ${backlogTasks.length} backlog`}
            sigil="tasks"
            glowClass="glow-cyan"
          />
          <StatCard
            label="Human Tasks"
            value={activeHumanTasks.length}
            sub="waiting on you"
            sigil="human"
            glowClass="glow-amber"
            pulse
          />
          <StatCard
            label="Upwork"
            value={needsReplyMessages.length}
            sub="messages need reply"
            sigil="upwork"
            glowClass="glow-emerald"
            pulse
          />
          <StatCard
            label="Done"
            value={doneTasks.length}
            sub="tasks completed"
            sigil="done"
            glowClass="glow-violet"
          />
        </div>
      </header>

      {/* ── Agile Reports ── */}
      <section className="jarvis-card glow-cyan rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-report">
          Agile Reports
        </h2>
        <AgileReports tasks={tasks} />
      </section>

      {/* ── Kanban ── */}
      <section className="jarvis-card glow-magenta rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-tasks">
          Tasks — Kanban
        </h2>
        <p className="text-[10px] text-slate-600 mb-3">
          Click any card to expand details
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KanbanLane
            title="Backlog"
            count={backlogTasks.length}
            tasks={backlogTasks}
            expandedTaskId={expandedTaskId}
            onToggle={toggleTask}
          />
          <KanbanLane
            title="Active"
            count={activeTasks.length}
            tasks={activeTasks}
            expandedTaskId={expandedTaskId}
            onToggle={toggleTask}
          />
          <KanbanLane
            title="Done"
            count={doneTasks.length}
            tasks={doneTasks}
            expandedTaskId={expandedTaskId}
            onToggle={toggleTask}
          />
        </div>
      </section>

      {/* ── Blink.new Portfolio ── */}
      <section className="jarvis-card glow-violet rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-money">
          Blink.new Portfolio
        </h2>
        <BlinkPortfolioCard blinkPortfolio={blinkPortfolio} />
      </section>

      {/* ── Upwork Messages ── */}
      <section className="jarvis-card glow-emerald rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-upwork">
          Upwork Messages
        </h2>
        <ul className="space-y-1.5 text-sm">
          {upworkMessages.length === 0 && (
            <li className="text-xs text-slate-600">
              No messages loaded. Run upwork-messages-import.sh when you have an
              export.
            </li>
          )}
          {upworkMessages.map((m) => (
            <li
              key={m.id}
              className="jarvis-card glow-emerald flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="task-id text-slate-500">{m.id}</span>
                {m.needs_reply && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 pulse-subtle">
                    Needs reply
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300">
                {m.job || "Untitled job"} — {m.client || "Unknown client"}
              </div>
              {m.last_message_at && (
                <div className="text-[10px] text-slate-500">
                  Last message: {m.last_message_at}
                </div>
              )}
              {m.last_snippet && (
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {m.last_snippet}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Products & OS ── */}
      <section className="jarvis-card glow-violet rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-money">
          Products &amp; OS
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {products.map((p) => (
            <div
              key={p.name}
              className="jarvis-card glow-violet rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-slate-100">{p.name}</div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/40">
                  {p.status}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {p.price != null ? `${p.currency} ${p.price}` : "TBD"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Human Tasks ── */}
      <section className="jarvis-card glow-amber rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm relative z-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 section-label sigil sigil-human">
          Human Tasks
        </h2>
        <ul className="space-y-1.5 text-sm">
          {activeHumanTasks.map((ht) => (
            <li
              key={ht.id}
              className="jarvis-card glow-amber flex gap-2 items-start rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 backdrop-blur-sm"
            >
              <span className="task-id text-slate-500 w-32 shrink-0 pt-0.5">
                {ht.id}
              </span>
              <span className="text-slate-200">{ht.title}</span>
            </li>
          ))}
          {activeHumanTasks.length === 0 && (
            <li className="text-xs text-slate-600">No open human tasks ✓</li>
          )}
        </ul>
      </section>

      {/* Footer sigil */}
      <footer className="relative z-10 text-center py-6 text-slate-700 text-xs">
        <span className="opacity-30 text-lg">⊛</span>
        <div className="mt-1">People&apos;s Palantir · Esoteric Control Tower</div>
      </footer>
    </main>
  );
}

/* ───── Kanban Lane ───── */

function KanbanLane({
  title,
  count,
  tasks,
  expandedTaskId,
  onToggle,
  truncated,
  totalCount,
}: {
  title: string;
  count: number;
  tasks: Task[];
  expandedTaskId: string | null;
  onToggle: (id: string) => void;
  truncated?: boolean;
  totalCount?: number;
}) {
  return (
    <div>
      <h3
        className={`text-xs font-semibold text-slate-400 mb-2 pl-2 border-l-2 ${laneAccent(title)} section-label`}
      >
        {title} ({count})
      </h3>
      <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
        {tasks.map((t, idx) => (
          <TaskCard
            key={`${t.id}-${idx}`}
            task={t}
            isExpanded={expandedTaskId === t.id}
            onToggle={() => onToggle(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
