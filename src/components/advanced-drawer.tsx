import { Share, X, Check } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { calculateAllEvMetrics } from '../utils/tnbTariff';
import { useState } from 'react';
import { evCalcTranslations } from '../i18n/evCalcTranslations';

interface AdvancedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvancedDrawer({ isOpen, onClose }: AdvancedDrawerProps) {
  const store = useCalculatorStore();
  const { advanced, updateAdvanced } = store;
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const txt = evCalcTranslations[store.language] || evCalcTranslations.en;
  const metrics = calculateAllEvMetrics({
    modelName: store.modelName,
    consumptionKwhPer100Km: store.consumption,
    motorPowerKw: store.motorKw,
    batteryCapacityKwh: store.batteryKwh,
    monthlyMileageKm: store.mileage,
    baselineHomeKwh: store.baselineKwh,
    baselineHomeBillRm: 0,
    fatherPetrolCostRm: store.petrolRm,
    petrolEngineCc: store.petrolEngineCc || 1500,
    chargingMode: store.mode === 'condo' ? 'public_only' : 'mixed',
    petrolPricePerLiter: store.advanced.petrolPrice,
    petrolFuelEfficiencyKmPerL: store.advanced.fuelEconomy,
    chargingEfficiency: 1 - store.advanced.chargingLoss,
    homeChargingRatio: store.mode === 'condo' ? 0.0 : 0.9,
    publicDcPricePerKwh: store.advanced.publicDcRate,
    afaRateSen: 3.80,
    isTouEnabled: store.advanced.touEnabled,
    touOffPeakRateSen: 28.0
  });

  const reportText = txt.reportSummary
    .replace('{model}', store.modelName)
    .replace('{consumption}', store.consumption.toFixed(1))
    .replace('{mileage}', store.mileage.toString())
    .replace('{petrol}', store.petrolRm.toFixed(2))
    .replace('{savings}', metrics.monthlyNetSavings.toFixed(2))
    .replace('{evCost}', metrics.totalEvChargingCost.toFixed(2))
    .replace('{tcoSavings}', metrics.fiveYearTcoWithRoadTaxSavings.toFixed(0));

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] bg-surface-raised border-t border-border-subtle rounded-t-xl shadow-floating pb-[env(safe-area-inset-bottom)] max-h-[90vh] flex flex-col">
        <div className="flex justify-center p-3">
          <div className="w-12 h-1.5 bg-border-strong rounded-full" />
        </div>
        <div className="px-comfortable pb-comfortable overflow-y-auto flex-1 min-h-0 space-y-section">
          
          <div className="flex items-center justify-between">
            <h2 className="text-h3 text-text-primary">{txt.advancedSettings}</h2>
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-stack-md">
            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">{txt.petrolPriceLabel}</label>
              <div className="flex items-center space-x-2">
                <span className="text-body text-text-secondary">RM</span>
                <input 
                  type="number" 
                  value={advanced.petrolPrice}
                  onChange={(e) => updateAdvanced({ petrolPrice: Number(e.target.value) })}
                  className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary outline-none focus:border-brand-primary"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">{txt.fuelEconomyLabel}</label>
              <input 
                type="number" 
                value={advanced.fuelEconomy}
                onChange={(e) => updateAdvanced({ fuelEconomy: Number(e.target.value) })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">{txt.chargingLossLabel}</label>
              <input 
                type="number" 
                value={Math.round(advanced.chargingLoss * 100)}
                onChange={(e) => updateAdvanced({ chargingLoss: Number(e.target.value) / 100 })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary outline-none focus:border-brand-primary"
              />
            </div>

             <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">{txt.publicDcRateLabel}</label>
              <input 
                type="number" 
                value={advanced.publicDcRate}
                onChange={(e) => updateAdvanced({ publicDcRate: Number(e.target.value) })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary outline-none focus:border-brand-primary"
                step="0.1"
              />
            </div>
          </div>

          <div className="pt-stack-md border-t border-border-subtle space-y-stack-md">
            <h3 className="text-body-lg text-text-primary font-semibold">{txt.shareReportTitle}</h3>
            <div className="bg-surface-overlay p-snug rounded-md border border-border-subtle text-caption text-text-secondary whitespace-pre-wrap font-display">
              {reportText}
            </div>
            <div className="flex space-x-tight">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center space-x-2 bg-surface-overlay border border-border-subtle text-text-primary py-tight rounded-md active:scale-[0.98] hover:border-brand-primary transition-colors text-caption font-medium"
              >
                {isCopied ? <Check size={16} className="text-brand-primary" /> : <Share size={16} />}
                <span>{isCopied ? txt.copied : txt.copyReport}</span>
              </button>
              <button 
                onClick={handleWhatsApp}
                className="px-4 flex items-center justify-center bg-brand-primary text-text-inverse py-tight rounded-md active:scale-[0.98] hover:opacity-90 transition-opacity text-caption font-semibold"
              >
                {txt.shareWhatsApp}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
