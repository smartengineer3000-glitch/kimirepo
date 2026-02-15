import { useMemo } from 'react';
import { Heirs, Estate } from '@/entities/inheritance/types';

interface Suggestion {
  type: 'warning' | 'optimization' | 'fiqh';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: () => void;
}

export function useOptimizationSuggestions(
  heirs: Heirs, 
  estate: Estate
): Suggestion[] {
  return useMemo(() => {
    const suggestions: Suggestion[] = [];
    
    // Detect potential Wasiyya optimization
    if (estate.total > 1000000 && estate.will === 0) {
      suggestions.push({
        type: 'optimization',
        priority: 'medium',
        title: 'فرصة للوصية',
        description: 'يمكنك توجيه وصية بحدود الثلث لأعمال خيرية',
        action: () => { /* Open wasiyya dialog */ }
      });
    }
    
    // Detect missing heirs that could block others
    if (heirs.father > 0 && heirs.grandfather > 0) {
      suggestions.push({
        type: 'fiqh',
        priority: 'high',
        title: 'تنبيه الحجب',
        description: 'الجد محجوب بالأب - يمكن إزالة الجد من الحساب',
      });
    }
    
    // Detect Awl scenario before calculation
    const estimatedShares = estimateShares(heirs);
    if (estimatedShares > 1) {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        title: 'توقع العول',
        description: `المسألة متوقعة للعول من ${estimatedShares}`,
      });
    }
    
    return suggestions;
  }, [heirs, estate]);
}
