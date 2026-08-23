"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
    >
      Tizimdan chiqish
    </button>
  );
}
