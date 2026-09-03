import { create } from 'zustand';

interface ResultsState {
  selectedComparatorId: string;
  setSelectedComparatorId: (id: string) => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  selectedComparatorId: 'proton-emas7',
  setSelectedComparatorId: (id) => set({ selectedComparatorId: id }),
}));
