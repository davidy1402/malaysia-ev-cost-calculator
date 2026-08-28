import React from 'react';
import { Zap, RotateCcw, Share2, SlidersHorizontal, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const iconBtn =
  'flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted ' +
  'transition-all hover:border-line-strong hover:text-ink active:scale-95';

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenSettings,
  onOpenShare,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-onbrand shadow-card">
          <Zap size={18} strokeWidth={1.75} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtn}
            title={theme === 'dark' ? '切换到浅色' : '切换到深色'}
            aria-label="切换主题"
          >
            {theme === 'dark' ? (
              <Sun size={16} strokeWidth={1.75} />
            ) : (
              <Moon size={16} strokeWidth={1.75} />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className={iconBtn}
            title="高级参数设置"
            aria-label="高级参数设置"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onReset}
            className={iconBtn}
            title="重置为默认值"
            aria-label="重置"
          >
            <RotateCcw size={16} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            className={iconBtn}
            title="复制对比报告"
            aria-label="复制对比报告"
          >
            <Share2 size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};

