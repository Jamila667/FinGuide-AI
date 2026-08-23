# Financial Calculation Formulas

## Savings Goal
Remaining amount:

Target - Current Savings

Estimated months:

ceil(Remaining / Monthly Contribution)

If monthly contribution is 0, the system should not claim that the goal has a completion date.

## Credit Simulator
For a standard amortizing loan:

M = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
- P = principal
- r = monthly interest rate = annual rate / 12 / 100
- n = number of monthly payments
- M = monthly payment

Total repayment:

M × n

Total interest:

Total repayment - P

The UI should label these as estimates because actual lender fees, insurance, taxes, commissions, or different repayment methods may change the result.
