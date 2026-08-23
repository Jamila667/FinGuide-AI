import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChatInterface from "./ChatInterface";

export default async function AdvisorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const dbMessages = await prisma.advisorMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  // Map DB messages to the format expected by ChatInterface
  const initialMessages = dbMessages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">AI Maslahatchi</h2>
        <p className="mt-2 text-slate-500">
          Shaxsiy moliyaviy maslahatchingiz bilan suhbatlashing. Moliyaviy rejalashtirish, xarajatlarni qisqartirish yoki investitsiya bo'yicha yordam so'rashingiz mumkin.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
        <ChatInterface initialMessages={initialMessages} />
      </div>
    </div>
  );
}
