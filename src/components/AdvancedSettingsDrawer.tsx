import React from 'react';
import { UserInputs } from '../types/calculator';
import { X, SlidersHorizontal, BatteryCharging, Zap, Fuel } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AdvancedSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  onChange: (patch: Partial<UserInputs>) => void;
}

const fieldLabel = 'mb-1 block text-[11px] font-semibold text-muted';
const fieldInput =
  'w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs font-semibold font-mono text-ink ' +
  'transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

function SettingsSection({
  icon,
  title,
  chipClass,
  children
}: {
  icon: React.ReactNode;
  title: string;
  chipClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${chipClass}`}>{icon}</span>
        <span className="text-xs font-bold text-ink">{title}</span>
      </div>
      {children}
    </div>
  );
}

export const AdvancedSettingsDrawer: React.FC<AdvancedSettingsDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  onChange
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand shadow-sm">
              <SlidersHorizontal size={16} strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-ink">{t.settingsDrawer.title}</h3>
              <p className="text-[11px] text-muted">{t.settingsDrawer.sub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:text-ink btn-spring"
            aria-label="Close"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* 1. Petrol Settings */}
          <SettingsSection
            icon={<Fuel size={14} strokeWidth={2} />}
            title={t.settingsDrawer.petrolSection}
            chipClass="bg-oil-soft text-oil"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>{t.settingsDrawer.petrolPrice}</label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={inputs.petrolPricePerLiter}
                  onChange={(e) => onChange({ petrolPricePerLiter: parseFloat(e.target.value) || 1.99 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint font-mono">基准 RM 1.99</span>
              </div>

              <div>
                <label className={fieldLabel}>{t.settingsDrawer.petrolKmPerL}</label>
                <input
                  type="number"
                  step="0.5"
                  inputMode="decimal"
                  value={inputs.petrolFuelEfficiencyKmPerL}
                  onChange={(e) => onChange({ petrolFuelEfficiencyKmPerL: parseFloat(e.target.value) || 14.0 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint font-mono">≈ 7.14 L / 100km</span>
              </div>
            </div>
          </SettingsSection>

          {/* 2. Charging Efficiency & Public Ratio */}
          <SettingsSection
            icon={<BatteryCharging size={14} strokeWidth={2} />}
            title={t.settingsDrawer.evSection}
            chipClass="bg-brand-soft text-brand"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>{t.settingsDrawer.chargingLoss}</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="30"
                  inputMode="numeric"
                  value={Math.round((1 - inputs.chargingEfficiency) * 100)}
                  onChange={(e) => {
                    const loss = parseFloat(e.target.value) || 10;
                    onChange({ chargingEfficiency: (100 - loss) / 100 });
                  }}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint font-mono">标准 AC 损耗 10%</span>
              </div>

              <div>
                <label className={fieldLabel}>{t.settingsDrawer.publicDcPrice}</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputs.publicDcPricePerKwh}
                  onChange={(e) => onChange({ publicDcPricePerKwh: parseFloat(e.target.value) || 1.40 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint font-mono">快充均价 RM 1.40</span>
              </div>
            </div>
          </SettingsSection>

          {/* 3. TNB & ToU Settings */}
          <SettingsSection
            icon={<Zap size={14} strokeWidth={2} />}
            title={t.settingsDrawer.tnbSection}
            chipClass="bg-grid-soft text-grid"
          >
            <div className="space-y-3">
              <div>
                <label className={fieldLabel}>{t.settingsDrawer.afaRate}</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputs.afaRateSen}
                  onChange={(e) => onChange({ afaRateSen: parseFloat(e.target.value) || 3.80 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint font-mono">最新 AFA: +3.80 sen/kWh</span>
              </div>

              <div className="rounded-xl border border-line bg-paper p-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ink">
                    {t.settingsDrawer.touToggle}
                  </label>
                  <input
                    type="checkbox"
                    checked={inputs.isTouEnabled}
                    onChange={(e) => onChange({ isTouEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-line text-brand focus:ring-brand/20"
                  />
                </div>
                {inputs.isTouEnabled && (
                  <div className="mt-2.5 pt-2 border-t border-line">
                    <label className={fieldLabel}>{t.settingsDrawer.touRate}</label>
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      value={inputs.touOffPeakRateSen}
                      onChange={(e) => onChange({ touOffPeakRateSen: parseFloat(e.target.value) || 28.0 })}
                      className={fieldInput}
                    />
                  </div>
                )}
              </div>
            </div>
          </SettingsSection>
        </div>

        <div className="mt-5 border-t border-line pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-brand py-3 text-xs font-bold text-onbrand btn-spring shadow-md"
          >
            {t.settingsDrawer.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
