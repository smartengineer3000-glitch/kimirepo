import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MadhabType } from '../constants/FiqhDatabase';
import { Estate, Heirs, CalculationResult } from '../utils/InheritanceEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Audit Log Entry Interface
 */
export interface AuditLogEntry {
  id: number;
  timestamp: string;
  action: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

/**
 * Saved Calculation Interface
 */
export interface SavedCalculation {
  id: string;
  name: string;
  timestamp: string;
  madhab: MadhabType;
  estate: Estate;
  heirs: Heirs;
  result: CalculationResult;
}

/**
 * App Context Interface
 */
interface AppContextType {
  // Current madhab
  currentMadhab: MadhabType;
  setCurrentMadhab: (madhab: MadhabType) => void;

  // Estate data
  estate: Estate;
  setEstate: (estate: Estate) => void;
  updateEstateField: (field: keyof Estate, value: number) => void;

  // Heirs data
  heirs: Heirs;
  setHeirs: (heirs: Heirs) => void;
  updateHeir: (key: string, value: number) => void;
  resetHeirs: () => void;

  // Last calculation result
  lastResult: CalculationResult | null;
  setLastResult: (result: CalculationResult | null) => void;

  // Saved calculations
  savedCalculations: SavedCalculation[];
  saveCalculation: (name: string) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  loadCalculation: (id: string) => Promise<void>;

  // Audit log
  auditLog: AuditLogEntry[];
  addAuditLog: (action: string, type: AuditLogEntry['type'], message: string, details?: any) => void;
  clearAuditLog: () => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Default values
const defaultEstate: Estate = {
  total: 100000,
  funeral: 0,
  debts: 0,
  will: 0
};

const defaultHeirs: Heirs = {
  husband: 0,
  wife: 0,
  father: 0,
  mother: 0,
  grandfather: 0,
  grandmother_mother: 0,
  grandmother_father: 0,
  son: 0,
  daughter: 0,
  grandson: 0,
  granddaughter: 0,
  full_brother: 0,
  full_sister: 0,
  paternal_brother: 0,
  paternal_sister: 0,
  maternal_brother: 0,
  maternal_sister: 0,
  full_nephew: 0,
  paternal_nephew: 0,
  full_uncle: 0,
  paternal_uncle: 0,
  full_cousin: 0,
  paternal_cousin: 0,
  maternal_uncle: 0,
  maternal_aunt: 0,
  paternal_aunt: 0,
  daughter_son: 0,
  daughter_daughter: 0,
  sister_children: 0
};

// Storage keys
const STORAGE_KEYS = {
  SAVED_CALCULATIONS: '@inheritance_saved_calculations',
  AUDIT_LOG: '@inheritance_audit_log',
  DARK_MODE: '@inheritance_dark_mode',
  LAST_MADHAB: '@inheritance_last_madhab'
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider Component
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMadhab, setCurrentMadhabState] = useState<MadhabType>('shafii');
  const [estate, setEstateState] = useState<Estate>(defaultEstate);
  const [heirs, setHeirsState] = useState<Heirs>(defaultHeirs);
  const [lastResult, setLastResult] = useState<CalculationResult | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved data on mount
  React.useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const [savedCalcs, darkMode, lastMadhab] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_CALCULATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_MADHAB)
      ]);

      if (savedCalcs) {
        setSavedCalculations(JSON.parse(savedCalcs));
      }
      if (darkMode) {
        setIsDarkMode(JSON.parse(darkMode));
      }
      if (lastMadhab) {
        setCurrentMadhabState(lastMadhab as MadhabType);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const setCurrentMadhab = useCallback((madhab: MadhabType) => {
    setCurrentMadhabState(madhab);
    AsyncStorage.setItem(STORAGE_KEYS.LAST_MADHAB, madhab);
    addAuditLog('تغيير المذهب', 'info', `تم التغيير إلى المذهب ${madhab}`);
  }, []);

  const setEstate = useCallback((newEstate: Estate) => {
    setEstateState(newEstate);
  }, []);

  const updateEstateField = useCallback((field: keyof Estate, value: number) => {
    setEstateState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setHeirs = useCallback((newHeirs: Heirs) => {
    setHeirsState(newHeirs);
  }, []);

  const updateHeir = useCallback((key: string, value: number) => {
    setHeirsState(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetHeirs = useCallback(() => {
    setHeirsState(defaultHeirs);
    addAuditLog('إعادة تعيين', 'info', 'تم إعادة تعيين الورثة');
  }, []);

  const saveCalculation = useCallback(async (name: string) => {
    if (!lastResult) return;

    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      name,
      timestamp: new Date().toISOString(),
      madhab: currentMadhab,
      estate: { ...estate },
      heirs: { ...heirs },
      result: lastResult
    };

    const updated = [newCalculation, ...savedCalculations].slice(0, 50);
    setSavedCalculations(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CALCULATIONS, JSON.stringify(updated));
    addAuditLog('حفظ حساب', 'success', `تم حفظ الحساب: ${name}`);
  }, [lastResult, currentMadhab, estate, heirs, savedCalculations]);

  const deleteCalculation = useCallback(async (id: string) => {
    const updated = savedCalculations.filter(c => c.id !== id);
    setSavedCalculations(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CALCULATIONS, JSON.stringify(updated));
    addAuditLog('حذف حساب', 'info', `تم حذف الحساب: ${id}`);
  }, [savedCalculations]);

  const loadCalculation = useCallback(async (id: string) => {
    const calc = savedCalculations.find(c => c.id === id);
    if (calc) {
      setCurrentMadhabState(calc.madhab);
      setEstateState(calc.estate);
      setHeirsState(calc.heirs);
      setLastResult(calc.result);
      addAuditLog('تحميل حساب', 'info', `تم تحميل الحساب: ${calc.name}`);
    }
  }, [savedCalculations]);

  const addAuditLog = useCallback((action: string, type: AuditLogEntry['type'], message: string, details?: any) => {
    const entry: AuditLogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('ar-SA'),
      action,
      type,
      message,
      details
    };

    setAuditLog(prev => {
      const updated = [entry, ...prev].slice(0, 500);
      AsyncStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAuditLog = useCallback(() => {
    setAuditLog([]);
    AsyncStorage.removeItem(STORAGE_KEYS.AUDIT_LOG);
    addAuditLog('مسح السجل', 'warning', 'تم مسح سجل المراجعة');
  }, [addAuditLog]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const value = useMemo(() => ({
    currentMadhab,
    setCurrentMadhab,
    estate,
    setEstate,
    updateEstateField,
    heirs,
    setHeirs,
    updateHeir,
    resetHeirs,
    lastResult,
    setLastResult,
    savedCalculations,
    saveCalculation,
    deleteCalculation,
    loadCalculation,
    auditLog,
    addAuditLog,
    clearAuditLog,
    isLoading,
    setIsLoading,
    isDarkMode,
    toggleDarkMode
  }), [
    currentMadhab, estate, heirs, lastResult, savedCalculations,
    auditLog, isLoading, isDarkMode
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Use App Context Hook
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
