import { create } from 'zustand';

interface ResultsState {
  selectedComparatorId: string;
  setSelectedComparatorId: (id: string) => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  selectedComparatorId: 'atto3',
  setSelectedComparatorId: (id) => set({ selectedComparatorId: id }),
}));
