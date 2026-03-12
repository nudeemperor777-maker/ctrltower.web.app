import JarvisPage from "../jarvis/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ControlTowerPage() {
  // Simple alias so howler-ai.com/controltower shows the Jarvis dashboard.
  return <JarvisPage />;
}
