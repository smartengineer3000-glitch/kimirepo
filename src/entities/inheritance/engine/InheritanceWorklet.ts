import { Worklets } from 'react-native-worklets-core';

export const calculateInheritanceWorklet = Worklets.createRunInContextFn(
  (madhab: MadhabType, estate: Estate, heirs: Heirs) => {
    'worklet';
    
    // Heavy calculation offloaded from UI thread
    const engine = new InheritanceEngine(madhab, estate, heirs);
    return engine.calculate();
  }
);
