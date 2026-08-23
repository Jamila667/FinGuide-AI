import { describe, it, expect, vi } from 'vitest';
import * as actions from '../app/dashboard/actions';
import { prisma } from '../lib/prisma';

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({
    user: { id: 'test-user-id', email: 'test@example.com' }
  }))
}));

// Mock Next/Cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    income: {
      create: vi.fn().mockResolvedValue({ id: 'income-1', amount: 1000 }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 })
    },
    expense: {
      create: vi.fn().mockResolvedValue({ id: 'expense-1', amount: 500 }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 })
    }
  }
}));

describe('API Actions (Dashboard)', () => {
  it('addIncome should create an income record', async () => {
    const formData = new FormData();
    formData.append('amount', '500000');
    formData.append('month', 'Yanvar');
    
    await actions.addIncome(formData);
    
    expect(prisma.income.create).toHaveBeenCalledWith({
      data: {
        userId: 'test-user-id',
        amount: 500000,
        month: 'Yanvar',
        currency: 'UZS',
      }
    });
  });

  it('deleteIncome should delete an income record', async () => {
    await actions.deleteIncome('income-1');
    
    expect(prisma.income.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 'income-1',
        userId: 'test-user-id'
      }
    });
  });

  it('addExpense should create an expense record', async () => {
    const formData = new FormData();
    formData.append('amount', '200000');
    formData.append('category', 'Oziq-ovqat');
    formData.append('description', 'Bozor');
    formData.append('date', '2026-08-23');
    
    await actions.addExpense(formData);
    
    expect(prisma.expense.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'test-user-id',
        amount: 200000,
        category: 'Oziq-ovqat',
        description: 'Bozor',
        currency: 'UZS',
      })
    }));
  });
});
