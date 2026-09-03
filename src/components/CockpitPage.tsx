import React, { useState } from 'react';
import { Settings, Zap, Fuel, Home, Gauge, ChevronRight, Moon, Sun, Languages, BatteryCharging, Car } from 'lucide-react';
import { UserInputs, EvCalculationResult, VehiclePreset } from '../types/calculator';
import { POPULAR_EV_PRESETS } from '../constants/presets';
import { estimateKwhFromTnbBill } from '../utils/tnbTariff';
import { useLanguage } from '../i18n/LanguageContext';
import { AdvancedDrawer } from './AdvancedDrawer';

interface CockpitPageProps {
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange: (patch: Partial<UserInputs>) => void;
  onCalculate: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const CockpitPage: React.FC<CockpitPageProps> = ({
  inputs,
  result,
  onChange,
  onCalculate,
  theme,
  onToggleTheme
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [homeInputMode, setHomeInputMode] = useState<'kwh' | 'rm'>('kwh');
  const [tempBillRm, setTempBillRm] = useState<string>('');

  const handleSelectPreset = (preset: VehiclePreset) => {
    onChange({
      modelName: preset.name,
      consumptionKwhPer100Km: preset.consumptionKwhPer100Km,
      motorPowerKw: preset.motorPowerKw,
      batteryCapacityKwh: preset.batteryCapacityKwh
    });
  };

  const grossKwhPer100Km = Math.round(inputs.consumptionKwhPer100Km * 1.10 * 100) / 100;

  return (
    <div className="relative min-h-[100dvh] bg-background-default text-text-primary pb-[calc(100px+env(safe-area-inset-bottom))]">
      <main className="mx-auto w-full max-w-xl px-4 pt-4 sm:px-6 sm:pt-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between py-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-text-inverse font-bold shadow-sm">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
                {t.navbar.title}
              </h1>
              <span className="text-[10px] text-text-secondary hidden sm:inline">
                TNB 2025/2026 Restructured Domestic Tariff
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex h-8 items-center gap-1 rounded-lg border border-border-subtle bg-surface-overlay px-2.5 text-xs font-semibold text-text-primary hover:border-brand-primary active:scale-95"
            >
              <Languages size={14} className="text-brand-primary" />
              <span className="font-display text-[11px]">{language === 'zh' ? 'EN' : '中文'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-surface-overlay text-text-secondary hover:text-text-primary active:scale-95"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* 1. Vehicle Selection & Energy Consumption */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <Car size={16} className="text-brand-primary" />
              <span>{t.showroom.step1Tag}</span>
            </h2>
            <span className="text-xs text-text-secondary">
              {t.showroom.lossNote} <strong className="font-display text-brand-primary">{grossKwhPer100Km}</strong>
            </span>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-base p-4 sm:p-5 space-y-4 shadow-sm">
            {/* Model Name Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputs.modelName}
                onChange={(e) => onChange({ modelName: e.target.value })}
                placeholder={t.showroom.modelPlaceholder}
                className="w-full rounded-xl border border-border-subtle bg-surface-overlay px-3 py-2 text-xs font-medium text-text-primary placeholder:text-text-disabled focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Stepper with Large Display Number */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                onClick={() => onChange({ consumptionKwhPer100Km: Math.max(5, Math.round((inputs.consumptionKwhPer100Km - 0.5) * 10) / 10) })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay text-xl font-bold text-text-primary active:bg-surface-raised active:scale-95"
              >
                −
              </button>

              <div className="text-center w-36">
                <div className="text-4xl sm:text-5xl font-display font-bold text-brand-primary tabular-nums">
                  {inputs.consumptionKwhPer100Km.toFixed(1)}
                </div>
                <span className="text-[11px] text-text-secondary font-medium">kWh / 100 km</span>
              </div>

              <button
                type="button"
                onClick={() => onChange({ consumptionKwhPer100Km: Math.min(35, Math.round((inputs.consumptionKwhPer100Km + 0.5) * 10) / 10) })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay text-xl font-bold text-text-primary active:bg-surface-raised active:scale-95"
              >
                +
              </button>
            </div>

            {/* Presets Snap Carousel */}
            <div className="space-y-1.5 pt-2 border-t border-border-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                热门车型一键填入 (Quick Presets)
              </span>
              <div className="flex overflow-x-auto no-scrollbar gap-1.5 py-1 -mx-2 px-2 snap-x">
                {POPULAR_EV_PRESETS.map((preset) => {
                  const isActive = inputs.modelName.trim().toLowerCase() === preset.name.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex shrink-0 snap-start items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors active:scale-95 ${
                        isActive
                          ? 'border-brand-primary bg-brand-primary text-text-inverse font-semibold shadow-sm'
                          : 'border-border-subtle bg-surface-overlay text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span>{preset.name}</span>
                      <span className={`font-display text-[10px] ${isActive ? 'text-text-inverse/80' : 'text-text-disabled'}`}>
                        {preset.consumptionKwhPer100Km}kwh
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Charging Scenario Selector */}
            <div className="pt-2 border-t border-border-subtle space-y-2">
              <label className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BatteryCharging size={14} className="text-brand-primary" />
                  <span>{t.showroom.chargingModeLabel}</span>
                </span>
                <span className="text-[11px] text-text-secondary font-normal hidden sm:inline">
                  {inputs.chargingMode === 'mixed' ? t.showroom.chargingModeMixedSub : t.showroom.chargingModeHomeSub}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ chargingMode: 'mixed', homeChargingRatio: 0.90 })}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium transition-all active:scale-95 ${
                    inputs.chargingMode === 'mixed'
                      ? 'border border-brand-primary bg-surface-overlay text-brand-primary font-semibold ring-1 ring-brand-primary/30'
                      : 'border border-border-subtle bg-surface-overlay/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="font-semibold whitespace-nowrap">{t.showroom.mixedModeBtnTitle}</span>
                  <span className="text-[10px] text-text-secondary mt-0.5 line-clamp-1">{t.showroom.mixedModeBtnSub}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ chargingMode: 'home_only', homeChargingRatio: 1.0 })}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium transition-all active:scale-95 ${
                    inputs.chargingMode === 'home_only'
                      ? 'border border-brand-primary bg-surface-overlay text-brand-primary font-semibold ring-1 ring-brand-primary/30'
                      : 'border border-border-subtle bg-surface-overlay/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="font-semibold whitespace-nowrap">{t.showroom.homeOnlyBtnTitle}</span>
                  <span className="text-[10px] text-text-secondary mt-0.5 line-clamp-1">{t.showroom.homeOnlyBtnSub}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. User Baseline Inputs */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">
            当前家庭用电与燃油基准 (Baseline)
          </h2>

          <div className="space-y-3">
            {/* Monthly Mileage */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary flex items-center gap-1.5 font-medium">
                  <Gauge size={14} className="text-brand-primary" />
                  <span>{t.showroom.monthlyMileageLabel}</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inputs.monthlyMileageKm || ''}
                    onChange={(e) => onChange({ monthlyMileageKm: parseInt(e.target.value, 10) || 0 })}
                    className="w-24 bg-transparent font-display text-base font-bold text-text-primary text-right outline-none"
                  />
                  <span className="text-xs text-text-secondary">km</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border-subtle/60">
                <button
                  type="button"
                  onClick={() => onChange({ monthlyMileageKm: result.petrolEquivalentDistanceKm })}
                  className="rounded-lg border border-brand-primary/30 bg-surface-overlay px-2 py-0.5 text-[10px] font-semibold text-brand-primary"
                >
                  {t.showroom.alignPetrolBtn.replace('{km}', result.petrolEquivalentDistanceKm.toString())}
                </button>
                {[900, 1500, 2000].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => onChange({ monthlyMileageKm: km })}
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-display transition-colors ${
                      inputs.monthlyMileageKm === km
                        ? 'border-brand-primary bg-brand-primary text-text-inverse font-bold'
                        : 'border-border-subtle bg-surface-overlay text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>

            {/* Home Electricity with Bidirectional kWh <-> RM toggle */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary flex items-center gap-1.5 font-medium">
                  <Home size={14} className="text-brand-accent" />
                  <span>{t.showroom.homeElectricityLabel}</span>
                </label>

                {/* Mode Switcher */}
                <div className="flex items-center rounded-lg border border-border-subtle bg-surface-overlay p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setHomeInputMode('kwh')}
                    className={`rounded px-1.5 py-0.5 font-semibold transition-colors ${
                      homeInputMode === 'kwh'
                        ? 'bg-brand-accent text-text-inverse font-bold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    kWh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHomeInputMode('rm');
                      setTempBillRm(result.baselineBill.totalAmount.toFixed(2));
                    }}
                    className={`rounded px-1.5 py-0.5 font-semibold transition-colors ${
                      homeInputMode === 'rm'
                        ? 'bg-brand-accent text-text-inverse font-bold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    RM
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {homeInputMode === 'kwh' ? '月度用电量' : '月度电费金额'}
                </span>
                {homeInputMode === 'kwh' ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={inputs.baselineHomeKwh || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onChange({ baselineHomeKwh: val });
                      }}
                      className="w-24 bg-transparent font-display text-base font-bold text-text-primary text-right outline-none"
                    />
                    <span className="text-xs text-text-secondary">kWh</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">RM</span>
                    <input
                      type="number"
                      value={tempBillRm}
                      onChange={(e) => {
                        setTempBillRm(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          const estimatedKwh = estimateKwhFromTnbBill(val, { afaRateSen: inputs.afaRateSen });
                          onChange({
                            baselineHomeKwh: estimatedKwh,
                            baselineHomeBillRm: val
                          });
                        }
                      }}
                      placeholder="172.70"
                      className="w-24 bg-transparent font-display text-base font-bold text-text-primary text-right outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border-subtle/60">
                {[
                  { label: t.showroom.bill501Chip, kwh: 501 },
                  { label: t.showroom.bill430Chip, kwh: 430 },
                  { label: t.showroom.bill390Chip, kwh: 390 }
                ].map((b) => (
                  <button
                    key={b.kwh}
                    type="button"
                    onClick={() => {
                      onChange({ baselineHomeKwh: b.kwh });
                      setTempBillRm('');
                    }}
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      inputs.baselineHomeKwh === b.kwh
                        ? 'border-brand-accent bg-brand-accent/20 text-brand-accent font-bold'
                        : 'border-border-subtle bg-surface-overlay text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Petrol Spend */}
            <div className="rounded-xl border border-border-subtle bg-surface-base p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary flex items-center gap-1.5 font-medium">
                  <Fuel size={14} className="text-brand-primary" />
                  <span>{t.showroom.fatherPetrolLabel}</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-text-secondary">RM</span>
                  <input
                    type="number"
                    value={inputs.fatherPetrolCostRm || ''}
                    onChange={(e) => onChange({ fatherPetrolCostRm: parseFloat(e.target.value) || 0 })}
                    className="w-24 bg-transparent font-display text-base font-bold text-text-primary text-right outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1 border-t border-border-subtle/60">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onChange({ petrolPricePerLiter: 1.99 })}
                    className={`rounded px-1.5 py-0.5 font-semibold transition-colors ${
                      inputs.petrolPricePerLiter === 1.99
                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40'
                        : 'bg-surface-overlay text-text-secondary border border-border-subtle'
                    }`}
                  >
                    RM 1.99/L
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ petrolPricePerLiter: 2.05 })}
                    className={`rounded px-1.5 py-0.5 font-semibold transition-colors ${
                      inputs.petrolPricePerLiter === 2.05
                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40'
                        : 'bg-surface-overlay text-text-secondary border border-border-subtle'
                    }`}
                  >
                    RM 2.05/L
                  </button>
                </div>
                <span className="font-display text-text-primary font-medium">
                  {(inputs.fatherPetrolCostRm / inputs.petrolPricePerLiter).toFixed(1)} {t.showroom.petrolUnit}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-background-default/90 backdrop-blur-md p-3.5 pb-[calc(14px+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-overlay text-text-primary active:scale-95"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          <button
            type="button"
            onClick={onCalculate}
            className="flex flex-1 h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 text-sm font-bold text-text-inverse shadow-md active:scale-[0.98]"
          >
            <span>查看省钱精算结果 (Calculate)</span>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Advanced Settings Drawer */}
      <AdvancedDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        inputs={inputs}
        result={result}
        onChange={onChange}
      />
    </div>
  );
};
