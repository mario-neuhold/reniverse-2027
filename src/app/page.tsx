"use client";

import dynamic from "next/dynamic";

const Reniverse = dynamic(() => import("@/components/Reniverse").then((m) => m.Reniverse), {
  ssr: false,
  loading: () => <div className="fixed inset-0 grid place-items-center bg-[#030014] text-white/60">Loading the Reniverse…</div>,
});

export default function Home() {
  return <Reniverse />;
}
