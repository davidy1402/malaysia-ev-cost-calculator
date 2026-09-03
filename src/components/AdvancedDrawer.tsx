import React, { useState } from 'react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { generateShareReport } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Copy, Check, MessageCircle, SlidersHorizontal, Fuel, BatteryCharging, Zap } from 'lucide-react';

interface AdvancedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange: (patch: Partial<UserInputs>) => void;
}

export const AdvancedDrawer: React.FC<AdvancedDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  result,
  onChange
}) => {
  const { language, t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateShareReport(inputs, result, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-[70] max-h-[92vh] flex flex-col rounded-t-2xl border-t border-border-subtle bg-surface-raised shadow-2xl transition-transform duration-300 ease-out">
        {/* Pull handle */}
        <div className="flex justify-center p-2.5">
          <div className="h-1.5 w-12 rounded-full bg-border-strong" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-overlay text-brand-primary">
                <SlidersHorizontal size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{t.settingsDrawer.title}</h2>
                <p className="text-xs text-text-secondary">{t.settingsDrawer.sub}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-4 text-sm">
            {/* 1. Petrol parameters */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <Fuel size={15} className="text-brand-primary" />
                <span>{t.settingsDrawer.petrolSection}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">{t.settingsDrawer.petrolPrice}</label>
                  <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay px-2.5 py-1.5">
                    <span className="text-xs text-text-secondary mr-1">RM</span>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.petrolPricePerLiter}
                      onChange={(e) => onChange({ petrolPricePerLiter: parseFloat(e.target.value) || 1.99 })}
                      className="w-full bg-transparent font-display text-xs text-text-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary block mb-1">{t.settingsDrawer.petrolKmPerL}</label>
                  <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay px-2.5 py-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={inputs.petrolFuelEfficiencyKmPerL}
                      onChange={(e) => onChange({ petrolFuelEfficiencyKmPerL: parseFloat(e.target.value) || 14.0 })}
                      className="w-full bg-transparent font-display text-xs text-text-primary outline-none"
                    />
                    <span className="text-xs text-text-secondary ml-1">km/L</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EV parameters */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <BatteryCharging size={15} className="text-brand-primary" />
                <span>{t.settingsDrawer.evSection}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">{t.settingsDrawer.chargingLoss}</label>
                  <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay px-2.5 py-1.5">
                    <input
                      type="number"
                      step="1"
                      value={Math.round((1 - inputs.chargingEfficiency) * 100)}
                      onChange={(e) => {
                        const loss = parseFloat(e.target.value) || 10;
                        onChange({ chargingEfficiency: (100 - loss) / 100 });
                      }}
                      className="w-full bg-transparent font-display text-xs text-text-primary outline-none"
                    />
                    <span className="text-xs text-text-secondary ml-1">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary block mb-1">{t.settingsDrawer.publicDcPrice}</label>
                  <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay px-2.5 py-1.5">
                    <span className="text-xs text-text-secondary mr-1">RM</span>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.publicDcPricePerKwh}
                      onChange={(e) => onChange({ publicDcPricePerKwh: parseFloat(e.target.value) || 1.40 })}
                      className="w-full bg-transparent font-display text-xs text-text-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. TNB & AFA parameters */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <Zap size={15} className="text-brand-accent" />
                <span>{t.settingsDrawer.tnbSection}</span>
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">{t.settingsDrawer.afaRate}</label>
                <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay px-2.5 py-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.afaRateSen}
                    onChange={(e) => onChange({ afaRateSen: parseFloat(e.target.value) || 3.80 })}
                    className="w-full bg-transparent font-display text-xs text-text-primary outline-none"
                  />
                  <span className="text-xs text-text-secondary ml-1">sen/kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Report Section */}
          <div className="space-y-3 border-t border-border-subtle pt-4">
            <h3 className="text-sm font-semibold text-text-primary">{t.shareModal.title}</h3>
            <pre className="h-44 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border-subtle bg-surface-base p-3 font-display text-[11px] leading-relaxed text-text-secondary">
              {reportText}
            </pre>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-overlay py-2.5 text-xs font-semibold text-text-primary active:scale-[0.98]"
              >
                {isCopied ? <Check size={16} className="text-brand-primary" /> : <Copy size={16} />}
                <span>{isCopied ? t.shareModal.copiedBtn : t.shareModal.copyBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-text-inverse shadow active:scale-[0.98]"
              >
                <MessageCircle size={16} />
                <span>{t.shareModal.whatsappBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
