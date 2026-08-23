"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  
  const links = [
    { href: "/dashboard", label: "Asosiy" },
    { href: "/dashboard/analytics", label: "Tahlil" },
    { href: "/dashboard/savings", label: "Maqsadlar" },
    { href: "/dashboard/credit", label: "Kredit" },
    { href: "/dashboard/advisor", label: "AI Maslahatchi" },
  ];

  return (
    <nav className="hidden md:flex space-x-6 text-sm font-medium">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`transition-colors ${isActive ? "text-slate-900 font-bold" : "text-slate-600 hover:text-slate-900"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
