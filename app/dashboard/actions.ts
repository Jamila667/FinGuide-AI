"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCreditSimulation } from "@/utils/finance";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function addIncome(formData: FormData) {
  const user = await getUser();
  const amount = parseFloat(formData.get("amount") as string);
  const month = formData.get("month") as string;
  const description = formData.get("description") as string;
  if (isNaN(amount) || amount <= 0 || !month) throw new Error("Invalid input");

  await prisma.income.create({
    data: { userId: user.id, amount, month, description, currency: "UZS" },
  });
  revalidatePath("/dashboard");
}

export async function deleteIncome(id: string) {
  const user = await getUser();
  await prisma.income.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard");
}

export async function addExpense(formData: FormData) {
  const user = await getUser();
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  
  if (isNaN(amount) || amount <= 0 || !category) throw new Error("Invalid input");
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) throw new Error("Invalid date");

  await prisma.expense.create({
    data: { userId: user.id, amount, category, description, date, currency: "UZS" },
  });
  revalidatePath("/dashboard");
}

export async function deleteExpense(id: string) {
  const user = await getUser();
  await prisma.expense.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard");
}

export async function addSavingsGoal(formData: FormData) {
  const user = await getUser();
  const name = formData.get("name") as string;
  const targetAmount = parseFloat(formData.get("targetAmount") as string);
  const currentAmount = parseFloat(formData.get("currentAmount") as string);
  const monthlyContribution = parseFloat(formData.get("monthlyContribution") as string);

  if (!name || isNaN(targetAmount) || targetAmount <= 0 || isNaN(currentAmount) || currentAmount < 0 || isNaN(monthlyContribution) || monthlyContribution <= 0) {
    throw new Error("Invalid input");
  }

  await prisma.savingsGoal.create({
    data: { userId: user.id, name, targetAmount, currentAmount, monthlyContribution, currency: "UZS" },
  });
  revalidatePath("/dashboard/savings");
}

export async function deleteSavingsGoal(id: string) {
  const user = await getUser();
  await prisma.savingsGoal.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/savings");
}

export async function addCreditSimulation(formData: FormData) {
  const user = await getUser();
  const principal = parseFloat(formData.get("principal") as string);
  const annualRate = parseFloat(formData.get("annualRate") as string);
  const termMonths = parseInt(formData.get("termMonths") as string, 10);

  if (isNaN(principal) || principal <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(termMonths) || termMonths <= 0) {
    throw new Error("Invalid input");
  }

  const { monthlyPayment, totalRepayment, totalInterest } = calculateCreditSimulation(principal, annualRate, termMonths);

  await prisma.creditSimulation.create({
    data: { userId: user.id, principal, annualRate, termMonths, monthlyPayment, totalRepayment, totalInterest },
  });
  revalidatePath("/dashboard/credit");
}

export async function deleteCreditSimulation(id: string) {
  const user = await getUser();
  await prisma.creditSimulation.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/credit");
}

