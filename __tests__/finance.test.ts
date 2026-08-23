import { describe, it, expect } from 'vitest';
import { calculateCreditSimulation, calculateSavingsProgress } from '../utils/finance';

describe('Financial Formulas', () => {
  describe('calculateCreditSimulation', () => {
    it('calculates correct monthly payment for valid inputs', () => {
      // Principal: 50,000,000 UZS, Annual Rate: 24%, Term: 36 months
      const result = calculateCreditSimulation(50000000, 24, 36);
      
      // Monthly rate = 0.02
      // Formula: P * (r(1+r)^n) / ((1+r)^n - 1)
      // 50,000,000 * (0.02 * (1.02)^36) / ((1.02)^36 - 1)
      // ≈ 1,961,643.08
      expect(result.monthlyPayment).toBeCloseTo(1961642.63, 1);
      expect(result.totalRepayment).toBeCloseTo(1961642.63 * 36, 1);
      expect(result.totalInterest).toBeCloseTo((1961642.63 * 36) - 50000000, 1);
    });

    it('handles zero or negative inputs', () => {
      const result = calculateCreditSimulation(0, 24, 36);
      expect(result.monthlyPayment).toBe(0);
      expect(result.totalRepayment).toBe(0);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateSavingsProgress', () => {
    it('calculates progress and remaining months correctly', () => {
      const result = calculateSavingsProgress(1000000, 400000, 200000);
      expect(result.progressPercentage).toBe(40);
      expect(result.remaining).toBe(600000);
      expect(result.monthsLeft).toBe(3);
    });

    it('handles goal already reached', () => {
      const result = calculateSavingsProgress(1000000, 1200000, 200000);
      expect(result.progressPercentage).toBe(100);
      expect(result.remaining).toBe(0);
      expect(result.monthsLeft).toBe(0);
    });

    it('handles zero target', () => {
      const result = calculateSavingsProgress(0, 400000, 200000);
      expect(result.progressPercentage).toBe(0);
      expect(result.remaining).toBe(0);
      expect(result.monthsLeft).toBe(0);
    });
  });
});
