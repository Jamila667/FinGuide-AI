"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCreditSimulation } from "@/utils/finance";

export async function addIncome(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;
  if (!user || !user.id) throw new Error("Not authenticated");

  const amount = parseFloat(formData.get("amount") as string);
  const month = formData.get("month") as string;

  await prisma.income.create({
    data: {
      userId: user.id,
      amount,
      month,
      currency: "UZS",
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteIncome(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string } | undefined;
  if (!user?.id) throw new Error("Not authenticated");

  // Only delete if it belongs to this user
  await prisma.income.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard");
}

export async function addExpense(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;
  if (!user || !user.id) throw new Error("Not authenticated");

  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.expense.create({
    data: {
      userId: user.id,
      amount,
      category,
      description,
      date,
      currency: "UZS",
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteExpense(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string } | undefined;
  if (!user?.id) throw new Error("Not authenticated");

  await prisma.expense.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard");
}

export async function addSavingsGoal(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;
  if (!user || !user.id) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const targetAmount = parseFloat(formData.get("targetAmount") as string);
  const currentAmount = parseFloat(formData.get("currentAmount") as string);
  const monthlyContribution = parseFloat(formData.get("monthlyContribution") as string);

  await prisma.savingsGoal.create({
    data: {
      userId: user.id,
      name,
      targetAmount,
      currentAmount,
      monthlyContribution,
      currency: "UZS",
    },
  });

  revalidatePath("/dashboard/savings");
}

export async function deleteSavingsGoal(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string } | undefined;
  if (!user?.id) throw new Error("Not authenticated");

  await prisma.savingsGoal.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard/savings");
}

export async function addCreditSimulation(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; email: string } | undefined;
  if (!user || !user.id) throw new Error("Not authenticated");

  const principal = parseFloat(formData.get("principal") as string);
  const annualRate = parseFloat(formData.get("annualRate") as string);
  const termMonths = parseInt(formData.get("termMonths") as string, 10);

  const { monthlyPayment, totalRepayment, totalInterest } = calculateCreditSimulation(principal, annualRate, termMonths);

  await prisma.creditSimulation.create({
    data: {
      userId: user.id,
      principal,
      annualRate,
      termMonths,
      monthlyPayment,
      totalRepayment,
      totalInterest,
    },
  });

  revalidatePath("/dashboard/credit");
}

export async function deleteCreditSimulation(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string } | undefined;
  if (!user?.id) throw new Error("Not authenticated");

  await prisma.creditSimulation.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard/credit");
}


