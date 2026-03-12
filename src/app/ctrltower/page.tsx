import JarvisPage from "../jarvis/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CtrlTowerPage() {
  // Alias so howler-ai.com/ctrltower shows the Jarvis dashboard.
  return <JarvisPage />;
}
