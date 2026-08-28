import React, { useState } from 'react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { generateShareReport } from '../utils/formatter';

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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateShareReport(inputs, result);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback: ignore
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl border border-line bg-surface p-5 shadow-pop sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Share2 size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-ink">分享对比报告</h3>
              <p className="text-[11px] text-muted">一键复制，发给 WhatsApp 或贴进 Obsidian</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
            aria-label="关闭"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* Text Preview Box */}
        <pre className="mt-4 h-64 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-line bg-inset p-4 text-[11px] leading-relaxed text-ink">
          {reportText}
        </pre>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
              copied
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line bg-surface text-ink hover:border-line-strong'
            }`}
          >
            {copied ? (
              <>
                <Check size={15} strokeWidth={1.75} />
                <span>已复制！</span>
              </>
            ) : (
              <>
                <Copy size={15} strokeWidth={1.75} />
                <span>复制全文</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-onbrand shadow-card transition-all hover:bg-brand-strong active:scale-[0.98]"
          >
            <MessageCircle size={15} strokeWidth={1.75} />
            <span>发 WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

