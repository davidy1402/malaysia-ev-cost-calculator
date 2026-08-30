import React from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Fuel, Zap, BatteryCharging, MapPin } from 'lucide-react';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface CostPer100KmComparisonProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const CostPer100KmComparison: React.FC<CostPer100KmComparisonProps> = ({
  inputs,
  result
}) => {
  const { t } = useLanguage();
  const fullBatteryKwh = inputs.batteryCapacityKwh || 60.22;
  const fullChargeCostHome = result.singleFullChargeMarginalCost;
  const fullChargeCostPublic = Math.round(fullBatteryKwh * (inputs.publicDcPricePerKwh || 1.40) * 100) / 100;

  const trips = [
    {
      name: t.cost100km.commuteTrip,
      distance: 50,
      petrolCost: (50 / 100) * result.petrolCostPer100Km,
      evCost: (50 / 100) * result.evCostPer100Km
    },
    {
      name: t.cost100km.jbKlTrip,
      distance: 330,
      petrolCost: (330 / 100) * result.petrolCostPer100Km,
      evCost: (330 / 100) * result.evCostPer100Km
    },
    {
      name: t.cost100km.klPenangTrip,
      distance: 350,
      petrolCost: (350 / 100) * result.petrolCostPer100Km,
      evCost: (350 / 100) * result.evCostPer100Km
    }
  ];

  return (
    <div className="doppelrand-shell">
      <div className="doppelrand-core space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Zap size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {t.cost100km.title}
              </h3>
              <p className="text-[11px] text-muted">
                {t.cost100km.sub}
              </p>
            </div>
          </div>
        </div>

        {/* Main 100km Bar Visualizer */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Petrol Bar */}
          <div className="space-y-2.5 rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Fuel size={15} strokeWidth={2} className="text-oil" />
                <span>{t.cost100km.petrolLabel}</span>
              </div>
              <span className="font-mono text-lg font-bold text-oil">
                {formatRm(result.petrolCostPer100Km)}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
              <div className="h-full w-full rounded-full bg-oil/80" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted font-medium">
              <span>{t.cost100km.petrolLiters.replace('{liters}', (100 / inputs.petrolFuelEfficiencyKmPerL).toFixed(1))}</span>
              <span>{t.cost100km.atPrice.replace('{price}', inputs.petrolPricePerLiter.toFixed(2))}</span>
            </div>
          </div>

          {/* EV Bar */}
          <div className="space-y-2.5 rounded-2xl border border-brand/35 bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Zap size={15} strokeWidth={2} className="text-brand" />
                <span>{t.cost100km.evLabel.replace('{model}', inputs.modelName.trim() || 'EV')}</span>
              </div>
              <span className="font-mono text-lg font-bold text-brand">
                {formatRm(result.evCostPer100Km)}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
              <div
                className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(10, (result.evCostPer100Km / result.petrolCostPer100Km) * 100))}%`
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted font-medium">
              <span>
                {t.cost100km.evGrid
                  .replace('{net}', inputs.consumptionKwhPer100Km.toString())
                  .replace('{gross}', (inputs.consumptionKwhPer100Km * 1.10).toFixed(1))}
              </span>
              <span className="font-bold text-brand">
                {t.cost100km.cheaperBy.replace('{ratio}', result.savingsRatioPerKm.toString())}
              </span>
            </div>
          </div>
        </div>

        {/* Battery & Real Trip Scenario Table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <MapPin size={14} strokeWidth={2} className="text-brand" />
              <span>{t.cost100km.tripTitle}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted font-mono">
              <BatteryCharging size={14} strokeWidth={2} className="text-brand" />
              <span>
                {t.cost100km.fullChargeTag
                  .replace('{kwh}', fullBatteryKwh.toString())
                  .replace('{home}', formatRm(fullChargeCostHome))
                  .replace('{public}', formatRm(fullChargeCostPublic))}
              </span>
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper/80 text-[11px] text-muted font-bold border-b border-line">
                <tr>
                  <th className="px-4 py-2.5">{t.cost100km.colTrip}</th>
                  <th className="px-3 py-2.5 text-right">{t.cost100km.colPetrol}</th>
                  <th className="px-3 py-2.5 text-right">{t.cost100km.colEv}</th>
                  <th className="px-4 py-2.5 text-right text-brand">{t.cost100km.colSave}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-mono">
                {trips.map((trip) => {
                  const tripSavings = Math.round((trip.petrolCost - trip.evCost) * 100) / 100;
                  return (
                    <tr key={trip.name} className="transition-colors hover:bg-paper/40">
                      <td className="px-4 py-2.5 font-sans font-medium text-ink">{trip.name}</td>
                      <td className="px-3 py-2.5 text-right text-muted">{formatRm(trip.petrolCost)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-ink">{formatRm(trip.evCost)}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-brand">
                        +{formatRm(tripSavings)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="flex justify-between text-[11px] text-faint">
            <span>{t.cost100km.marginalFootnote}</span>
            <span className="font-mono">{t.cost100km.perKmFootnote.replace('{cost}', formatRm(result.evCostPer100Km / 100, { decimals: 3 }))}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
