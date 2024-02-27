import { create } from 'zustand';
import {
  IGooglePlacesPredictions,
  IGooglePlacesPrediction,
} from '@/types/client/index';

interface ISearchHistory {
  historicalSearches: IGooglePlacesPredictions;
  add: (p: IGooglePlacesPrediction) => void;
}

export const useSearchStore = create<ISearchHistory>()((set) => ({
  historicalSearches: [],
  add: (p: IGooglePlacesPrediction) =>
    set((state) => ({
      historicalSearches: [...state.historicalSearches, p],
    })),
}));
