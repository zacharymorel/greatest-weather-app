import { create } from 'zustand';
import {
  IGooglePlacesPredictions,
  IGooglePlacesPrediction,
} from '@/types/client/index';

interface ISearchHistory {
  historicalSearches: IGooglePlacesPredictions;
  add: (p: IGooglePlacesPrediction) => void;
  remove: (pid: string) => void;
}

export const useSearchStore = create<ISearchHistory>()((set) => ({
  historicalSearches: [],
  add: (p: IGooglePlacesPrediction) =>
    set((state) => ({
      historicalSearches: [...state.historicalSearches, p],
    })),
  remove: (pid: string) =>
    set((state) => ({
      historicalSearches: [...state.historicalSearches].filter(
        (s) => s.placeId !== pid
      ),
    })),
}));
