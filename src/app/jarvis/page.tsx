import fs from "node:fs";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import JarvisDashboardClient from "./JarvisDashboardClient";

// Force Next.js to re-render this page on every request (never static-cache).
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Resolve the dashboard data directory.
 * Priority:
 *   1. DASHBOARD_DATA_DIR env var (absolute path override)
 *   2. data/dashboard relative to the project root (works on Vercel & local dev)
 */
function dashboardDir(): string {
  return (
    process.env.DASHBOARD_DATA_DIR ||
    path.join(process.cwd(), "data", "dashboard")
  );
}

function loadJsonFromDisk<T>(relativePath: string): T {
  const fullPath = path.join(dashboardDir(), relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw) as T;
}

async function loadDashboardData() {
  const liveEnabled = process.env.NEXT_PUBLIC_LIVE_DASHBOARD_ENABLED === "true";
  const liveUrl = process.env.LIVE_DASHBOARD_API_URL;

  if (liveEnabled && liveUrl) {
    try {
      const res = await fetch(liveUrl, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && json.tasks && json.human_tasks && json.products && json.upwork_messages) {
          return {
            tasks: json.tasks,
            humanTasks: json.human_tasks,
            products: json.products,
            upworkMessages: json.upwork_messages,
          };
        }
      }
    } catch (err) {
      console.error("[jarvis] Live dashboard fetch failed, falling back to disk:", err);
    }
  }

  // Fallback to local/bundled JSON from disk.
  return {
    tasks: loadJsonFromDisk<Record<string, unknown>[]>("tasks.json"),
    products: loadJsonFromDisk<Record<string, unknown>[]>("products.json"),
    humanTasks: loadJsonFromDisk<Record<string, unknown>[]>("human-tasks.json"),
    upworkMessages: loadJsonFromDisk<Record<string, unknown>[]>("upwork-messages.json"),
  };
}

export default async function JarvisDashboardPage() {
  noStore();

  const { tasks, products, humanTasks, upworkMessages } = await loadDashboardData();

  // Best-effort load of OS health state from local filesystem (v0.1).
  let osHealth: any = null;
  try {
    const osHealthPath = path.join(process.cwd(), "state", "os-health.json");
    if (fs.existsSync(osHealthPath)) {
      const raw = fs.readFileSync(osHealthPath, "utf8");
      osHealth = JSON.parse(raw);
    }
  } catch (err) {
    console.error("[jarvis] Failed to load os-health.json:", err);
  }

  // Best-effort load Blink.new portfolio metrics.
  let blinkPortfolio: any = null;
  try {
    const blinkPath = path.join(process.cwd(), "state", "blink-portfolio.json");
    if (fs.existsSync(blinkPath)) {
      const raw = fs.readFileSync(blinkPath, "utf8");
      blinkPortfolio = JSON.parse(raw);
    }
  } catch (err) {
    console.error("[jarvis] Failed to load blink-portfolio.json:", err);
  }

  return (
    <JarvisDashboardClient
      tasks={tasks as any}
      products={products as any}
      humanTasks={humanTasks as any}
      upworkMessages={upworkMessages as any}
      osHealth={osHealth}
      blinkPortfolio={blinkPortfolio}
    />
  );
}
