import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, Info, Sun, Moon, Sparkles, ShieldCheck } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { useResultsStore } from '../stores/results.store';
import { calculateAllEvMetrics } from '../utils/tnbTariff';
import { UserInputs } from '../types/calculator';
import { PRESETS } from '../data/presets';
import { evCalcTranslations } from '../i18n/evCalcTranslations';

function CountUp({ to, duration = 0.8 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) return;
    
    let startTime: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setValue(start + easeProgress * (end - start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [to, duration]);

  return <>{value.toFixed(2)}</>;
}

export default function ResultsPage({ onBack = () => {} }: { onBack?: () => void }) {
  const store = useCalculatorStore();
  const { selectedComparatorId, setSelectedComparatorId } = useResultsStore();
  const txt = evCalcTranslations[store.language] || evCalcTranslations.en;

  // Active Car A inputs
  const inputsA = useMemo<UserInputs>(() => ({
    modelName: store.modelName,
    consumptionKwhPer100Km: store.consumption,
    motorPowerKw: store.motorKw,
    batteryCapacityKwh: store.batteryKwh,
    monthlyMileageKm: store.mileage,
    baselineHomeKwh: store.baselineKwh,
    baselineHomeBillRm: 0,
    fatherPetrolCostRm: store.petrolRm,
    petrolEngineCc: store.petrolEngineCc || 1500,
    chargingMode: store.mode === 'mixed' ? 'mixed' : 'home_only',
    petrolPricePerLiter: store.advanced.petrolPrice,
    petrolFuelEfficiencyKmPerL: store.advanced.fuelEconomy,
    chargingEfficiency: 1 - store.advanced.chargingLoss,
    homeChargingRatio: store.mode === 'mixed' ? 0.9 : 1.0,
    publicDcPricePerKwh: store.advanced.publicDcRate,
    afaRateSen: 3.80,
    isTouEnabled: store.advanced.touEnabled,
    touOffPeakRateSen: 28.0
  }), [store]);

  const resultA = useMemo(() => calculateAllEvMetrics(inputsA), [inputsA]);

  // Comparator candidate Car B
  const comparatorVehicle = useMemo(() => {
    return PRESETS.find(p => p.id === selectedComparatorId) ||
      PRESETS.find(p => p.id !== store.selectedPresetId) ||
      PRESETS[1];
  }, [selectedComparatorId, store.selectedPresetId]);

  const inputsB = useMemo<UserInputs>(() => ({
    ...inputsA,
    modelName: comparatorVehicle.name,
    consumptionKwhPer100Km: comparatorVehicle.consumption,
    motorPowerKw: comparatorVehicle.motorKw,
    batteryCapacityKwh: comparatorVehicle.batteryKwh,
  }), [inputsA, comparatorVehicle]);

  const resultB = useMemo(() => calculateAllEvMetrics(inputsB), [inputsB]);

  const isPositive = resultA.monthlyNetSavings >= 0;
  const fiveYearTcoDiff = Math.round((resultA.fiveYearTcoWithRoadTaxSavings - resultB.fiveYearTcoWithRoadTaxSavings) * 100) / 100;

  return (
    <div className="relative min-h-screen bg-background-default antialiased pb-[calc(40px+env(safe-area-inset-bottom))]">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-default/80 backdrop-blur-md border-b border-border-subtle pt-[env(safe-area-inset-top)] px-base py-tight flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-2 -ml-2 text-text-secondary hover:text-text-primary active:scale-[0.98]" aria-label="Back">
            <ChevronLeft size={24} />
          </button>
          <img src="./logo.png" alt="EV Calc MY" className="w-6 h-6 rounded-md shadow-sm ml-1" />
          <h1 className="text-body-lg font-semibold text-text-primary">{txt.verdictTitle}</h1>
        </div>
        <button
          onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
          className="p-1 text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
          aria-label="Toggle theme"
        >
          {store.theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </header>

      <main className="px-base py-section space-y-section-y">
        
        {/* Section 2: Verdict Hero */}
        <section id="verdict" className="space-y-stack-md">
           <div className="bg-surface-base border border-border-subtle rounded-xl p-comfortable flex flex-col items-center">
             <div className="text-body text-text-secondary">{txt.monthlyNetSavings}</div>
             <div className={`mt-2 text-[57px] font-display font-bold tracking-tight leading-none ${isPositive ? 'text-status-positive' : 'text-status-error'}`}>
               {isPositive ? '+' : '-'}RM <CountUp to={Math.abs(resultA.monthlyNetSavings)} />
             </div>
             
             <div className="grid grid-cols-3 w-full mt-stack-md pt-stack-md border-t border-border-subtle text-center gap-2">
               <div>
                 <div className="text-caption text-text-secondary">{txt.oneYear}</div>
                 <div className="text-body-lg font-display text-text-primary">RM {(resultA.monthlyNetSavings * 12).toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary">{txt.fiveYear}</div>
                 <div className="text-body-lg font-display text-text-primary">RM {resultA.fiveYearNetSavings.toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary font-medium">{txt.tco}</div>
                 <div className="text-body-lg font-display font-bold text-brand-accent">
                   {resultA.fiveYearTcoWithRoadTaxSavings >= 0 ? '+' : ''}RM {resultA.fiveYearTcoWithRoadTaxSavings.toFixed(0)}
                 </div>
                 <div className="text-[10px] text-text-secondary mt-0.5 whitespace-nowrap">
                   {txt.inclRoadTax} ({resultA.annualRoadTaxDifferenceRm * 5 >= 0 ? '+' : ''}RM {(resultA.annualRoadTaxDifferenceRm * 5).toFixed(0)})
                 </div>
               </div>
             </div>
           </div>

           {/* Waterfall Breakdown */}
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base">
             <div className="space-y-tight">
               <div className="flex justify-between text-body">
                 <span className="text-text-secondary">{txt.oldPetrolSpend}</span>
                 <span className="font-display tabular-nums text-text-primary">RM {store.petrolRm.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body">
                 <span className="text-text-secondary">{txt.marginalHomeElec}</span>
                 <span className="font-display tabular-nums text-text-primary">RM {resultA.marginalHomeElectricityCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pb-tight border-b border-border-subtle">
                 <span className="text-text-secondary">{txt.publicDcCost}</span>
                 <span className="font-display tabular-nums text-text-primary">RM {resultA.publicChargingCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pt-tight">
                 <span className="text-text-primary font-semibold">{txt.totalEvCharging}</span>
                 <span className="font-display tabular-nums text-text-primary font-bold">RM {resultA.totalEvChargingCost.toFixed(2)}</span>
               </div>
             </div>
           </div>

           {/* Anchor Nav */}
           <div className="flex flex-wrap gap-2 pt-2">
             <button
               onClick={() => document.getElementById('comparator')?.scrollIntoView({ behavior: 'smooth' })}
               className="px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-full text-caption text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
             >
               {txt.seeComparator}
             </button>
             <button
               onClick={() => document.getElementById('roadtax')?.scrollIntoView({ behavior: 'smooth' })}
               className="px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-full text-caption text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
             >
               {store.language === 'zh' ? '查看 2026 路税 ↓' : 'See Road Tax ↓'}
             </button>
             <button
               onClick={() => document.getElementById('tnb')?.scrollIntoView({ behavior: 'smooth' })}
               className="px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-full text-caption text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
             >
               {txt.seeTnbAudit}
             </button>
           </div>
        </section>

        {/* Section 2: Comparator */}
        <section id="comparator" className="space-y-stack-md">
           <div className="flex flex-wrap items-center justify-between gap-2">
             <h2 className="text-h3 text-text-primary font-semibold">{txt.comparatorTitle}</h2>
             {fiveYearTcoDiff !== 0 && (
               <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-caption text-brand-primary font-semibold shadow-sm">
                 <Sparkles size={13} className="shrink-0" />
                 <span>
                   {fiveYearTcoDiff > 0
                     ? txt.winnerTag.replace('{car}', store.modelName).replace('{amount}', Math.abs(fiveYearTcoDiff).toFixed(0))
                     : txt.winnerTag.replace('{car}', comparatorVehicle.name).replace('{amount}', Math.abs(fiveYearTcoDiff).toFixed(0))}
                 </span>
               </div>
             )}
           </div>

           <div className="bg-surface-base border border-border-subtle rounded-xl p-base overflow-hidden">
             
             <div className="grid grid-cols-3 gap-2 text-caption text-text-secondary mb-3">
               <div></div>
               <div className="text-center p-2 bg-surface-overlay rounded border border-border-subtle">
                 <span className="font-bold text-text-primary block truncate">{store.modelName}</span>
                 <span className="text-brand-accent text-[11px] font-medium">{txt.activeInputs}</span>
               </div>
               <div>
                  <select 
                    value={comparatorVehicle.id}
                    onChange={e => setSelectedComparatorId(e.target.value)}
                    className="w-full h-full p-2 bg-surface-overlay border border-border-subtle rounded text-center text-text-primary appearance-none outline-none font-medium cursor-pointer"
                  >
                    {PRESETS.map(p => (
                      <option key={p.id} value={p.id} className="bg-surface-base text-text-primary">
                        {p.name}
                      </option>
                    ))}
                  </select>
               </div>
             </div>

             <div className="space-y-0 divide-y divide-border-subtle">
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.motorKw}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{store.motorKw} kW</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.motorKw} kW</div>
               </div>
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.batteryKwh}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{store.batteryKwh} kWh</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.batteryKwh} kWh</div>
               </div>
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.cost100km}</div>
                 <div className="text-center font-display tabular-nums font-semibold text-text-primary">
                    RM {resultA.evCostPer100Km.toFixed(2)}
                 </div>
                 <div className="text-center font-display tabular-nums font-semibold text-text-primary">
                    RM {resultB.evCostPer100Km.toFixed(2)}
                 </div>
               </div>
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.monthlyEvCost}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">
                    RM {resultA.totalEvChargingCost.toFixed(2)}
                 </div>
                 <div className="text-center font-display tabular-nums text-text-primary">
                    RM {resultB.totalEvChargingCost.toFixed(2)}
                 </div>
               </div>
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.fiveYearEnergySavings}</div>
                 <div className="text-center font-display tabular-nums font-bold text-status-positive">
                    RM {resultA.fiveYearNetSavings.toFixed(0)}
                 </div>
                 <div className="text-center font-display tabular-nums font-bold text-status-positive">
                    RM {resultB.fiveYearNetSavings.toFixed(0)}
                 </div>
               </div>
               <div className="grid grid-cols-3 py-2.5 text-body">
                 <div className="text-text-secondary text-caption sm:text-body">{txt.roadTaxEvLabel}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">
                    RM {resultA.evRoadTaxAnnualRm} {txt.perYearUnit}
                 </div>
                 <div className="text-center font-display tabular-nums text-text-primary">
                    RM {resultB.evRoadTaxAnnualRm} {txt.perYearUnit}
                 </div>
               </div>
             </div>

           </div>
        </section>

        {/* Section 3: 2026 Road Tax Deep Dive */}
        <section id="roadtax" className="space-y-stack-md">
           <div className="flex items-center gap-2">
             <ShieldCheck size={20} className="text-brand-accent" />
             <h2 className="text-h3 text-text-primary font-semibold">{txt.roadTaxSectionTitle}</h2>
           </div>
           
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base space-y-4">
             <p className="text-caption text-text-secondary leading-relaxed">
               {txt.roadTaxSub}
             </p>

             {/* Benchmark ICE Displacement Picker */}
             <div className="flex items-center justify-between border-y border-border-subtle py-3 text-body">
               <span className="text-caption text-text-secondary">{txt.roadTaxIceCcSelect}</span>
               <div className="flex gap-1.5">
                 {[1500, 1800, 2000].map(cc => (
                   <button
                     key={cc}
                     type="button"
                     onClick={() => store.setPetrolEngineCc(cc)}
                     className={`px-2.5 py-1 text-caption rounded border transition-colors ${
                       (store.petrolEngineCc || 1500) === cc
                         ? 'bg-brand-primary text-text-inverse border-brand-primary font-semibold shadow-sm'
                         : 'bg-surface-overlay text-text-secondary border-border-subtle hover:text-text-primary'
                     }`}
                   >
                     {cc === 1500 ? '1.5L (RM 90)' : cc === 1800 ? '1.8L (RM 280)' : '2.0L (RM 380)'}
                   </button>
                 ))}
               </div>
             </div>

             {/* Side by Side Tax comparison */}
             <div className="grid grid-cols-2 gap-3 pt-1">
               <div className="bg-surface-overlay border border-border-subtle rounded-lg p-3 text-center">
                 <div className="text-[11px] text-text-secondary">{txt.roadTaxEvLabel} ({store.motorKw} kW)</div>
                 <div className="text-h2 font-display font-bold text-text-primary mt-1 tabular-nums">
                   RM {resultA.evRoadTaxAnnualRm}
                 </div>
                 <div className="text-[10px] text-text-secondary">{txt.perYearUnit}</div>
               </div>

               <div className="bg-surface-overlay border border-border-subtle rounded-lg p-3 text-center">
                 <div className="text-[11px] text-text-secondary">{txt.roadTaxIceLabel} ({store.petrolEngineCc || 1500} cc)</div>
                 <div className="text-h2 font-display font-bold text-text-primary mt-1 tabular-nums">
                   RM {resultA.petrolRoadTaxAnnualRm}
                 </div>
                 <div className="text-[10px] text-text-secondary">{txt.perYearUnit}</div>
               </div>
             </div>

             {/* Summary Delta Banner */}
             <div className="p-3 bg-surface-overlay/80 border border-border-subtle rounded-lg flex justify-between items-center text-body">
               <div>
                 <div className="text-caption font-medium text-text-primary">{txt.annualDiff}</div>
                 <div className="text-[11px] text-text-secondary mt-0.5">
                   {resultA.annualRoadTaxDifferenceRm >= 0
                     ? (store.language === 'zh' ? '纯电每年节省路税' : 'EV saves on road tax')
                     : (store.language === 'zh' ? '纯电每年多缴路税' : 'EV pays more road tax')}
                 </div>
               </div>
               <div className={`font-display font-bold text-body-lg tabular-nums ${
                 resultA.annualRoadTaxDifferenceRm >= 0 ? 'text-status-positive' : 'text-status-warning'
               }`}>
                 {resultA.annualRoadTaxDifferenceRm >= 0 ? '+' : ''}RM {resultA.annualRoadTaxDifferenceRm.toFixed(2)} {txt.perYearUnit}
               </div>
             </div>
           </div>
        </section>

        {/* Section 4: TNB Bill Audit */}
        <section id="tnb" className="space-y-stack-md">
           <h2 className="text-h3 text-text-primary font-semibold">{txt.tnbAuditTitle}</h2>
           
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base">
             
             {/* Threshold Warning */}
             {resultA.crossed600Threshold && (
               <div className="mb-4 p-3 bg-status-warning/10 border border-status-warning/20 rounded flex items-start space-x-2">
                 <Info size={16} className="text-status-warning shrink-0 mt-0.5" />
                 <p className="text-caption text-text-primary leading-relaxed">
                   {txt.thresholdWarning}
                 </p>
               </div>
             )}

             {/* Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-left text-body">
                 <thead>
                   <tr className="text-caption text-text-secondary border-b border-border-subtle">
                     <th className="font-normal py-2 pr-2">{txt.tableItem}</th>
                     <th className="font-normal py-2 px-2 text-right">{txt.tableBaseline}</th>
                     <th className="font-normal py-2 px-2 text-right">{txt.tableNew}</th>
                     <th className="font-normal py-2 pl-2 text-right">{txt.tableDelta}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle font-display tabular-nums text-text-primary">
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">{txt.baseGen}</td>
                     <td className="py-3 px-2 text-right">{resultA.baselineBill.baseEnergySubtotal.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{resultA.newCombinedBill.baseEnergySubtotal.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(resultA.newCombinedBill.baseEnergySubtotal - resultA.baselineBill.baseEnergySubtotal).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">EEI Rebate</td>
                     <td className="py-3 px-2 text-right text-status-positive">-{resultA.baselineBill.eeiRebateAmount.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right text-status-positive">-{resultA.newCombinedBill.eeiRebateAmount.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(resultA.baselineBill.eeiRebateAmount - resultA.newCombinedBill.eeiRebateAmount).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">{txt.sstTax}</td>
                     <td className="py-3 px-2 text-right">{resultA.baselineBill.sstTax.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{resultA.newCombinedBill.sstTax.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(resultA.newCombinedBill.sstTax - resultA.baselineBill.sstTax).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">{txt.kwtbb}</td>
                     <td className="py-3 px-2 text-right">{resultA.baselineBill.kwtbbFund.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{resultA.newCombinedBill.kwtbbFund.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(resultA.newCombinedBill.kwtbbFund - resultA.baselineBill.kwtbbFund).toFixed(2)}</td>
                   </tr>
                 </tbody>
                 <tfoot>
                   <tr className="border-t border-border-subtle font-semibold">
                     <td className="py-3 text-text-primary font-body pr-2">{txt.totalRm}</td>
                     <td className="py-3 px-2 text-right font-display tabular-nums text-text-primary">{resultA.baselineBill.totalAmount.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right font-display tabular-nums text-text-primary">{resultA.newCombinedBill.totalAmount.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right font-display tabular-nums text-brand-primary">+{resultA.marginalHomeElectricityCost.toFixed(2)}</td>
                   </tr>
                 </tfoot>
               </table>
             </div>

           </div>
        </section>

      </main>
    </div>
  );
}
