import React from 'react';
import { UserInputs } from '../types/calculator';
import { X, SlidersHorizontal, BatteryCharging, Zap, Fuel } from 'lucide-react';

interface AdvancedSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  onChange: (patch: Partial<UserInputs>) => void;
}

const fieldLabel = 'mb-1 block text-[11px] font-medium text-muted';
const fieldInput =
  'w-full rounded-lg border border-line bg-inset px-2.5 py-1.5 text-xs font-semibold text-ink ' +
  'transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15';

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
    <div className="space-y-3 rounded-2xl border border-line bg-inset/40 p-3.5">
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${chipClass}`}>{icon}</span>
        <span className="text-xs font-semibold text-ink">{title}</span>
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-pop sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <SlidersHorizontal size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-ink">参数微调</h3>
              <p className="text-[11px] text-muted">油价、充电损耗、快充比例与 TNB 附加费</p>
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

        <div className="mt-4 space-y-3.5">
          {/* 1. Petrol Settings */}
          <SettingsSection
            icon={<Fuel size={13} strokeWidth={1.75} />}
            title="汽油参数"
            chipClass="bg-oil-soft text-oil"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>汽油单价 (RM/L)</label>
                <input
                  type="number"
                  step="0.05"
                  inputMode="decimal"
                  value={inputs.petrolPricePerLiter}
                  onChange={(e) => onChange({ petrolPricePerLiter: parseFloat(e.target.value) || 2.05 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint">默认 RON95 RM 2.05</span>
              </div>

              <div>
                <label className={fieldLabel}>油车油耗 (km / L)</label>
                <input
                  type="number"
                  step="0.5"
                  inputMode="decimal"
                  value={inputs.petrolFuelEfficiencyKmPerL}
                  onChange={(e) => onChange({ petrolFuelEfficiencyKmPerL: parseFloat(e.target.value) || 14.0 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint">约 7.1 L / 100km</span>
              </div>
            </div>
          </SettingsSection>

          {/* 2. Charging Efficiency & Home Ratio */}
          <SettingsSection
            icon={<BatteryCharging size={13} strokeWidth={1.75} />}
            title="充电损耗与场景分配"
            chipClass="bg-brand-soft text-brand"
          >
            <div>
              <div className="mb-1.5 flex justify-between text-[11px]">
                <span className="text-muted">家充（AC 慢充）比例</span>
                <span className="font-semibold text-brand">
                  {Math.round(inputs.homeChargingRatio * 100)}% 家充 /{' '}
                  {Math.round((1 - inputs.homeChargingRatio) * 100)}% 外充
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={inputs.homeChargingRatio}
                onChange={(e) => onChange({ homeChargingRatio: parseFloat(e.target.value) })}
              />
              <span className="mt-1 block text-[10px] text-faint">多数车主 90% 都在家充</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>充电桩转换能效</label>
                <select
                  value={inputs.chargingEfficiency}
                  onChange={(e) => onChange({ chargingEfficiency: parseFloat(e.target.value) })}
                  className={fieldInput}
                >
                  <option value="0.95">95%（高效 7kW/11kW）</option>
                  <option value="0.90">90%（标准损耗 · 推荐）</option>
                  <option value="0.85">85%（3-pin 随车充）</option>
                </select>
              </div>

              <div>
                <label className={fieldLabel}>外充 DC 快充电价 (RM/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputs.publicDcPricePerKwh}
                  onChange={(e) => onChange({ publicDcPricePerKwh: parseFloat(e.target.value) || 1.4 })}
                  className={fieldInput}
                />
              </div>
            </div>
          </SettingsSection>

          {/* 3. TNB Tariff Options */}
          <SettingsSection
            icon={<Zap size={13} strokeWidth={1.75} />}
            title="TNB 电价附加项"
            chipClass="bg-grid-soft text-grid"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>AFA 燃油调整费 (sen/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputs.afaRateSen}
                  onChange={(e) => onChange({ afaRateSen: parseFloat(e.target.value) || 3.8 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint">当前 +3.80 sen</span>
              </div>

              <div>
                <label className={fieldLabel}>电池包容量 (kWh)</label>
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={inputs.batteryCapacityKwh}
                  onChange={(e) => onChange({ batteryCapacityKwh: parseFloat(e.target.value) || 60 })}
                  className={fieldInput}
                />
                <span className="mt-1 block text-[10px] text-faint">用于满电充测算</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-3">
              <div className="pr-3">
                <span className="block text-xs font-medium text-ink">TNB ToU 分时电价</span>
                <span className="text-[10px] leading-snug text-faint">
                  夜间低谷约 28 sen/kWh，需 Smart Meter
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={inputs.isTouEnabled}
                onClick={() => onChange({ isTouEnabled: !inputs.isTouEnabled })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  inputs.isTouEnabled ? 'bg-brand' : 'bg-line-strong'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${
                    inputs.isTouEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </SettingsSection>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-onbrand shadow-card transition-all hover:bg-brand-strong active:scale-[0.98]"
          >
            完成，开始算
          </button>
        </div>
      </div>
    </div>
  );
};
