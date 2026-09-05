import { useEffect, useState } from 'react';
import { ChevronLeft, Info, Sun, Moon } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { useResultsStore } from '../stores/results.store';
import { calculateEv, calculateTnbBill } from '../utils/calculator';
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
  
  const result = calculateEv(
    store.consumption, 
    store.mileage, 
    store.baselineKwh, 
    store.petrolRm, 
    store.mode, 
    store.advanced.chargingLoss, 
    store.advanced.publicDcRate
  );

  const tnbCombined = calculateTnbBill(store.baselineKwh + (store.mileage / 100) * store.consumption * (1 + store.advanced.chargingLoss) * (store.mode === 'mixed' ? 0.9 : 1.0));
  const tnbBaseline = calculateTnbBill(store.baselineKwh);
  
  const isPositive = result.monthlyNetSavings >= 0;
  
  const comparatorVehicle = PRESETS.find(p => p.id === selectedComparatorId) || PRESETS[0];

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
               {isPositive ? '+' : '-'}RM <CountUp to={Math.abs(result.monthlyNetSavings)} />
             </div>
             
             <div className="flex justify-between w-full mt-stack-md pt-stack-md border-t border-border-subtle text-center">
               <div>
                 <div className="text-caption text-text-secondary">{txt.oneYear}</div>
                 <div className="text-body-lg font-display text-text-primary">RM {(result.monthlyNetSavings * 12).toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary">{txt.fiveYear}</div>
                 <div className="text-body-lg font-display text-text-primary">RM {(result.monthlyNetSavings * 60).toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary">{txt.tco}</div>
                 <div className="text-caption text-text-disabled mt-1">{txt.inclRoadTax}</div>
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
                 <span className="font-display tabular-nums text-text-primary">RM {result.marginalCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pb-tight border-b border-border-subtle">
                 <span className="text-text-secondary">{txt.publicDcCost}</span>
                 <span className="font-display tabular-nums text-text-primary">RM {result.publicCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pt-tight">
                 <span className="text-text-primary font-semibold">{txt.totalEvCharging}</span>
                 <span className="font-display tabular-nums text-text-primary font-bold">RM {(result.marginalCost + result.publicCost).toFixed(2)}</span>
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
               onClick={() => document.getElementById('tnb')?.scrollIntoView({ behavior: 'smooth' })}
               className="px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-full text-caption text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
             >
               {txt.seeTnbAudit}
             </button>
           </div>
        </section>

        {/* Section 3: Comparator */}
        <section id="comparator" className="space-y-stack-md">
           <h2 className="text-h3 text-text-primary font-semibold">{txt.comparatorTitle}</h2>
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base overflow-hidden">
             
             <div className="grid grid-cols-3 gap-2 text-caption text-text-secondary mb-3">
               <div></div>
               <div className="text-center p-2 bg-surface-overlay rounded">
                 {txt.carA}<br/><span className="text-brand-accent">{txt.activeInputs}</span>
               </div>
               <div>
                  <select 
                    value={selectedComparatorId}
                    onChange={e => setSelectedComparatorId(e.target.value)}
                    className="w-full h-full p-2 bg-surface-overlay border border-border-subtle rounded text-center text-text-primary appearance-none outline-none font-medium"
                  >
                    {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
             </div>

             <div className="space-y-0 divide-y divide-border-subtle">
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">{txt.motorKw}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">—</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.motorKw}</div>
               </div>
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">{txt.batteryKwh}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">—</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.batteryKwh}</div>
               </div>
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">{txt.cost100km}</div>
                 <div className="text-center font-display tabular-nums text-text-primary">
                    RM {(((result.marginalCost + result.publicCost) / store.mileage) * 100).toFixed(2)}
                 </div>
                 <div className="text-center font-display tabular-nums text-text-primary text-text-disabled">--</div>
               </div>
             </div>

           </div>
        </section>

        {/* Section 6: TNB Bill Audit */}
        <section id="tnb" className="space-y-stack-md">
           <h2 className="text-h3 text-text-primary font-semibold">{txt.tnbAuditTitle}</h2>
           
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base">
             
             {/* Threshold Warning */}
             {(store.baselineKwh + (store.mileage / 100) * store.consumption) > 600 && store.baselineKwh <= 600 && (
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
                     <td className="py-3 px-2 text-right">{tnbBaseline.baseBill.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.baseBill.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.baseBill - tnbBaseline.baseBill).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">{txt.sstTax}</td>
                     <td className="py-3 px-2 text-right">{tnbBaseline.sst.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.sst.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.sst - tnbBaseline.sst).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">{txt.kwtbb}</td>
                     <td className="py-3 px-2 text-right">{tnbBaseline.kwtbb.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.kwtbb.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.kwtbb - tnbBaseline.kwtbb).toFixed(2)}</td>
                   </tr>
                 </tbody>
                 <tfoot>
                   <tr className="border-t border-border-subtle font-semibold">
                     <td className="py-3 text-text-primary font-body pr-2">{txt.totalRm}</td>
                     <td className="py-3 px-2 text-right font-display tabular-nums text-text-primary">{tnbBaseline.totalRm.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right font-display tabular-nums text-text-primary">{tnbCombined.totalRm.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right font-display tabular-nums text-brand-primary">+{result.marginalCost.toFixed(2)}</td>
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
