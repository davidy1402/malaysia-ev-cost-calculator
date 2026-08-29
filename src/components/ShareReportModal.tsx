import React, { useState } from 'react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { generateShareReport } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  result
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateShareReport(inputs, result, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Share2 size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-zinc-100">{t.shareModal.title}</h3>
              <p className="text-[11px] text-zinc-400">{t.shareModal.sub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* Text Preview Box */}
        <pre className="mt-4 h-64 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed text-zinc-200">
          {reportText}
        </pre>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
              copied
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {copied ? (
              <>
                <Check size={15} strokeWidth={1.75} />
                <span>{t.shareModal.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy size={15} strokeWidth={1.75} />
                <span>{t.shareModal.copyBtn}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-md transition-all hover:bg-emerald-400 active:scale-[0.98]"
          >
            <MessageCircle size={15} strokeWidth={1.75} />
            <span>{t.shareModal.whatsappBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
