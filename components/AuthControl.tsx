"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthControl({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession();

  if (compact) {
    return status === "authenticated"
      ? <button onClick={() => signOut()} type="button" className="text-[11px] text-text-secondary hover:text-ferxxo-green">Salir</button>
      : <button onClick={() => signIn("github")} disabled={status === "loading"} type="button" className="text-[11px] font-semibold text-ferxxo-green hover:text-white disabled:opacity-50">Entrar con GitHub</button>;
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ferxxo-dark to-accent-purple/70 text-xs font-bold text-white">
        {session?.user?.image ? <img src={session.user.image} alt="" className="h-full w-full object-cover" /> : (session?.user?.name?.[0] ?? "U")}
      </span>
      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-text-primary">{session?.user?.name ?? "Tu perfil"}</span><span className="block truncate text-[10px] text-text-secondary">{status === "authenticated" ? "Sesión con GitHub" : "Docente · En formación"}</span></span>
      {status === "authenticated" ? <button onClick={() => signOut()} className="text-[10px] text-text-secondary hover:text-ferxxo-green" type="button">Salir</button> : <button onClick={() => signIn("github")} disabled={status === "loading"} className="text-[10px] font-semibold text-ferxxo-green hover:text-white disabled:opacity-50" type="button">Entrar</button>}
    </div>
  );
}
