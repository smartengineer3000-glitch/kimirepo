import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';

interface InheritanceState {
  estate: Estate;
  heirs: Heirs;
  madhab: MadhabType;
  results: CalculationResult | null;
  history: SavedCalculation[];
  
  // Actions
  setEstate: (estate: Partial<Estate>) => void;
  updateHeir: (key: string, value: number) => void;
  calculate: () => Promise<void>;
  saveCalculation: (name: string) => Promise<void>;
  loadCalculation: (id: string) => void;
  reset: () => void;
}

export const useInheritanceStore = create<InheritanceState>()(
  immer(
    persist(
      (set, get) => ({
        estate: defaultEstate,
        heirs: defaultHeirs,
        madhab: 'shafii',
        results: null,
        history: [],
        
        setEstate: (estate) => set((state) => {
          Object.assign(state.estate, estate);
        }),
        
        calculate: async () => {
          const { madhab, estate, heirs } = get();
          
          // Offload to background thread using Worklets
          const result = await calculateInheritanceWorklet(
            madhab, 
            estate, 
            heirs
          );
          
          set((state) => {
            state.results = result;
          });
        },
        
        saveCalculation: async (name) => {
          const { results, estate, heirs, madhab, history } = get();
          if (!results) return;
          
          const newCalc: SavedCalculation = {
            id: crypto.randomUUID(),
            name,
            timestamp: new Date().toISOString(),
            madhab,
            estate: structuredClone(estate),
            heirs: structuredClone(heirs),
            result: results,
          };
          
          set((state) => {
            state.history.unshift(newCalc);
            if (state.history.length > 50) state.history.pop();
          });
          
          // Encrypt before saving
          await saveEncrypted(newCalc);
        },
      }),
      {
        name: 'inheritance-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ 
          history: state.history,
          madhab: state.madhab 
        }),
      }
    )
  )
);
