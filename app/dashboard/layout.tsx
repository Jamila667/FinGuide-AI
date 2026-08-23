import { ReactNode } from "react";

import LogoutButton from "@/components/LogoutButton";

import NavLinks from "@/components/NavLinks";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="relative border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">FinGuide</h1>
            <NavLinks />
          </div>
          <LogoutButton />
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
