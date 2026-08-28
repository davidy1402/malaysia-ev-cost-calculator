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
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Share2 size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                生成试驾对比报告
              </h3>
              <p className="text-xs text-zinc-400">
                支持一键复制到 WhatsApp 或 Obsidian
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-800/80 text-zinc-400 hover:text-zinc-100"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="mt-4">
          <pre className="h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-[11px] font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap selection:bg-emerald-500/30">
            {reportText}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-700 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">已复制到剪贴板！</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>复制完整文本</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            <span>发送到 WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
