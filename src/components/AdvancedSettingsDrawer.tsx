import React from 'react';
import { UserInputs } from '../types/calculator';
import { X, Sliders, BatteryCharging, Zap, Fuel } from 'lucide-react';

interface AdvancedSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  onChange: (patch: Partial<UserInputs>) => void;
}

export const AdvancedSettingsDrawer: React.FC<AdvancedSettingsDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  onChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sliders size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                高级参数微调 (Advanced Settings)
              </h3>
              <p className="text-xs text-zinc-400">
                按需调整油价、充电损耗、快充比例与 TNB AFA 费率
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

        <div className="mt-4 space-y-4 text-xs">
          {/* 1. Petrol Settings */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Fuel size={16} strokeWidth={1.75} className="text-amber-400" />
              <span>汽油与油耗参数</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  汽油单价 (RM/L)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={inputs.petrolPricePerLiter}
                    onChange={(e) => onChange({ petrolPricePerLiter: parseFloat(e.target.value) || 2.05 })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-zinc-400">默认 RON95 RM 2.05</span>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  油车油耗 (km / L)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.petrolFuelEfficiencyKmPerL}
                  onChange={(e) => onChange({ petrolFuelEfficiencyKmPerL: parseFloat(e.target.value) || 14.0 })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400">约 7.1 L / 100km</span>
              </div>
            </div>
          </div>

          {/* 2. Charging Efficiency & Home Ratio */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <BatteryCharging size={16} strokeWidth={1.75} className="text-emerald-400" />
              <span>充电损耗与场景分配</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>家充 (AC慢充) 比例</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(inputs.homeChargingRatio * 100)}% 家充 / {Math.round((1 - inputs.homeChargingRatio) * 100)}% 外充</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={inputs.homeChargingRatio}
                  onChange={(e) => onChange({ homeChargingRatio: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-zinc-400">多数车主 90% 都在家里插座/充电桩慢充</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    充电桩转换能效
                  </label>
                  <select
                    value={inputs.chargingEfficiency}
                    onChange={(e) => onChange({ chargingEfficiency: parseFloat(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="0.95">95% (高效 7kW/11kW)</option>
                    <option value="0.90">90% (标准 10%损耗 - 推荐)</option>
                    <option value="0.85">85% (3-pin 随车充慢充)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    外充 DC 快充电价 (RM/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.publicDcPricePerKwh}
                    onChange={(e) => onChange({ publicDcPricePerKwh: parseFloat(e.target.value) || 1.40 })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. TNB Tariff Options */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Zap size={16} strokeWidth={1.75} className="text-blue-400" />
              <span>TNB 电价附加项微调</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  AFA 燃油调整费 (sen/kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.afaRateSen}
                  onChange={(e) => onChange({ afaRateSen: parseFloat(e.target.value) || 3.80 })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400">2026年8月当前为 +3.80 sen</span>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  电池包容量 (kWh)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputs.batteryCapacityKwh}
                  onChange={(e) => onChange({ batteryCapacityKwh: parseFloat(e.target.value) || 60 })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400">用于满电充算</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="font-medium text-zinc-200 block">TNB Time-of-Use (ToU) 模拟</span>
                <span className="text-[10px] text-zinc-400">夜间 10pm–2pm 享离峰折扣费率 (~28 sen/kWh)</span>
              </div>
              <input
                type="checkbox"
                checked={inputs.isTouEnabled}
                onChange={(e) => onChange({ isTouEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 active:scale-[0.98]"
          >
            完成设置并应用
          </button>
        </div>
      </div>
    </div>
  );
};
