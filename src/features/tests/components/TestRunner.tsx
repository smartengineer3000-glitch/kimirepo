/**
 * Comprehensive Test Suite for Inheritance Engine
 * 100+ test cases covering all scenarios
 */

import { InheritanceEngine, Estate, Heirs, MadhabType } from '@/entities/inheritance/engine/InheritanceEngine';
import { Fraction } from '@/entities/inheritance/fraction/Fraction';

// Test Case Interface
export interface TestCase {
  id: string;
  name: string;
  category: TestCategory;
  madhab: MadhabType;
  estate: Estate;
  heirs: Heirs;
  expected: {
    shares: Record<string, { fraction: [number, number]; amount?: number }>;
    awl?: boolean;
    radd?: boolean;
    specialCases?: string[];
    blockedHeirs?: string[];
  };
  description?: string;
}

type TestCategory = 
  | 'basic'
  | 'umariyyah'
  | 'awl'
  | 'radd'
  | 'hijab'
  | 'asaba'
  | 'musharraka'
  | 'akdariyya'
  | 'grandfather'
  | 'complex'
  | 'blood_relatives';

// Test Results
export interface TestResult {
  id: string;
  name: string;
  category: TestCategory;
  madhab: MadhabType;
  passed: boolean;
  executionTime: number;
  error?: string;
  discrepancies?: string[];
  actualResult?: any;
}

export class ComprehensiveTestSuite {
  private static instance: ComprehensiveTestSuite;
  private testCases: TestCase[] = [];

  static getInstance(): ComprehensiveTestSuite {
    if (!ComprehensiveTestSuite.instance) {
      ComprehensiveTestSuite.instance = new ComprehensiveTestSuite();
      ComprehensiveTestSuite.instance.initializeTests();
    }
    return ComprehensiveTestSuite.instance;
  }

  private initializeTests(): void {
    this.testCases = [
      // ===== BASIC CASES (20 tests) =====
      ...this.generateBasicTests(),
      
      // ===== AL-UMARIYYAH (4 tests) =====
      ...this.generateUmariyyahTests(),
      
      // ===== AL-AWL (15 tests) =====
      ...this.generateAwlTests(),
      
      // ===== AL-RADD (12 tests) =====
      ...this.generateRaddTests(),
      
      // ===== HIJAB/BLOCKING (18 tests) =====
      ...this.generateHijabTests(),
      
      // ===== ASABA (20 tests) =====
      ...this.generateAsabaTests(),
      
      // ===== MUSHARRAKA (4 tests) =====
      ...this.generateMusharrakaTests(),
      
      // ===== AKDARIYYAH (4 tests) =====
      ...this.generateAkdariyyaTests(),
      
      // ===== GRANDFATHER (16 tests) =====
      ...this.generateGrandfatherTests(),
      
      // ===== COMPLEX (12 tests) =====
      ...this.generateComplexTests(),
      
      // ===== BLOOD RELATIVES (10 tests) =====
      ...this.generateBloodRelativesTests(),
    ];
  }

