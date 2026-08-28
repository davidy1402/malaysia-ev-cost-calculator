import React from 'react';
import { Zap, RotateCcw, Share2, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenSettings,
  onOpenShare
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <Zap size={20} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">
                EV 试驾电费对比器
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                TNB 2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 sm:text-xs">
              展厅即时测算 · 真实电费与油费省钱模型
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.98]"
            title="高级参数设置"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
            <span className="hidden sm:inline">参数微调</span>
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-500 active:scale-[0.98]"
            title="复制对比报告"
          >
            <Share2 size={16} strokeWidth={1.75} />
            <span>分享报告</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.98]"
            title="重置为默认值"
            aria-label="重置"
          >
            <RotateCcw size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
