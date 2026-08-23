# Database Schema — MVP

## users
- id
- email
- created_at

## incomes
- id
- user_id
- amount
- currency
- month
- created_at

## expenses
- id
- user_id
- amount
- currency
- category
- description
- date
- created_at

## savings_goals
- id
- user_id
- name
- target_amount
- current_amount
- monthly_contribution
- currency
- created_at
- updated_at

## credit_simulations
- id
- user_id
- principal
- annual_rate
- term_months
- monthly_payment
- total_repayment
- total_interest
- created_at

## advisor_messages
- id
- user_id
- role
- content
- created_at

## Relationships
users 1 → many incomes
users 1 → many expenses
users 1 → many savings_goals
users 1 → many credit_simulations
users 1 → many advisor_messages
