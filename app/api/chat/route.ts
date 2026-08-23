import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const { messages } = await req.json() as { messages: Array<{ role: string; content: string }> };

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Bad request: messages required", { status: 400 });
  }

  // Save user's new message to DB
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user" && typeof lastMessage.content === "string") {
    await prisma.advisorMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: lastMessage.content,
      },
    });
  }

  // System prompt to guide the AI
  const systemPrompt = `Siz FinGuide AI — foydalanuvchi uchun ekspert moliyaviy maslahatchisiz.
Vazifangiz: foydali, xushmuomala va amaliy moliyaviy maslahatlar berish.
Qisqa, ammo to'liq javob bering. Byudjetlash, tejash va aqlli xarajatlar bo'yicha fokus qiling.
Foydalanuvchi o'zbek tilida yozsa, o'zbek tilida javob bering. Rus tilida yozsa, rus tilida javob bering.`;

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    onFinish: async ({ text }) => {
      if (text) {
        try {
          await prisma.advisorMessage.create({
            data: {
              userId: user.id,
              role: "assistant",
              content: text,
            },
          });
        } catch (error) {
          console.error("Failed to save assistant message:", error);
        }
      }
    },
  });

  return result.toTextStreamResponse();
}
