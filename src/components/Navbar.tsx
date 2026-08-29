import React from 'react';
import { Zap, RotateCcw, Share2, SlidersHorizontal, Sun, Moon, Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-onbrand shadow-card">
            <Zap size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-ink tracking-tight leading-tight">
              {t.navbar.title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 items-center gap-1 px-2.5 rounded-full border border-line bg-surface text-ink text-xs font-semibold shadow-card transition-all hover:border-brand/40 active:scale-95"
            title="Switch Language / 切换语言"
            aria-label="Switch Language"
          >
            <Languages size={14} className="text-brand" />
            <span>{language === 'zh' ? 'EN' : '中文'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtn}
            title={theme === 'dark' ? t.navbar.themeLight : t.navbar.themeDark}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={16} strokeWidth={1.75} />
            ) : (
              <Moon size={16} strokeWidth={1.75} />
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className={iconBtn}
            title={t.navbar.settings}
            aria-label="Settings"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className={iconBtn}
            title={t.navbar.reset}
            aria-label="Reset"
          >
            <RotateCcw size={16} strokeWidth={1.75} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={onOpenShare}
            className={iconBtn}
            title={t.navbar.share}
            aria-label="Share"
          >
            <Share2 size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
