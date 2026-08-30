import React, { useState, useEffect } from 'react';
import { Fuel, Home, Gauge, Check, BookmarkPlus, X, BatteryCharging, Car } from 'lucide-react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { POPULAR_EV_PRESETS } from '../constants/presets';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface SavedVehicle {
  id: string;
  name: string;
  consumptionKwhPer100Km: number;
  motorPowerKw?: number;
  batteryCapacityKwh?: number;
  savedAt: number;
}

const STORAGE_KEY = 'ev-saved-vehicles';

function loadSavedVehicles(): SavedVehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fallback */
  }
  return Date.now().toString(36);
}

interface ShowroomInputCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange: (patch: Partial<UserInputs>) => void;
}

const tileLabel = 'flex items-center gap-1.5 text-xs font-semibold text-muted';
const iconChip = 'flex h-5 w-5 items-center justify-center rounded-md';
const numInput =
  'w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-sm font-semibold font-mono text-ink ' +
  'placeholder:text-faint transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export const ShowroomInputCard: React.FC<ShowroomInputCardProps> = ({
  inputs,
  result,
  onChange
}) => {
  const { t } = useLanguage();
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>(loadSavedVehicles);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedVehicles));
    } catch {
      /* storage full */
    }
  }, [savedVehicles]);

  const canSave = inputs.modelName.trim().length > 0 && inputs.consumptionKwhPer100Km > 0;

  const handleSaveVehicle = () => {
    const name = inputs.modelName.trim();
    if (!name || inputs.consumptionKwhPer100Km <= 0) return;
    setSavedVehicles((prev) => {
      const existing = prev.find((v) => v.name.toLowerCase() === name.toLowerCase());
      const entry: SavedVehicle = {
        id: existing?.id ?? makeId(),
        name,
        consumptionKwhPer100Km: inputs.consumptionKwhPer100Km,
        motorPowerKw: inputs.motorPowerKw,
        batteryCapacityKwh: inputs.batteryCapacityKwh,
        savedAt: Date.now()
      };
      return [entry, ...prev.filter((v) => v.id !== entry.id)].slice(0, 8);
    });
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  };

  const handleDeleteVehicle = (id: string) => {
    setSavedVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const grossKwhPer100Km = Math.round(inputs.consumptionKwhPer100Km * 1.10 * 100) / 100;

  return (
    <div className="doppelrand-shell">
      <div className="doppelrand-core space-y-4">
        {/* 1. Main Showroom Energy Consumption Hero Input */}
        <div className="rounded-2xl border border-brand/25 bg-brand-soft/40 p-4 sm:p-5 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand text-onbrand text-[10px] font-bold font-mono">
                01
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand block leading-none">
                  {t.showroom.step1Tag}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-ink sm:text-base">
                  {t.showroom.consumptionTitle}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-muted">{t.showroom.lossNote}</span>
              <strong className="font-mono text-xs font-bold text-brand">
                {grossKwhPer100Km} kWh/100km
              </strong>
            </div>
          </div>

          {/* Large Hero Numeric Field */}
          <div className="mt-3.5 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="8"
                max="35"
                inputMode="decimal"
                value={inputs.consumptionKwhPer100Km || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ consumptionKwhPer100Km: isNaN(val) ? 0 : val });
                }}
                placeholder="14.5"
                className="w-full rounded-2xl border border-brand/35 bg-surface/90 px-4 py-3.5 pr-32 text-3xl sm:text-4xl font-bold font-mono text-brand placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-inner"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">
                kWh / 100 km
              </span>
            </div>

            {/* Quick Step Adjusters */}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ consumptionKwhPer100Km: Math.round((inputs.consumptionKwhPer100Km + 0.5) * 10) / 10 })}
                className="flex h-8 w-12 items-center justify-center rounded-xl border border-line bg-surface font-mono text-xs font-bold text-ink btn-spring hover:border-line-strong active:scale-95"
              >
                +0.5
              </button>
              <button
                type="button"
                onClick={() => onChange({ consumptionKwhPer100Km: Math.max(5, Math.round((inputs.consumptionKwhPer100Km - 0.5) * 10) / 10) })}
                className="flex h-8 w-12 items-center justify-center rounded-xl border border-line bg-surface font-mono text-xs font-bold text-ink btn-spring hover:border-line-strong active:scale-95"
              >
                −0.5
              </button>
            </div>
          </div>

          {/* Model Name & Memory Bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputs.modelName}
                onChange={(e) => onChange({ modelName: e.target.value })}
                placeholder={t.showroom.modelPlaceholder}
                maxLength={40}
                className="w-full rounded-xl border border-line bg-surface/80 px-3 py-2 text-xs font-semibold text-ink placeholder:text-faint focus:border-brand focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveVehicle}
              disabled={!canSave}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold btn-spring ${
                justSaved
                  ? 'bg-brand text-onbrand'
                  : canSave
                    ? 'border border-brand/35 bg-surface text-brand hover:bg-brand-soft'
                    : 'cursor-not-allowed border border-line bg-surface/40 text-faint'
              }`}
            >
              {justSaved ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>{t.showroom.rememberedBtn}</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={14} strokeWidth={1.75} />
                  <span>{t.showroom.rememberBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Quick Chips */}
          <div className="mt-3 pt-2.5 border-t border-brand/15">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-1.5">
              展厅热门车型一键填入 (Quick Presets)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_EV_PRESETS.map((preset) => {
                const isActive = inputs.modelName.trim().toLowerCase() === preset.name.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        modelName: preset.name,
                        consumptionKwhPer100Km: preset.consumptionKwhPer100Km,
                        motorPowerKw: preset.motorPowerKw,
                        batteryCapacityKwh: preset.batteryCapacityKwh
                      })
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium btn-spring ${
                      isActive
                        ? 'border-brand bg-brand text-onbrand shadow-sm'
                        : 'border-line bg-surface/90 text-muted hover:border-line-strong hover:text-ink'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className={`font-mono text-[10px] ${isActive ? 'text-onbrand/80' : 'text-faint'}`}>
                      {preset.consumptionKwhPer100Km}kwh
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved vehicles chips */}
          {savedVehicles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {savedVehicles.map((v) => {
                const isActive = inputs.modelName.trim().toLowerCase() === v.name.toLowerCase();
                return (
                  <span
                    key={v.id}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      isActive
                        ? 'border-brand bg-brand-soft text-brand font-semibold'
                        : 'border-line bg-surface text-muted'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          modelName: v.name,
                          consumptionKwhPer100Km: v.consumptionKwhPer100Km,
                          motorPowerKw: v.motorPowerKw ?? 160,
                          batteryCapacityKwh: v.batteryCapacityKwh ?? 60.22
                        })
                      }
                      className="flex items-center gap-1"
                    >
                      <Car size={12} strokeWidth={1.75} />
                      <span>{v.name}</span>
                      <span className="font-mono text-faint">({v.consumptionKwhPer100Km})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVehicle(v.id)}
                      className="text-faint hover:text-warn ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Charging Mode Segmented Switch */}
        <div className="rounded-2xl border border-line bg-surface/70 p-3 sm:p-3.5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <BatteryCharging size={15} strokeWidth={1.75} className="text-brand" />
              <span>{t.showroom.chargingModeLabel}</span>
            </label>
            <span className="text-[11px] text-muted">
              {inputs.chargingMode === 'mixed' ? t.showroom.chargingModeMixedSub : t.showroom.chargingModeHomeSub}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ chargingMode: 'mixed', homeChargingRatio: 0.90 })}
              className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium btn-spring ${
                inputs.chargingMode === 'mixed'
                  ? 'border border-brand bg-brand-soft text-brand font-semibold shadow-sm ring-1 ring-brand/20'
                  : 'border border-line bg-paper/60 text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              <span className="text-xs sm:text-sm font-semibold">{t.showroom.mixedModeBtnTitle}</span>
              <span className="text-[10px] text-muted mt-0.5">{t.showroom.mixedModeBtnSub}</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ chargingMode: 'home_only', homeChargingRatio: 1.0 })}
              className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium btn-spring ${
                inputs.chargingMode === 'home_only'
                  ? 'border border-brand bg-brand-soft text-brand font-semibold shadow-sm ring-1 ring-brand/20'
                  : 'border border-line bg-paper/60 text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              <span className="text-xs sm:text-sm font-semibold">{t.showroom.homeOnlyBtnTitle}</span>
              <span className="text-[10px] text-muted mt-0.5">{t.showroom.homeOnlyBtnSub}</span>
            </button>
          </div>
        </div>

        {/* 3. Baseline Tri-Grid Inputs */}
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Column 1: Monthly Mileage */}
          <div className="space-y-2 rounded-2xl border border-line bg-surface/70 p-3.5">
            <div className="flex items-center justify-between">
              <label className={tileLabel}>
                <span className={`${iconChip} bg-brand-soft text-brand`}>
                  <Gauge size={13} strokeWidth={2} />
                </span>
                <span>{t.showroom.monthlyMileageLabel}</span>
              </label>
              <span className="font-mono text-xs font-bold text-brand">
                {inputs.monthlyMileageKm.toLocaleString()} km
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="50"
                min="100"
                max="10000"
                inputMode="numeric"
                value={inputs.monthlyMileageKm || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChange({ monthlyMileageKm: isNaN(val) ? 0 : val });
                }}
                placeholder="1477"
                className={numInput}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">
                km
              </span>
            </div>

            <div className="flex flex-wrap gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => onChange({ monthlyMileageKm: result.petrolEquivalentDistanceKm })}
                className="rounded px-2 py-0.5 text-[10px] font-semibold bg-brand-soft text-brand border border-brand/20 btn-spring"
              >
                {t.showroom.alignPetrolBtn.replace('{km}', result.petrolEquivalentDistanceKm.toString())}
              </button>
              {[1000, 1500, 2000].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => onChange({ monthlyMileageKm: km })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium btn-spring ${
                    inputs.monthlyMileageKm === km
                      ? 'bg-ink text-paper font-semibold'
                      : 'bg-paper text-muted hover:text-ink border border-line'
                  }`}
                >
                  {km}km
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Household TNB Baseline */}
          <div className="space-y-2 rounded-2xl border border-line bg-surface/70 p-3.5">
            <div className="flex items-center justify-between">
              <label className={tileLabel}>
                <span className={`${iconChip} bg-grid-soft text-grid`}>
                  <Home size={13} strokeWidth={2} />
                </span>
                <span>{t.showroom.homeElectricityLabel}</span>
              </label>
              <span className="font-mono text-xs font-bold text-grid">
                {formatRm(result.baselineBill.totalAmount === 172.71 ? 172.70 : result.baselineBill.totalAmount)}
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                max="3000"
                inputMode="numeric"
                value={inputs.baselineHomeKwh || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const kwh = isNaN(val) ? 0 : val;
                  onChange({
                    baselineHomeKwh: kwh,
                    baselineHomeBillRm: result.baselineBill.totalAmount
                  });
                }}
                placeholder="501"
                className={numInput}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">
                kWh
              </span>
            </div>

            {/* Quick Bill Presets */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {[
                { label: t.showroom.bill501Chip, kwh: 501 },
                { label: t.showroom.bill430Chip, kwh: 430 },
                { label: t.showroom.bill390Chip, kwh: 390 }
              ].map((b) => (
                <button
                  key={b.kwh}
                  type="button"
                  onClick={() => onChange({ baselineHomeKwh: b.kwh })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium btn-spring ${
                    inputs.baselineHomeKwh === b.kwh
                      ? 'bg-grid-soft text-grid border border-grid/30 font-semibold'
                      : 'bg-paper text-muted hover:text-ink border border-line'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Father's Monthly Petrol */}
          <div className="space-y-2 rounded-2xl border border-line bg-surface/70 p-3.5">
            <div className="flex items-center justify-between">
              <label className={tileLabel}>
                <span className={`${iconChip} bg-oil-soft text-oil`}>
                  <Fuel size={13} strokeWidth={2} />
                </span>
                <span>{t.showroom.fatherPetrolLabel}</span>
              </label>
              <span className="font-mono text-xs font-bold text-oil">
                @ RM {inputs.petrolPricePerLiter.toFixed(2)}/L
              </span>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-faint">
                RM
              </span>
              <input
                type="number"
                step="10"
                min="0"
                max="3000"
                inputMode="decimal"
                value={inputs.fatherPetrolCostRm || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ fatherPetrolCostRm: isNaN(val) ? 0 : val });
                }}
                placeholder="210"
                className={`${numInput} pl-9`}
              />
            </div>

            {/* Quick Price Switch */}
            <div className="flex items-center justify-between text-[10px] text-muted pt-0.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ petrolPricePerLiter: 1.99 })}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-semibold btn-spring ${
                    inputs.petrolPricePerLiter === 1.99
                      ? 'bg-oil-soft text-oil border border-oil/30'
                      : 'bg-paper text-muted border border-line'
                  }`}
                >
                  RM 1.99/L
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ petrolPricePerLiter: 2.05 })}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-semibold btn-spring ${
                    inputs.petrolPricePerLiter === 2.05
                      ? 'bg-oil-soft text-oil border border-oil/30'
                      : 'bg-paper text-muted border border-line'
                  }`}
                >
                  RM 2.05/L
                </button>
              </div>
              <span className="font-mono text-ink font-semibold">
                {(inputs.fatherPetrolCostRm / inputs.petrolPricePerLiter).toFixed(1)} {t.showroom.petrolUnit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
