import DeployGuidePage from "@/app/dashboard/deploy/page";
import { Navbar } from "@/components/navbar";

export default function StandaloneDeployPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DeployGuidePage />
      </main>
    </div>
  );
}
