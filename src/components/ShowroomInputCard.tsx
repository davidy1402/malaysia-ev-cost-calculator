import React from 'react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { Zap, Fuel, Home, Gauge } from 'lucide-react';

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

const tileLabel = 'flex items-center gap-2 text-xs font-semibold text-ink';
const iconChip = 'flex h-6 w-6 items-center justify-center rounded-md';
const numInput =
  'w-full rounded-xl border border-line bg-inset px-3 py-2.5 text-sm font-semibold text-ink ' +
  'placeholder:text-faint transition-colors focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/15';

export const ShowroomInputCard: React.FC<ShowroomInputCardProps> = ({
  inputs,
  result,
  onChange
}) => {
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

  return (
    <div className="card space-y-5 p-4 sm:p-6">
      {/* Showroom Main Target: Energy Consumption */}
      <div className="rounded-2xl border border-brand/25 bg-brand-soft/60 p-4 sm:p-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
            问销售的第一个数字
          </span>
          <h4 className="mt-0.5 text-sm font-semibold text-ink">
            这台车 Official 能耗多少？
          </h4>
        </div>

        <div className="mt-4 flex items-center gap-3">
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
              className="font-display w-full rounded-2xl border border-brand/30 bg-surface px-4 py-3 pr-28 text-[32px] font-semibold leading-none tracking-tight text-brand placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:text-[36px]"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
              kWh / 100 km
            </span>
          </div>

          {/* Quick step adjusters for fast thumb interaction */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.round((inputs.consumptionKwhPer100Km + 0.5) * 10) / 10 })}
              className="flex h-8 w-12 items-center justify-center rounded-full border border-line bg-surface text-xs font-semibold text-ink shadow-card transition-all hover:border-line-strong active:scale-95"
            >
              +0.5
            </button>
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.max(5, Math.round((inputs.consumptionKwhPer100Km - 0.5) * 10) / 10) })}
              className="flex h-8 w-12 items-center justify-center rounded-full border border-line bg-surface text-xs font-semibold text-ink shadow-card transition-all hover:border-line-strong active:scale-95"
            >
              −0.5
            </button>
          </div>
        </div>

        {/* Model name + save */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={inputs.modelName}
            onChange={(e) => onChange({ modelName: e.target.value })}
            placeholder="这是哪台车？（选填，如 Atto 3）"
            maxLength={40}
            className="min-w-0 flex-1 rounded-xl border border-brand/25 bg-surface px-3 py-2 text-sm font-medium text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          />
          <button
            type="button"
            onClick={handleSaveVehicle}
            disabled={!canSave}
            className={`flex h-[38px] shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all active:scale-95 ${
              justSaved
                ? 'bg-brand text-onbrand'
                : canSave
                  ? 'border border-brand/40 bg-surface text-brand hover:bg-brand-soft'
                  : 'cursor-not-allowed border border-line bg-surface text-faint'
            }`}
            title="记住这台车的名字和能耗，下次一点就带回"
          >
            {justSaved ? (
              <>
                <Check size={14} strokeWidth={1.75} />
                已记住
              </>
            ) : (
              <>
                <BookmarkPlus size={14} strokeWidth={1.75} />
                记住
              </>
            )}
          </button>
        </div>

        {/* Saved vehicles history chips */}
        {savedVehicles.length > 0 && (
          <div className="mt-3">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
              试驾过的车 · 点一下带回来
            </div>
            <div className="flex flex-wrap gap-1.5">
              {savedVehicles.map((v) => {
                const isActive = inputs.modelName.trim().toLowerCase() === v.name.toLowerCase();
                return (
                  <span
                    key={v.id}
                    className={`group flex items-center gap-1 rounded-full border py-1 pl-2.5 pr-1.5 text-[11px] font-medium transition-colors ${
                      isActive
                        ? 'border-brand bg-brand text-onbrand'
                        : 'border-line bg-surface text-ink hover:border-brand/40'
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
                      className="flex items-center gap-1.5"
                    >
                      <span>{v.name}</span>
                      <span className={isActive ? 'text-onbrand/75' : 'text-faint'}>
                        {v.consumptionKwhPer100Km}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVehicle(v.id)}
                      aria-label={`删除 ${v.name}`}
                      className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? 'text-onbrand/70 hover:bg-white/20 hover:text-onbrand'
                          : 'text-faint hover:bg-warn-soft hover:text-warn'
                      }`}
                    >
                      <X size={11} strokeWidth={2} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Inputs: Mileage, Home Bill, Father's Petrol */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* 1. Monthly Mileage */}
        <div className="space-y-2 rounded-2xl border border-line bg-inset/50 p-3.5">
          <div className="flex items-center justify-between">
            <label className={tileLabel}>
              <span className={`${iconChip} bg-brand-soft text-brand`}>
                <Gauge size={13} strokeWidth={1.75} />
              </span>
              <span>每月大概开</span>
            </label>
            <span className="text-[11px] font-semibold text-brand">
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
              placeholder="1500"
              className={`${numInput} pr-14`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-faint">
              km / 月
            </span>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            <button
              type="button"
              onClick={() => onChange({ monthlyMileageKm: result.petrolEquivalentDistanceKm })}
              title="根据每月RM210油费推算的月行驶里程"
              className="rounded px-2 py-0.5 text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
            >
              对齐爸爸油费 ({result.petrolEquivalentDistanceKm}km)
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

        {/* 2. Current Baseline Home Electricity Bill */}
        <div className="space-y-2 rounded-2xl border border-line bg-inset/50 p-3.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Home size={16} strokeWidth={1.75} className="text-blue-400" />
              <span>家里平均电费</span>
            </label>
            <span className="text-[11px] font-semibold text-grid">
              ≈ {result.baselineBill.kwh} 度
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-faint">
              RM
            </span>
            <input
              type="number"
              step="10"
              min="0"
              max="5000"
              inputMode="decimal"
              value={inputs.baselineHomeBillRm || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ baselineHomeBillRm: isNaN(val) ? 0 : val });
              }}
              placeholder="200"
              className={`${numInput} pl-9`}
            />
          </div>

          {/* Quick Home Bill Presets */}
          <div className="flex flex-wrap gap-1 pt-1">
            {[
              { label: 'RM 200 (常态~448度)', rm: 200 },
              { label: 'RM 250 (峰值~525度)', rm: 250 },
              { label: 'RM 180 (省电~400度)', rm: 180 }
            ].map((b) => (
              <button
                key={b.rm}
                type="button"
                onClick={() => onChange({ baselineHomeBillRm: b.rm })}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  inputs.baselineHomeBillRm === b.rm
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Father's Current Petrol Cost */}
        <div className="space-y-2 rounded-2xl border border-line bg-inset/50 p-3.5">
          <div className="flex items-center justify-between">
            <label className={tileLabel}>
              <span className={`${iconChip} bg-oil-soft text-oil`}>
                <Fuel size={13} strokeWidth={1.75} />
              </span>
              <span>每月汽油开销</span>
            </label>
            <span className="text-xs font-mono font-medium text-amber-400">
              @ RM {inputs.petrolPricePerLiter.toFixed(2)}/L
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-faint">
              RM
            </span>
            <input
              type="number"
              step="10"
              min="0"
              max="2000"
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
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 1.99 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 1.99
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 1.99/L (基准)
              </button>
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 2.05 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 2.05
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 2.05/L (RON95)
              </button>
            </div>
            <span className="font-mono text-zinc-300">
              ~{(inputs.fatherPetrolCostRm / inputs.petrolPricePerLiter).toFixed(1)} L
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
