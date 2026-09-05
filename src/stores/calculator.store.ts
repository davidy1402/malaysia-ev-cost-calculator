import { create } from 'zustand';
import { PRESETS } from '../data/presets';

export interface CalculatorState {
  selectedPresetId: string;
  modelName: string;
  consumption: number;
  motorKw: number;
  batteryKwh: number;
  mileage: number;
  baselineKwh: number;
  petrolRm: number;
  petrolEngineCc: number;
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
  setPreset: (presetId: string) => void;
  setModelName: (name: string) => void;
  setConsumption: (c: number) => void;
  setMileage: (m: number) => void;
  setBaselineKwh: (k: number) => void;
  setPetrolRm: (p: number) => void;
  setPetrolEngineCc: (cc: number) => void;
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
  selectedPresetId: 'emas7',
  modelName: 'Proton e.MAS 7',
  consumption: 14.5,
  motorKw: 160,
  batteryKwh: 49.52,
  mileage: 1477,
  baselineKwh: 501,
  petrolRm: 210,
  petrolEngineCc: 1500,
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
  setPreset: (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      set({
        selectedPresetId: preset.id,
        modelName: preset.name,
        consumption: preset.consumption,
        motorKw: preset.motorKw,
        batteryKwh: preset.batteryKwh
      });
    }
  },
  setModelName: (name) => set({ modelName: name }),
  setConsumption: (c) => set({ consumption: c }),
  setMileage: (m) => set({ mileage: m }),
  setBaselineKwh: (k) => set({ baselineKwh: k }),
  setPetrolRm: (p) => set({ petrolRm: p }),
  setPetrolEngineCc: (cc) => set({ petrolEngineCc: cc }),
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
