import { create } from 'zustand';

export interface CalculatorState {
  consumption: number;
  mileage: number;
  baselineKwh: number;
  petrolRm: number;
  mode: 'mixed' | 'home';
  language: 'en' | 'zh';
  theme: 'dark' | 'light';
  advanced: {
    petrolPrice: number;
    fuelEconomy: number;
    chargingLoss: number;
    publicDcRate: number;
    touEnabled: boolean;
  };
  setConsumption: (c: number) => void;
  setMileage: (m: number) => void;
  setBaselineKwh: (k: number) => void;
  setPetrolRm: (p: number) => void;
  setMode: (m: 'mixed' | 'home') => void;
  setLanguage: (l: 'en' | 'zh') => void;
  setTheme: (t: 'dark' | 'light') => void;
  updateAdvanced: (updates: Partial<CalculatorState['advanced']>) => void;
}

const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
  }
  return 'dark';
};

const getInitialLanguage = (): 'en' | 'zh' => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'en' || saved === 'zh') return saved;
    } catch {}
  }
  return 'en';
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  consumption: 14.5,
  mileage: 1477,
  baselineKwh: 501,
  petrolRm: 210,
  mode: 'mixed',
  language: getInitialLanguage(),
  theme: getInitialTheme(),
  advanced: {
    petrolPrice: 1.99,
    fuelEconomy: 14,
    chargingLoss: 0.1, // 10%
    publicDcRate: 1.4,
    touEnabled: false,
  },
  setConsumption: (c) => set({ consumption: c }),
  setMileage: (m) => set({ mileage: m }),
  setBaselineKwh: (k) => set({ baselineKwh: k }),
  setPetrolRm: (p) => set({ petrolRm: p }),
  setMode: (m) => set({ mode: m }),
  setLanguage: (l) => {
    try {
      localStorage.setItem('language', l);
    } catch {}
    set({ language: l });
  },
  setTheme: (t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
    set({ theme: t });
  },
  updateAdvanced: (updates) =>
    set((state) => ({ advanced: { ...state.advanced, ...updates } })),
}));
