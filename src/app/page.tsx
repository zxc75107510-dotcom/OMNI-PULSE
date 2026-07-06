import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <div className="omni-stage relative min-h-screen overflow-hidden bg-[#010510]">
      <div className="pointer-events-none absolute left-[10%] top-[14%] h-80 w-80 rounded-full bg-[#1d4ed8] opacity-20 blur-[150px]" />
      <div className="pointer-events-none absolute right-[8%] top-[8%] h-96 w-96 rounded-full bg-[#1e3a8a] opacity-20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[8%] left-[38%] h-96 w-96 rounded-full bg-[#1d4ed8] opacity-20 blur-[150px]" />
      <Dashboard />
    </div>
  );
}
