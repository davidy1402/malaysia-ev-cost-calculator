import { useEffect, useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { useResultsStore } from '../stores/results.store';
import { calculateEv, calculateTnbBill } from '../utils/calculator';
import { PRESETS } from '../data/presets';

function CountUp({ to, duration = 0.8 }: { to: number, duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) return;
    
    let startTime: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutCubic
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
    <div className="relative min-h-screen bg-background-default antialiased pb-[env(safe-area-inset-bottom)]">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-default/80 backdrop-blur-md border-b border-border-subtle pt-[env(safe-area-inset-top)] px-base py-tight flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 text-text-secondary hover:text-text-primary active:scale-[0.98]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="ml-2 text-body-lg font-semibold text-text-primary">Financial Verdict</h1>
      </header>

      <main className="px-base py-section space-y-section-y">
        
        {/* Section 2: Verdict Hero */}
        <section id="verdict" className="space-y-stack-md">
           <div className="bg-surface-base border border-border-subtle rounded-xl p-comfortable flex flex-col items-center">
             <div className="text-body text-text-secondary">Monthly Net Savings</div>
             <div className={`mt-2 text-[57px] font-display font-bold tracking-tight leading-none ${isPositive ? 'text-status-positive' : 'text-status-error'}`}>
               {isPositive ? '+' : '-'}RM <CountUp to={Math.abs(result.monthlyNetSavings)} />
             </div>
             
             <div className="flex justify-between w-full mt-stack-md pt-stack-md border-t border-border-subtle text-center">
               <div>
                 <div className="text-caption text-text-secondary">1-Year</div>
                 <div className="text-body-lg font-display text-text-primary">RM {(result.monthlyNetSavings * 12).toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary">5-Year</div>
                 <div className="text-body-lg font-display text-text-primary">RM {(result.monthlyNetSavings * 60).toFixed(0)}</div>
               </div>
               <div>
                 <div className="text-caption text-text-secondary">TCO</div>
                 <div className="text-caption text-text-disabled mt-1">incl. Road Tax</div>
               </div>
             </div>
           </div>

           {/* Waterfall Breakdown */}
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base">
             <div className="space-y-tight">
               <div className="flex justify-between text-body">
                 <span className="text-text-secondary">Old Petrol Spend</span>
                 <span className="font-display tabular-nums text-text-primary">RM {store.petrolRm.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body">
                 <span className="text-text-secondary">- Marginal Home Elec</span>
                 <span className="font-display tabular-nums text-text-primary">RM {result.marginalCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pb-tight border-b border-border-subtle">
                 <span className="text-text-secondary">- Public DC Cost</span>
                 <span className="font-display tabular-nums text-text-primary">RM {result.publicCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-body pt-tight">
                 <span className="text-text-primary font-semibold">= Total EV Charging</span>
                 <span className="font-display tabular-nums text-text-primary">RM {(result.marginalCost + result.publicCost).toFixed(2)}</span>
               </div>
             </div>
           </div>

           {/* Anchor Nav */}
           <div className="flex flex-wrap gap-2 pt-2">
             {['Comparator', 'TNB Audit'].map(label => (
             <button key={label} onClick={() => document.getElementById(label.split(' ')[0].toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-full text-caption text-text-secondary">
               See {label} ↓
             </button>
           ))}
           </div>
        </section>

        {/* Section 3: Comparator */}
        <section id="comparator" className="space-y-stack-md">
           <h2 className="text-h3 text-text-primary font-semibold">Car Comparator</h2>
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base overflow-hidden">
             
             <div className="grid grid-cols-3 gap-2 text-caption text-text-secondary mb-3">
               <div></div>
               <div className="text-center p-2 bg-surface-overlay rounded">Car A<br/><span className="text-brand-accent">Active Inputs</span></div>
               <div>
                  <select 
                    value={selectedComparatorId}
                    onChange={e => setSelectedComparatorId(e.target.value)}
                    className="w-full h-full p-2 bg-surface-overlay border border-border-subtle rounded text-center text-text-primary appearance-none"
                  >
                    {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
             </div>

             <div className="space-y-0 divide-y divide-border-subtle">
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">Motor kW</div>
                 <div className="text-center font-display tabular-nums text-text-primary">—</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.motorKw}</div>
               </div>
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">Battery kWh</div>
                 <div className="text-center font-display tabular-nums text-text-primary">—</div>
                 <div className="text-center font-display tabular-nums text-text-primary">{comparatorVehicle.batteryKwh}</div>
               </div>
               <div className="grid grid-cols-3 py-2 text-body">
                 <div className="text-text-secondary">100km Cost</div>
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
           <h2 className="text-h3 text-text-primary font-semibold">Real TNB Bill Breakdown</h2>
           
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base">
             
             {/* Threshold Warning */}
             {(store.baselineKwh + (store.mileage / 100) * store.consumption) > 600 && store.baselineKwh <= 600 && (
               <div className="mb-4 p-3 bg-status-warning/10 border border-status-warning/20 rounded flex items-start space-x-2">
                 <Info size={16} className="text-status-warning shrink-0 mt-0.5" />
                 <p className="text-caption text-text-primary">
                   600 kWh threshold crossed. <span className="text-status-warning">AFA & 8% SST now apply to your EV charging usage.</span>
                 </p>
               </div>
             )}

             {/* Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-left text-body">
                 <thead>
                   <tr className="text-caption text-text-secondary border-b border-border-subtle">
                     <th className="font-normal py-2 pr-2">Item</th>
                     <th className="font-normal py-2 px-2 text-right">Baseline</th>
                     <th className="font-normal py-2 px-2 text-right">New</th>
                     <th className="font-normal py-2 pl-2 text-right">Delta</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle font-display tabular-nums text-text-primary">
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">Base Gen.</td>
                     <td className="py-3 px-2 text-right">{tnbBaseline.baseBill.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.baseBill.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.baseBill - tnbBaseline.baseBill).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">SST Tax (8%)</td>
                     <td className="py-3 px-2 text-right">{tnbBaseline.sst.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.sst.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.sst - tnbBaseline.sst).toFixed(2)}</td>
                   </tr>
                   <tr>
                     <td className="py-3 text-text-secondary font-body pr-2">KWTBB</td>
                     <td className="py-3 px-2 text-right">{tnbBaseline.kwtbb.toFixed(2)}</td>
                     <td className="py-3 px-2 text-right">{tnbCombined.kwtbb.toFixed(2)}</td>
                     <td className="py-3 pl-2 text-right text-brand-accent">+{(tnbCombined.kwtbb - tnbBaseline.kwtbb).toFixed(2)}</td>
                   </tr>
                 </tbody>
                 <tfoot>
                   <tr className="border-t border-border-subtle">
                     <td className="py-3 text-text-primary font-semibold font-body pr-2">Total RM</td>
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
