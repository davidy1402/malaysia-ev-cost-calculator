import React from 'react';
import { POPULAR_EV_PRESETS } from '../constants/presets';
import { VehiclePreset } from '../types/calculator';
import { Car, Sparkles } from 'lucide-react';

interface QuickPresetSelectorProps {
  selectedModelName: string;
  onSelectPreset: (preset: VehiclePreset) => void;
  onSelectCustom: () => void;
  isCustom: boolean;
}

export const QuickPresetSelector: React.FC<QuickPresetSelectorProps> = ({
  selectedModelName,
  onSelectPreset,
  onSelectCustom,
  isCustom
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <Car size={16} strokeWidth={1.75} className="text-emerald-400" />
          <span>热门车型快速预设 (一键填入能耗)</span>
        </label>
        <span className="text-[11px] text-zinc-400">
          可直接点选或在下方手动修改
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {POPULAR_EV_PRESETS.map((preset) => {
          const isSelected = !isCustom && selectedModelName === preset.name;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">{preset.name}</span>
                  {preset.tag && (
                    <span className="rounded bg-emerald-950/80 px-1 py-0.2 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
                      {preset.tag}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-zinc-400 group-hover:text-zinc-300">
                  <span className="font-mono font-medium text-emerald-400">{preset.consumptionKwhPer100Km}</span> kWh/100km · {preset.batteryCapacityKwh}kWh
                </div>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onSelectCustom}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.98] ${
            isCustom
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={16} strokeWidth={1.75} />
          <span className="text-xs font-medium">其他自定义车型</span>
        </button>
      </div>
    </div>
  );
};
