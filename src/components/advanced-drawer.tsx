import { Share, X } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { calculateEv } from '../utils/calculator';
import { useState } from 'react';

interface AdvancedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvancedDrawer({ isOpen, onClose }: AdvancedDrawerProps) {
  const { advanced, updateAdvanced, consumption, mileage, baselineKwh, petrolRm, mode } = useCalculatorStore();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const result = calculateEv(consumption, mileage, baselineKwh, petrolRm, mode, advanced.chargingLoss, advanced.publicDcRate);

  const reportText = `Malaysia EV Calculator\n\nConsumption: ${consumption} kWh/100km\nMileage: ${mileage} km/mo\nPetrol: RM ${petrolRm}/mo\n\nMonthly Net Savings: RM ${result.monthlyNetSavings.toFixed(2)}\nTotal EV Charging: RM ${(result.marginalCost + result.publicCost).toFixed(2)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            <h2 className="text-h3 text-text-primary">Advanced Settings</h2>
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-stack-md">
            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">Petrol price per litre</label>
              <div className="flex items-center space-x-2">
                <span className="text-body text-text-secondary">RM</span>
                <input 
                  type="number" 
                  value={advanced.petrolPrice}
                  onChange={(e) => updateAdvanced({ petrolPrice: Number(e.target.value) })}
                  className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">Fuel economy (km/L)</label>
              <input 
                type="number" 
                value={advanced.fuelEconomy}
                onChange={(e) => updateAdvanced({ fuelEconomy: Number(e.target.value) })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">Charging loss (%)</label>
              <input 
                type="number" 
                value={advanced.chargingLoss * 100}
                onChange={(e) => updateAdvanced({ chargingLoss: Number(e.target.value) / 100 })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary"
              />
            </div>

             <div className="flex justify-between items-center">
              <label className="text-body text-text-secondary">Public DC rate (RM/kWh)</label>
              <input 
                type="number" 
                value={advanced.publicDcRate}
                onChange={(e) => updateAdvanced({ publicDcRate: Number(e.target.value) })}
                className="w-20 bg-surface-overlay border border-border-subtle rounded px-tight py-micro text-right text-body text-text-primary"
                step="0.1"
              />
            </div>
          </div>

          <div className="pt-stack-md border-t border-border-subtle space-y-stack-md">
            <h3 className="text-body-lg text-text-primary font-semibold">Share Report</h3>
            <div className="bg-surface-overlay p-snug rounded-md border border-border-subtle text-caption text-text-secondary whitespace-pre-wrap font-display">
              {reportText}
            </div>
            <div className="flex space-x-tight">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center space-x-2 bg-surface-overlay border border-border-subtle text-text-primary py-tight rounded-md active:scale-[0.98]"
              >
                <Share size={16} />
                <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
