export function calculateCreditSimulation(principal: number, annualRate: number, termMonths: number) {
  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalRepayment: 0,
      totalInterest: 0,
    };
  }
  
  const r = annualRate / 12 / 100;
  const n = termMonths;
  const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - principal;

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest,
  };
}

export function calculateSavingsProgress(targetAmount: number, currentAmount: number, monthlyContribution: number) {
  if (targetAmount <= 0) return { progressPercentage: 0, monthsLeft: 0, remaining: 0 };
  
  const remaining = Math.max(0, targetAmount - currentAmount);
  const monthsLeft = remaining > 0 && monthlyContribution > 0
    ? Math.ceil(remaining / monthlyContribution)
    : 0;
  const progressPercentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

  return {
    progressPercentage,
    monthsLeft,
    remaining,
  };
}
