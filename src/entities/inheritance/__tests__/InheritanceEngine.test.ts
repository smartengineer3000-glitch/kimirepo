import { InheritanceEngine } from '../engine/InheritanceEngine';

describe('InheritanceEngine', () => {
  describe('Al-Umariyyah Cases', () => {
    it('should calculate first Umariyyah correctly (Husband + Father + Mother)', () => {
      const engine = new InheritanceEngine('shafii', 
        { total: 120000, funeral: 0, debts: 0, will: 0 },
        { husband: 1, father: 1, mother: 1 }
      );
      
      const result = engine.calculate();
      
      expect(result.success).toBe(true);
      expect(result.shares).toContainEqual(
        expect.objectContaining({
          key: 'husband',
          fraction: expect.objectContaining({ num: 1, den: 2 }),
        })
      );
      expect(result.shares).toContainEqual(
        expect.objectContaining({
          key: 'mother',
          fraction: expect.objectContaining({ num: 1, den: 6 }),
        })
      );
    });
  });
  
  describe('Awl (Increase) Scenarios', () => {
    it('should apply awl when sum exceeds 1', () => {
      const engine = new InheritanceEngine('shafii',
        { total: 100000, funeral: 0, debts: 0, will: 0 },
        { husband: 1, full_sister: 2, mother: 1 }
      );
      
      const result = engine.calculate();
      
      expect(result.awlApplied).toBe(true);
      expect(result.finalBase).toBeGreaterThan(result.asl || 0);
    });
  });
});
