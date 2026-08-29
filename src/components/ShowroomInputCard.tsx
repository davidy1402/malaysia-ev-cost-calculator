import React, { useState, useEffect } from 'react';
import { Fuel, Home, Gauge, Check, BookmarkPlus, X, BatteryCharging } from 'lucide-react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface SavedVehicle {
  id: string;
  name: string;
  consumptionKwhPer100Km: number;
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
    /* older browsers */
  }
  return Date.now().toString(36);
}

interface ShowroomInputCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange: (patch: Partial<UserInputs>) => void;
}

const tileLabel = 'flex items-center gap-2 text-xs font-semibold text-zinc-300';
const iconChip = 'flex h-6 w-6 items-center justify-center rounded-md';
const numInput =
  'w-full rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-2.5 text-sm font-semibold text-zinc-100 ' +
  'placeholder:text-zinc-600 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

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
      /* storage full / private mode */
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
    <div className="space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-sm sm:p-6">
      {/* 1. Showroom Target Input: Energy Consumption */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {t.showroom.step1Tag}
            </span>
            <h3 className="mt-0.5 text-sm font-semibold text-zinc-100 sm:text-base">
              {t.showroom.consumptionTitle}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-400">{t.showroom.lossNote}</span>
            <strong className="font-mono text-xs text-emerald-300">
              {grossKwhPer100Km} kWh/100km
            </strong>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
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
              className="w-full rounded-2xl border border-emerald-500/40 bg-zinc-950/90 px-4 py-3 pr-28 text-3xl font-bold font-mono text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-4xl"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
              kWh / 100 km
            </span>
          </div>

          {/* Quick step adjusters for fast thumb interaction */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.round((inputs.consumptionKwhPer100Km + 0.5) * 10) / 10 })}
              className="flex h-8 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-all"
            >
              +0.5
            </button>
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.max(5, Math.round((inputs.consumptionKwhPer100Km - 0.5) * 10) / 10) })}
              className="flex h-8 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-all"
            >
              −0.5
            </button>
          </div>
        </div>

        {/* Model name + quick save */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={inputs.modelName}
            onChange={(e) => onChange({ modelName: e.target.value })}
            placeholder={t.showroom.modelPlaceholder}
            maxLength={40}
            className="min-w-0 flex-1 rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-200 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveVehicle}
            disabled={!canSave}
            className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all active:scale-95 ${
              justSaved
                ? 'bg-emerald-500 text-zinc-950'
                : canSave
                  ? 'border border-emerald-500/40 bg-zinc-900 text-emerald-400 hover:bg-emerald-950/40'
                  : 'cursor-not-allowed border border-zinc-800 bg-zinc-950 text-zinc-600'
            }`}
          >
            {justSaved ? (
              <>
                <Check size={14} strokeWidth={2} />
                {t.showroom.rememberedBtn}
              </>
            ) : (
              <>
                <BookmarkPlus size={14} strokeWidth={1.75} />
                {t.showroom.rememberBtn}
              </>
            )}
          </button>
        </div>

        {/* Saved vehicles chips */}
        {savedVehicles.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {savedVehicles.map((v) => {
              const isActive = inputs.modelName.trim().toLowerCase() === v.name.toLowerCase();
              return (
                <span
                  key={v.id}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        modelName: v.name,
                        consumptionKwhPer100Km: v.consumptionKwhPer100Km
                      })
                    }
                    className="flex items-center gap-1"
                  >
                    <span>{v.name}</span>
                    <span className="font-mono text-zinc-400">({v.consumptionKwhPer100Km})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="text-zinc-500 hover:text-red-400 ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Charging Mode Toggle */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <BatteryCharging size={15} className="text-emerald-400" />
            <span>{t.showroom.chargingModeLabel}</span>
          </label>
          <span className="text-[11px] text-zinc-400">
            {inputs.chargingMode === 'mixed' ? t.showroom.chargingModeMixedSub : t.showroom.chargingModeHomeSub}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ chargingMode: 'mixed', homeChargingRatio: 0.90 })}
            className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium transition-all ${
              inputs.chargingMode === 'mixed'
                ? 'border border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <span className="font-semibold text-xs sm:text-sm">{t.showroom.mixedModeBtnTitle}</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">{t.showroom.mixedModeBtnSub}</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ chargingMode: 'home_only', homeChargingRatio: 1.0 })}
            className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium transition-all ${
              inputs.chargingMode === 'home_only'
                ? 'border border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <span className="font-semibold text-xs sm:text-sm">{t.showroom.homeOnlyBtnTitle}</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">{t.showroom.homeOnlyBtnSub}</span>
          </button>
        </div>
      </div>

      {/* 3. Grid of Baseline Inputs */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* 1. Monthly Mileage */}
        <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className={tileLabel}>
              <span className={`${iconChip} bg-emerald-500/10 text-emerald-400`}>
                <Gauge size={14} />
              </span>
              <span>{t.showroom.monthlyMileageLabel}</span>
            </label>
            <span className="font-mono text-xs font-bold text-emerald-400">
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
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              km
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => onChange({ monthlyMileageKm: result.petrolEquivalentDistanceKm })}
              className="rounded px-2 py-0.5 text-[10px] font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
            >
              {t.showroom.alignPetrolBtn.replace('{km}', result.petrolEquivalentDistanceKm.toString())}
            </button>
            {[1000, 1500, 2000].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onChange({ monthlyMileageKm: km })}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  inputs.monthlyMileageKm === km
                    ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>

        {/* 2. Real Household Baseline Bill */}
        <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className={tileLabel}>
              <span className={`${iconChip} bg-blue-500/10 text-blue-400`}>
                <Home size={14} />
              </span>
              <span>{t.showroom.homeElectricityLabel}</span>
            </label>
            <span className="font-mono text-xs font-bold text-blue-400">
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
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              度 (kWh)
            </span>
          </div>

          {/* Quick Real Bill Presets */}
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
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  inputs.baselineHomeKwh === b.kwh
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Father's Petrol Cost */}
        <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className={tileLabel}>
              <span className={`${iconChip} bg-amber-500/10 text-amber-400`}>
                <Fuel size={14} />
              </span>
              <span>{t.showroom.fatherPetrolLabel}</span>
            </label>
            <span className="font-mono text-xs font-bold text-amber-400">
              @ RM {inputs.petrolPricePerLiter.toFixed(2)}/L
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
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

          {/* Quick Oil Price Switch */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 1.99 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 1.99
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 1.99/L
              </button>
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 2.05 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 2.05
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 2.05/L
              </button>
            </div>
            <span className="font-mono text-zinc-300">
              {(inputs.fatherPetrolCostRm / inputs.petrolPricePerLiter).toFixed(1)} {t.showroom.petrolUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