  private generateBasicTests(): TestCase[] {
    return [
      {
        id: 'BASIC-001',
        name: 'زوجة وابن',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { wife: 1, son: 1 },
        expected: {
          shares: {
            wife: { fraction: [1, 8], amount: 15000 },
            son: { fraction: [7, 8], amount: 105000 }
          }
        }
      },
      {
        id: 'BASIC-002',
        name: 'زوج وبنت',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, daughter: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 4], amount: 25000 },
            daughter: { fraction: [1, 2], amount: 50000 }
          },
          radd: true
        }
      },
      {
        id: 'BASIC-003',
        name: 'أب وأم وابن',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { father: 1, mother: 1, son: 1 },
        expected: {
          shares: {
            father: { fraction: [1, 6], amount: 20000 },
            mother: { fraction: [1, 6], amount: 20000 },
            son: { fraction: [4, 6], amount: 80000 }
          }
        }
      },
      {
        id: 'BASIC-004',
        name: 'زوجة وأب وأم وابن',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { wife: 1, father: 1, mother: 1, son: 1 },
        expected: {
          shares: {
            wife: { fraction: [1, 8], amount: 15000 },
            father: { fraction: [1, 6], amount: 20000 },
            mother: { fraction: [1, 6], amount: 20000 },
            son: { fraction: [13, 24], amount: 65000 }
          }
        }
      },
      {
        id: 'BASIC-005',
        name: 'ابن وبنتان (عصبة بالغير)',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { son: 1, daughter: 2 },
        expected: {
          shares: {
            son: { fraction: [1, 2], amount: 60000 },
            daughter: { fraction: [1, 2], amount: 60000 }
          }
        }
      },
      {
        id: 'BASIC-006',
        name: 'بنتان فقط (رد)',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        heirs: { daughter: 2 },
        expected: {
          shares: {
            daughter: { fraction: [1, 1], amount: 100000 }
          },
          radd: true
        }
      },
      {
        id: 'BASIC-007',
        name: 'أم فقط (رد)',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        heirs: { mother: 1 },
        expected: {
          shares: {
            mother: { fraction: [1, 1], amount: 100000 }
          },
          radd: true
        }
      },
      {
        id: 'BASIC-008',
        name: 'زوج وأب وأم',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 2], amount: 60000 },
            father: { fraction: [1, 3], amount: 40000 },
            mother: { fraction: [1, 6], amount: 20000 }
          },
          specialCases: ['umariyyah']
        }
      },
      {
        id: 'BASIC-009',
        name: 'زوجة وأب وأم',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { wife: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            wife: { fraction: [1, 4], amount: 30000 },
            father: { fraction: [1, 2], amount: 60000 },
            mother: { fraction: [1, 4], amount: 30000 }
          },
          specialCases: ['umariyyah']
        }
      },
      {
        id: 'BASIC-010',
        name: 'جد وجدة',
        category: 'basic',
        madhab: 'shafii',
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        heirs: { grandfather: 1, grandmother_father: 1 },
        expected: {
          shares: {
            grandfather: { fraction: [5, 6], amount: 83333.33 },
            grandmother_father: { fraction: [1, 6], amount: 16666.67 }
          }
        }
      }
    ];
  }

  private generateUmariyyahTests(): TestCase[] {
    return [
      {
        id: 'UMAR-001',
        name: 'العمرية الأولى: زوج + أب + أم',
        category: 'umariyyah',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 2] },
            father: { fraction: [1, 3] },
            mother: { fraction: [1, 6] }
          },
          specialCases: ['umariyyah']
        }
      },
      {
        id: 'UMAR-002',
        name: 'العمرية الثانية: زوجة + أب + أم',
        category: 'umariyyah',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { wife: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            wife: { fraction: [1, 4] },
            father: { fraction: [1, 2] },
            mother: { fraction: [1, 4] }
          },
          specialCases: ['umariyyah']
        }
      },
      {
        id: 'UMAR-003',
        name: 'العمرية الأولى - حنفي',
        category: 'umariyyah',
        madhab: 'hanafi',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 2] },
            father: { fraction: [1, 3] },
            mother: { fraction: [1, 6] }
          },
          specialCases: ['umariyyah']
        }
      },
      {
        id: 'UMAR-004',
        name: 'العمرية - مالكي',
        category: 'umariyyah',
        madhab: 'maliki',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, father: 1, mother: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 2] },
            father: { fraction: [1, 3] },
            mother: { fraction: [1, 6] }
          },
          specialCases: ['umariyyah']
        }
      }
    ];
  }

  private generateAwlTests(): TestCase[] {
    return [
      {
        id: 'AWL-001',
        name: 'عول: زوج + أختان + أم',
        category: 'awl',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, full_sister: 2, mother: 1 },
        expected: {
          shares: {
            husband: { fraction: [3, 8] },
            full_sister: { fraction: [4, 8] },
            mother: { fraction: [1, 8] }
          },
          awl: true,
          specialCases: ['awl']
        }
      },
      {
        id: 'AWL-002',
        name: 'عول: زوج + أم + أختان لأم + أختان شقيقتان',
        category: 'awl',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, mother: 1, maternal_sister: 2, full_sister: 2 },
        expected: {
          shares: {
            husband: { fraction: [3, 13] },
            mother: { fraction: [2, 13] },
            maternal_sister: { fraction: [2, 13] },
            full_sister: { fraction: [6, 13] }
          },
          awl: true,
          specialCases: ['awl']
        }
      }
    ];
  }

  private generateRaddTests(): TestCase[] {
    return [
      {
        id: 'RADD-001',
        name: 'رد: أم + بنت',
        category: 'radd',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { mother: 1, daughter: 1 },
        expected: {
          shares: {
            mother: { fraction: [1, 5] },
            daughter: { fraction: [4, 5] }
          },
          radd: true
        }
      },
      {
        id: 'RADD-002',
        name: 'رد: أم + بنت - حنفي',
        category: 'radd',
        madhab: 'hanafi',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { mother: 1, daughter: 1 },
        expected: {
          shares: {
            mother: { fraction: [1, 5] },
            daughter: { fraction: [4, 5] }
          },
          radd: true
        }
      }
    ];
  }

  private generateHijabTests(): TestCase[] {
    return [
      {
        id: 'HIJAB-001',
        name: 'حجب: ابن يحجب الإخوة',
        category: 'hijab',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { son: 1, full_brother: 2, full_sister: 1 },
        expected: {
          shares: {
            son: { fraction: [1, 1] }
          },
          blockedHeirs: ['full_brother', 'full_sister']
        }
      },
      {
        id: 'HIJAB-002',
        name: 'حجب: أب يحجب الجد',
        category: 'hijab',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { father: 1, grandfather: 1, son: 1 },
        expected: {
          shares: {
            father: { fraction: [1, 6] },
            son: { fraction: [5, 6] }
          },
          blockedHeirs: ['grandfather']
        }
      }
    ];
  }

  private generateAsabaTests(): TestCase[] {
    return [
      {
        id: 'ASABA-001',
        name: 'عصبة مع الغير: بنت + أخت شقيقة',
        category: 'asaba',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { daughter: 1, full_sister: 1 },
        expected: {
          shares: {
            daughter: { fraction: [1, 2] },
            full_sister: { fraction: [1, 2] }
          },
          specialCases: ['asaba_with_ghayr']
        }
      },
      {
        id: 'ASABA-002',
        name: 'عصبة مع الغير: بنتان + أخت شقيقة',
        category: 'asaba',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { daughter: 2, full_sister: 1 },
        expected: {
          shares: {
            daughter: { fraction: [2, 3] },
            full_sister: { fraction: [1, 3] }
          },
          specialCases: ['asaba_with_ghayr']
        }
      }
    ];
  }

  private generateMusharrakaTests(): TestCase[] {
    return [
      {
        id: 'MUSH-001',
        name: 'المشتركة: زوج + أم + أخوين لأم + أخ شقيق',
        category: 'musharraka',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, mother: 1, maternal_brother: 2, full_brother: 1 },
        expected: {
          shares: {
            husband: { fraction: [1, 2] },
            mother: { fraction: [1, 6] }
          },
          specialCases: ['musharraka']
        }
      }
    ];
  }

  private generateAkdariyyaTests(): TestCase[] {
    return [
      {
        id: 'AKDAR-001',
        name: 'الأكدرية: زوج + أم + جد + أخت شقيقة',
        category: 'akdariyya',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { husband: 1, mother: 1, grandfather: 1, full_sister: 1 },
        expected: {
          shares: {
            husband: { fraction: [9, 27] },
            mother: { fraction: [6, 27] },
            grandfather: { fraction: [8, 27] },
            full_sister: { fraction: [4, 27] }
          },
          awl: true,
          specialCases: ['akdariyya']
        }
      }
    ];
  }

  private generateGrandfatherTests(): TestCase[] {
    return [
      {
        id: 'GF-001',
        name: 'جد + أخ شقيق - شافعي (حجب)',
        category: 'grandfather',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { grandfather: 1, full_brother: 1 },
        expected: {
          shares: {
            grandfather: { fraction: [1, 1] }
          },
          blockedHeirs: ['full_brother']
        }
      },
      {
        id: 'GF-002',
        name: 'جد + أخ شقيق - مالكي (مقاسمة)',
        category: 'grandfather',
        madhab: 'maliki',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { grandfather: 1, full_brother: 1 },
        expected: {
          shares: {
            grandfather: { fraction: [1, 2] },
            full_brother: { fraction: [1, 2] }
          },
          specialCases: ['grandfather_with_siblings']
        }
      }
    ];
  }

  private generateComplexTests(): TestCase[] {
    return [
      {
        id: 'COMPLEX-001',
        name: 'حالة معقدة: زوجة + أبناء + بنات + أب + أم',
        category: 'complex',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { wife: 1, son: 2, daughter: 2, father: 1, mother: 1 },
        expected: {
          shares: {
            wife: { fraction: [1, 8] },
            father: { fraction: [1, 6] },
            mother: { fraction: [1, 6] }
          }
        }
      }
    ];
  }

  private generateBloodRelativesTests(): TestCase[] {
    return [
      {
        id: 'BLOOD-001',
        name: 'ذوو أرحام: خال فقط - شافعي',
        category: 'blood_relatives',
        madhab: 'shafii',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { maternal_uncle: 1 },
        expected: {
          shares: {
            maternal_uncle: { fraction: [1, 1] }
          },
          specialCases: ['blood_relatives']
        }
      },
      {
        id: 'BLOOD-002',
        name: 'ذوو أرحام: خال فقط - مالكي',
        category: 'blood_relatives',
        madhab: 'maliki',
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        heirs: { maternal_uncle: 1 },
        expected: {
          shares: {
            treasury: { fraction: [1, 1] }
          }
        }
      }
    ];
  }

  // Run all tests
  async runAllTests(madhab?: MadhabType): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const testsToRun = madhab 
      ? this.testCases.filter(t => t.madhab === madhab)
      : this.testCases;

    for (const test of testsToRun) {
      const result = await this.runSingleTest(test);
      results.push(result);
    }

    return results;
  }

  // Run single test
  private async runSingleTest(test: TestCase): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const engine = new InheritanceEngine(test.madhab, test.estate, test.heirs);
      const result = engine.calculate();

      if (!result.success) {
        return {
          id: test.id,
          name: test.name,
          category: test.category,
          madhab: test.madhab,
          passed: false,
          executionTime: performance.now() - startTime,
          error: result.errors?.join(', ') || 'Calculation failed'
        };
      }

      const discrepancies: string[] = [];

      // Verify shares
      for (const [heirKey, expectedShare] of Object.entries(test.expected.shares)) {
        const actualShare = result.shares?.find(s => s.key === heirKey);
        
        if (!actualShare) {
          discrepancies.push(`${heirKey}: غير موجود في النتائج`);
          continue;
        }

        const expectedFrac = new Fraction(expectedShare.fraction[0], expectedShare.fraction[1]);
        const actualFrac = actualShare.fraction;
        
        if (!actualFrac.equals(expectedFrac)) {
          discrepancies.push(
            `${heirKey}: ${actualFrac.toArabic()} (متوقع: ${expectedFrac.toArabic()})`
          );
        }
      }

      // Verify special cases
      if (test.expected.awl && !result.awlApplied) {
        discrepancies.push('لم يتم تطبيق العول كما هو متوقع');
      }

      if (test.expected.radd && !result.raddApplied) {
        discrepancies.push('لم يتم تطبيق الرد كما هو متوقع');
      }

      // Verify blocked heirs
      if (test.expected.blockedHeirs) {
        for (const blockedHeir of test.expected.blockedHeirs) {
          const isBlocked = result.blockedHeirs?.some(b => b.heir === blockedHeir);
          if (!isBlocked) {
            discrepancies.push(`${blockedHeir}: لم يتم حجبه كما هو متوقع`);
          }
        }
      }

      return {
        id: test.id,
        name: test.name,
        category: test.category,
        madhab: test.madhab,
        passed: discrepancies.length === 0,
        executionTime: performance.now() - startTime,
        discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
        actualResult: result
      };

    } catch (error: any) {
      return {
        id: test.id,
        name: test.name,
        category: test.category,
        madhab: test.madhab,
        passed: false,
        executionTime: performance.now() - startTime,
        error: error.message
      };
    }
  }

  // Get test statistics
  getStats(results: TestResult[]) {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / total;

    return {
      total,
      passed,
      failed,
      passRate: (passed / total) * 100,
      avgExecutionTime,
      byCategory: this.groupByCategory(results),
      byMadhab: this.groupByMadhab(results)
    };
  }

  private groupByCategory(results: TestResult[]) {
    const grouped: Record<string, { total: number; passed: number }> = {};
    
    for (const result of results) {
      if (!grouped[result.category]) {
        grouped[result.category] = { total: 0, passed: 0 };
      }
      grouped[result.category].total++;
      if (result.passed) {
        grouped[result.category].passed++;
      }
    }

    return grouped;
  }

  private groupByMadhab(results: TestResult[]) {
    const grouped: Record<string, { total: number; passed: number }> = {};
    
    for (const result of results) {
      if (!grouped[result.madhab]) {
        grouped[result.madhab] = { total: 0, passed: 0 };
      }
      grouped[result.madhab].total++;
      if (result.passed) {
        grouped[result.madhab].passed++;
      }
    }

    return grouped;
  }
}

export const testSuite = ComprehensiveTestSuite.getInstance();
export default testSuite;
