"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const links = [
    { href: "/dashboard", label: "Asosiy" },
    { href: "/dashboard/analytics", label: "Tahlil" },
    { href: "/dashboard/savings", label: "Maqsadlar" },
    { href: "/dashboard/credit", label: "Kredit" },
    { href: "/dashboard/advisor", label: "AI Maslahatchi" },
  ];

  return (
    <>
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

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div ref={menuRef} className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 md:hidden z-50 shadow-lg">
          <nav className="flex flex-col space-y-4 text-sm font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 transition-colors ${isActive ? "text-slate-900 font-bold" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
