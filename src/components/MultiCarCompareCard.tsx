import React, { useState, useMemo } from 'react';
import { UserInputs, EvCalculationResult, VehiclePreset } from '../types/calculator';
import { POPULAR_EV_PRESETS } from '../constants/presets';
import { calculateAllEvMetrics } from '../utils/tnbTariff';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowRightLeft, Sparkles, Check } from 'lucide-react';

interface MultiCarCompareCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const MultiCarCompareCard: React.FC<MultiCarCompareCardProps> = ({
  inputs,
  result: resultA
}) => {
  const { t } = useLanguage();

  // Find a default candidate for Car B that is different from Car A
  const defaultPresetB = useMemo(() => {
    const isEmas7 = inputs.modelName.toLowerCase().includes('emas 7') || inputs.modelName.toLowerCase().includes('e.mas 7');
    return isEmas7
      ? POPULAR_EV_PRESETS.find((p) => p.id === 'byd-atto3') || POPULAR_EV_PRESETS[2]
      : POPULAR_EV_PRESETS.find((p) => p.id === 'emas-7') || POPULAR_EV_PRESETS[0];
  }, [inputs.modelName]);

  const [carBPreset, setCarBPreset] = useState<VehiclePreset>(defaultPresetB);
  const [customKwhB, setCustomKwhB] = useState<number>(defaultPresetB.consumptionKwhPer100Km);
  const [customKwB, setCustomKwB] = useState<number>(defaultPresetB.motorPowerKw);

  // Compute metrics for Car B with the same household baseline & petrol inputs
  const inputsB = useMemo<UserInputs>(() => {
    return {
      ...inputs,
      modelName: carBPreset.name,
      consumptionKwhPer100Km: customKwhB,
      motorPowerKw: customKwB,
      batteryCapacityKwh: carBPreset.batteryCapacityKwh
    };
  }, [inputs, carBPreset, customKwhB, customKwB]);

  const resultB = useMemo(() => calculateAllEvMetrics(inputsB), [inputsB]);

  const handleSelectPresetB = (preset: VehiclePreset) => {
    setCarBPreset(preset);
    setCustomKwhB(preset.consumptionKwhPer100Km);
    setCustomKwB(preset.motorPowerKw);
  };

  const monthlySavingsDiff = Math.round((resultB.monthlyNetSavings - resultA.monthlyNetSavings) * 100) / 100;
  const fiveYearSavingsDiff = Math.round((resultB.fiveYearTcoWithRoadTaxSavings - resultA.fiveYearTcoWithRoadTaxSavings) * 100) / 100;

  return (
    <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ArrowRightLeft size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              {t.multiCar.title}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {t.multiCar.sub}
            </p>
          </div>
        </div>

        {/* Winner Badge */}
        {fiveYearSavingsDiff !== 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles size={13} className="text-emerald-400" />
            <span>
              {fiveYearSavingsDiff > 0
                ? `${carBPreset.name} ${t.multiCar.winnerTag.replace('{amount}', formatRm(fiveYearSavingsDiff))}`
                : `${inputs.modelName} ${t.multiCar.winnerTag.replace('{amount}', formatRm(Math.abs(fiveYearSavingsDiff)))}`}
            </span>
          </div>
        )}
      </div>

      {/* Car Selector for Car B */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span>{t.multiCar.selectPrompt}</span>
          <span className="text-[11px] text-zinc-500 font-normal">点击切换对比车型</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_EV_PRESETS.map((preset) => {
            const isSelected = carBPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPresetB(preset)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 shadow-sm ring-1 ring-emerald-500/30'
                    : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{preset.name}</span>
                <span className="font-mono text-[10px] text-zinc-500">({preset.consumptionKwhPer100Km} kWh)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparative Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Car A Card */}
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t.multiCar.carA}
              </span>
              <h4 className="text-sm font-bold text-zinc-100">{inputs.modelName.trim() || 'Car A'}</h4>
            </div>
            <span className="rounded-lg bg-zinc-800/80 px-2 py-0.5 font-mono text-xs font-bold text-zinc-300">
              {inputs.consumptionKwhPer100Km} kWh
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-zinc-900 font-mono">
            <div className="flex items-center justify-between pt-1">
              <span className="font-sans text-zinc-400">{t.multiCar.metricPower}</span>
              <span className="text-zinc-200">{inputs.motorPowerKw || 160} kW (RM {resultA.evRoadTaxAnnualRm}/年)</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricBattery}</span>
              <span className="text-zinc-200">{inputs.batteryCapacityKwh || 60.22} kWh</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricCost100km}</span>
              <span className="font-semibold text-emerald-400">{formatRm(resultA.evCostPer100Km)}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricMonthlyTnb}</span>
              <span className="text-zinc-200">{formatRm(resultA.newCombinedBill.totalAmount)} (+{formatRm(resultA.marginalHomeElectricityCost)})</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 bg-zinc-900/40 p-2 rounded-xl">
              <span className="font-sans font-semibold text-zinc-200">{t.multiCar.metricMonthlySavings}</span>
              <span className="font-bold text-emerald-400 text-sm">{formatRm(resultA.monthlyNetSavings)}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricFiveYearSavings}</span>
              <span className="font-bold text-zinc-100">{formatRm(resultA.fiveYearTcoWithRoadTaxSavings)}</span>
            </div>
          </div>
        </div>

        {/* Car B Card */}
        <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {t.multiCar.carB}
              </span>
              <h4 className="text-sm font-bold text-emerald-300">{carBPreset.name}</h4>
            </div>
            <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/30">
              {carBPreset.consumptionKwhPer100Km} kWh
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-zinc-900 font-mono">
            <div className="flex items-center justify-between pt-1">
              <span className="font-sans text-zinc-400">{t.multiCar.metricPower}</span>
              <span className="text-zinc-200">{carBPreset.motorPowerKw} kW (RM {resultB.evRoadTaxAnnualRm}/年)</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricBattery}</span>
              <span className="text-zinc-200">{carBPreset.batteryCapacityKwh} kWh ({carBPreset.claimedRangeWltpKm} km)</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricCost100km}</span>
              <span className="font-semibold text-emerald-400">{formatRm(resultB.evCostPer100Km)}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricMonthlyTnb}</span>
              <span className="text-zinc-200">{formatRm(resultB.newCombinedBill.totalAmount)} (+{formatRm(resultB.marginalHomeElectricityCost)})</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 bg-emerald-950/60 border border-emerald-500/20 p-2 rounded-xl">
              <span className="font-sans font-semibold text-emerald-300">{t.multiCar.metricMonthlySavings}</span>
              <span className="font-bold text-emerald-400 text-sm">{formatRm(resultB.monthlyNetSavings)}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-sans text-zinc-400">{t.multiCar.metricFiveYearSavings}</span>
              <span className="font-bold text-emerald-300">{formatRm(resultB.fiveYearTcoWithRoadTaxSavings)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Differential Summary Callout */}
      <div className="rounded-xl bg-zinc-950/80 p-3.5 text-xs text-zinc-300 leading-relaxed border border-zinc-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>
            {monthlySavingsDiff > 0
              ? t.multiCar.diffMore.replace('{diff}', formatRm(monthlySavingsDiff))
              : monthlySavingsDiff < 0
                ? t.multiCar.diffLess.replace('{diff}', formatRm(Math.abs(monthlySavingsDiff)))
                : t.multiCar.diffEqual}
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-zinc-400">
          5年综合差距：{formatRm(Math.abs(fiveYearSavingsDiff))}
        </span>
      </div>
    </div>
  );
};
