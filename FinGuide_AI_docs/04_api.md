# API Specification — MVP

## Authentication
`POST /api/auth/signup`
`POST /api/auth/login`
`POST /api/auth/logout`

## Income
`GET /api/incomes`
`POST /api/incomes`
`DELETE /api/incomes/:id`

## Expenses
`GET /api/expenses`
`POST /api/expenses`
`PUT /api/expenses/:id`
`DELETE /api/expenses/:id`

## Savings
`GET /api/savings-goals`
`POST /api/savings-goals`
`PUT /api/savings-goals/:id`
`DELETE /api/savings-goals/:id`

## Credit
`POST /api/credit/simulate`

## AI Advisor
`POST /api/advisor/chat`

### Advisor request
- user question
- current income summary
- expense summary
- savings goals
- credit obligations

### Advisor response
- answer
- options
- reasoning
- risks
- suggested next step

## Security
- API keys must never be exposed in frontend code.
- User data must be scoped by authenticated user ID.
- AI requests should not expose unnecessary personal data.
