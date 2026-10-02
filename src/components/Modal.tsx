"use client";

import { type ReactNode, useEffect, useRef } from "react";

type Props = { title: string; subtitle: ReactNode; onClose: () => void; children: ReactNode };

export function Modal({ title, subtitle, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(96vw,960px)] overflow-y-auto rounded-xl border border-white/20 bg-[#120b2e] p-0 text-white shadow-2xl shadow-black/80 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
        <button onClick={() => ref.current?.close()} aria-label="Close" className="h-10 w-10 shrink-0 rounded-full text-2xl hover:bg-white/10">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
