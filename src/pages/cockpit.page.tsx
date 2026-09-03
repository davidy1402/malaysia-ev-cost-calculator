import { useState } from 'react';
import { Settings, ChevronRight, Moon, Sun } from 'lucide-react';
import { useCalculatorStore } from '../stores/calculator.store';
import { PRESETS } from '../data/presets';
import { AdvancedDrawer } from '../components/advanced-drawer';
import { evCalcTranslations } from '../i18n/evCalcTranslations';

export default function CockpitPage({ onCalculate = () => {} }: { onCalculate?: () => void }) {
  const {
    consumption, setConsumption,
    mileage, setMileage,
    baselineKwh, setBaselineKwh,
    petrolRm, setPetrolRm,
    language, setLanguage,
    theme, setTheme
  } = useCalculatorStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [homeDisplayMode, setHomeDisplayMode] = useState<'kwh' | 'rm'>('kwh');

  const txt = evCalcTranslations[language] || evCalcTranslations.en;

  return (
    <div className="relative min-h-screen bg-background-default antialiased pb-[calc(100px+env(safe-area-inset-bottom))]">
      <div className="absolute inset-0 z-0 bg-background-default" />
      
      <main className="relative z-10 pt-[env(safe-area-inset-top)] px-base space-y-section-y">
        
        {/* Header */}
        <header className="flex justify-between items-center py-base">
          <h1 className="text-h2 font-display text-text-primary tracking-tight">{txt.appTitle}</h1>
          <div className="flex space-x-3">
             <button
               onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
               className="px-2.5 py-1 text-caption border border-border-subtle rounded text-text-secondary hover:text-text-primary hover:border-brand-primary active:scale-95 transition-colors font-medium"
             >
               {txt.langToggle}
             </button>
             <button
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               className="p-1 text-text-secondary hover:text-text-primary active:scale-95 transition-colors"
               aria-label="Toggle theme"
             >
               {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
             </button>
          </div>
        </header>

        {/* Vehicle Selection */}
        <section className="space-y-stack-md">
          <h2 className="text-body-lg text-text-primary font-semibold">{txt.evJourneyTitle}</h2>
          
          <div className="bg-surface-base border border-border-subtle rounded-xl p-base space-y-stack-md">
            <div className="flex justify-between items-center">
              <span className="text-body text-text-secondary">{txt.consumptionLabel}</span>
            </div>
            
            <div className="flex justify-center items-center space-x-loose">
               <button 
                  onClick={() => setConsumption(Math.max(5, consumption - 0.5))}
                  className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-primary active:bg-surface-overlay"
               >
                 -
               </button>
               <div className="text-h1 font-display text-text-primary w-24 text-center tabular-nums">{consumption.toFixed(1)}</div>
               <button 
                  onClick={() => setConsumption(Math.min(30, consumption + 0.5))}
                  className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-primary active:bg-surface-overlay"
               >
                 +
               </button>
            </div>

            {/* Presets Carousel */}
            <div className="flex overflow-x-auto space-x-tight pb-2 -mx-base px-base snap-x hide-scrollbar">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setConsumption(p.consumption)}
                  className={`shrink-0 snap-start px-snug py-tight rounded-md border text-caption whitespace-nowrap transition-colors ${consumption === p.consumption ? 'bg-brand-primary text-text-inverse border-brand-primary font-semibold' : 'bg-surface-overlay border-border-subtle text-text-secondary'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-stack-md">
           
           <div className="bg-surface-base border border-border-subtle rounded-xl p-base flex justify-between items-center">
             <div>
               <div className="text-caption text-text-secondary">{txt.monthlyMileageTitle}</div>
               <div className="flex items-center space-x-2 mt-1">
                 <input 
                   type="number" 
                   value={mileage}
                   onChange={e => setMileage(Number(e.target.value))}
                   className="bg-transparent text-h3 font-display tabular-nums text-text-primary w-20 outline-none"
                 />
                 <span className="text-body text-text-secondary">{txt.mileageUnit}</span>
               </div>
             </div>
             <div className="flex space-x-2">
                {[800, 1200, 1500, 2000].map(m => (
                  <button key={m} onClick={() => setMileage(m)} className="px-2 py-1 text-caption bg-surface-overlay border border-border-subtle rounded text-text-secondary">
                    {m}
                  </button>
                ))}
             </div>
           </div>

           <div className="bg-surface-base border border-border-subtle rounded-xl p-base flex justify-between items-center">
             <div>
               <div className="text-caption text-text-secondary">{txt.homeElectricityTitle}</div>
               <div className="flex items-center space-x-2 mt-1">
                 <input 
                   type="number" 
                   value={baselineKwh}
                   onChange={e => setBaselineKwh(Number(e.target.value))}
                   className="bg-transparent text-h3 font-display tabular-nums text-text-primary w-20 outline-none"
                 />
                 <span className="text-body text-text-secondary">{txt.kwhUnit}</span>
               </div>
             </div>
             <button
                onClick={() => setHomeDisplayMode(homeDisplayMode === 'kwh' ? 'rm' : 'kwh')}
                className="px-3 py-1 text-caption bg-surface-overlay border border-border-subtle rounded text-text-secondary flex items-center hover:text-text-primary active:scale-95 transition-colors"
              >
                {homeDisplayMode === 'kwh' ? 'kWh ↔ RM' : 'RM ↔ kWh'}
              </button>
           </div>

           <div className="bg-surface-base border border-border-subtle rounded-xl p-base flex justify-between items-center">
             <div>
               <div className="text-caption text-text-secondary">{txt.monthlyPetrolTitle}</div>
               <div className="flex items-center space-x-2 mt-1">
                 <span className="text-body text-text-secondary">{txt.currencyUnit}</span>
                 <input 
                   type="number" 
                   value={petrolRm}
                   onChange={e => setPetrolRm(Number(e.target.value))}
                   className="bg-transparent text-h3 font-display tabular-nums text-text-primary w-20 outline-none"
                 />
               </div>
             </div>
           </div>

        </section>

      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-default/80 backdrop-blur-md border-t border-border-subtle p-base pb-[calc(16px+env(safe-area-inset-bottom))] flex justify-between items-center space-x-base">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-3 bg-surface-overlay border border-border-subtle rounded-lg text-text-primary active:scale-[0.98] hover:border-brand-primary transition-colors"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={onCalculate}
          className="flex-1 bg-brand-primary text-text-inverse font-body font-semibold rounded-lg px-comfortable py-3 flex justify-center items-center space-x-2 active:scale-[0.98] shadow-md hover:opacity-95 transition-opacity"
        >
          <span>{txt.calculateBtn}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <AdvancedDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
