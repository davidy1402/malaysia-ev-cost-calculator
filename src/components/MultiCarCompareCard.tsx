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
    <div className="doppelrand-shell">
      <div className="doppelrand-core space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <ArrowRightLeft size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {t.multiCar.title}
              </h3>
              <p className="text-[11px] text-muted">
                {t.multiCar.sub}
              </p>
            </div>
          </div>

          {/* Winner Badge */}
          {fiveYearSavingsDiff !== 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold text-brand shadow-sm whitespace-nowrap">
              <Sparkles size={12} strokeWidth={2.25} />
              <span>
                {fiveYearSavingsDiff > 0
                  ? `${carBPreset.name} ${t.multiCar.winnerTag.replace('{amount}', formatRm(fiveYearSavingsDiff))}`
                  : `${inputs.modelName} ${t.multiCar.winnerTag.replace('{amount}', formatRm(Math.abs(fiveYearSavingsDiff)))}`}
              </span>
            </div>
          )}
        </div>

        {/* Car Selector for Car B - Scrollable on mobile */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {t.multiCar.selectPrompt}
            </label>
            <span className="text-[10px] text-faint hidden sm:inline">
              左右滑动选择车型
            </span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 py-0.5 -mx-1 px-1">
            {POPULAR_EV_PRESETS.map((preset) => {
              const isSelected = carBPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPresetB(preset)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-medium btn-spring whitespace-nowrap ${
                    isSelected
                      ? 'border-brand bg-brand text-onbrand shadow-sm font-semibold'
                      : 'border-line bg-surface/80 text-muted hover:border-line-strong hover:text-ink'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className={`font-mono text-[10px] ${isSelected ? 'text-onbrand/80' : 'text-faint'}`}>
                    ({preset.consumptionKwhPer100Km}kwh)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Comparative Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Car A Card */}
          <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                  {t.multiCar.carA}
                </span>
                <h4 className="text-sm font-bold text-ink whitespace-nowrap">{inputs.modelName.trim() || 'Car A'}</h4>
              </div>
              <span className="rounded-lg bg-paper px-2 py-0.5 font-mono text-xs font-bold text-muted border border-line whitespace-nowrap">
                {inputs.consumptionKwhPer100Km} kWh
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-line/60 font-mono">
              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-muted">{t.multiCar.metricPower}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{inputs.motorPowerKw || 160} kW (RM {resultA.evRoadTaxAnnualRm}/年)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricBattery}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{inputs.batteryCapacityKwh || 60.22} kWh</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricCost100km}</span>
                <span className="font-bold text-brand whitespace-nowrap">{formatRm(resultA.evCostPer100Km)}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricMonthlyTnb}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{formatRm(resultA.newCombinedBill.totalAmount)} (+{formatRm(resultA.marginalHomeElectricityCost)})</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 bg-paper/60 p-2 rounded-xl">
                <span className="font-sans font-bold text-ink">{t.multiCar.metricMonthlySavings}</span>
                <span className="font-extrabold text-brand text-sm whitespace-nowrap">{formatRm(resultA.monthlyNetSavings)}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricFiveYearSavings}</span>
                <span className="font-bold text-ink whitespace-nowrap">{formatRm(resultA.fiveYearTcoWithRoadTaxSavings)}</span>
              </div>
            </div>
          </div>

          {/* Car B Card */}
          <div className="space-y-3 rounded-2xl border border-brand/35 bg-surface p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">
                  {t.multiCar.carB}
                </span>
                <h4 className="text-sm font-bold text-brand whitespace-nowrap">{carBPreset.name}</h4>
              </div>
              <span className="rounded-lg bg-brand-soft px-2 py-0.5 font-mono text-xs font-bold text-brand border border-brand/25 whitespace-nowrap">
                {carBPreset.consumptionKwhPer100Km} kWh
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-line/60 font-mono">
              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-muted">{t.multiCar.metricPower}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{carBPreset.motorPowerKw} kW (RM {resultB.evRoadTaxAnnualRm}/年)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricBattery}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{carBPreset.batteryCapacityKwh} kWh ({carBPreset.claimedRangeWltpKm} km)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricCost100km}</span>
                <span className="font-bold text-brand whitespace-nowrap">{formatRm(resultB.evCostPer100Km)}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricMonthlyTnb}</span>
                <span className="text-ink font-semibold whitespace-nowrap">{formatRm(resultB.newCombinedBill.totalAmount)} (+{formatRm(resultB.marginalHomeElectricityCost)})</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 bg-brand-soft/70 border border-brand/20 p-2 rounded-xl">
                <span className="font-sans font-bold text-brand">{t.multiCar.metricMonthlySavings}</span>
                <span className="font-extrabold text-brand text-sm whitespace-nowrap">{formatRm(resultB.monthlyNetSavings)}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="font-sans text-muted">{t.multiCar.metricFiveYearSavings}</span>
                <span className="font-bold text-brand whitespace-nowrap">{formatRm(resultB.fiveYearTcoWithRoadTaxSavings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Differential Summary Callout */}
        <div className="rounded-xl bg-surface/90 p-3.5 text-xs text-ink leading-relaxed border border-line flex items-center justify-between flex-wrap gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Check size={16} strokeWidth={2.5} className="text-brand shrink-0" />
            <span className="font-medium">
              {monthlySavingsDiff > 0
                ? t.multiCar.diffMore.replace('{diff}', formatRm(monthlySavingsDiff))
                : monthlySavingsDiff < 0
                  ? t.multiCar.diffLess.replace('{diff}', formatRm(Math.abs(monthlySavingsDiff)))
                  : t.multiCar.diffEqual}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-brand whitespace-nowrap">
            5年综合差距：{formatRm(Math.abs(fiveYearSavingsDiff))}
          </span>
        </div>
      </div>
    </div>
  );
};
