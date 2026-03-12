import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// Local-only API to sync workspace dashboard JSON into the clean ctrltower.web.app repo.
// Guardrails:
// - Only runs when LOCAL_SYNC_ENABLED === "true".
// - Does nothing on Vercel (process.env.VERCEL is set there).
// - Only executes the script specified by LOCAL_SYNC_SCRIPT.

export async function POST() {
  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      { error: "Local sync API is disabled on Vercel." },
      { status: 404 },
    );
  }

  if (process.env.LOCAL_SYNC_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Local sync API is not enabled (set LOCAL_SYNC_ENABLED=true)." },
      { status: 403 },
    );
  }

  const script = process.env.LOCAL_SYNC_SCRIPT;
  if (!script) {
    return NextResponse.json(
      { error: "LOCAL_SYNC_SCRIPT is not configured." },
      { status: 500 },
    );
  }

  try {
    const { stdout, stderr } = await execFileAsync(script, [], {
      timeout: 120000, // 2 minutes
    });

    const tail = (s: string) => {
      const lines = s.trim().split("\n");
      return lines.slice(-10).join("\n");
    };

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      stdout: tail(stdout || ""),
      stderr: tail(stderr || ""),
    });
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    const stderr = err?.stderr?.toString?.() ?? "";
    return NextResponse.json(
      {
        status: "error",
        error: msg,
        stderr,
      },
      { status: 500 },
    );
  }
}
