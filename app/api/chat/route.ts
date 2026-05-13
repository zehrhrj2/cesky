import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  system: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "⚠️ GROQ_API_KEY není nastaven.\n(GROQ_API_KEY не встановлено. Додайте ключ у .env.local)",
      },
      { status: 200 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, system } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array required" }, { status: 400 });
  }

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: system },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          max_tokens: 350,
          temperature: 0.75,
          stream: false,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorData);

      if (groqResponse.status === 401) {
        return NextResponse.json({
          reply: "⚠️ Neplatný API klíč.\n(Неправильний API ключ. Перевірте GROQ_API_KEY.)",
        });
      }

      return NextResponse.json({
        reply: "⚠️ Chyba serveru. Zkuste to znovu.\n(Помилка сервера. Спробуйте ще раз.)",
      });
    }

    const data = await groqResponse.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Promiňte, nepodařilo se odpovědět.\n(Вибачте, не вдалося відповісти.)";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply:
        "⚠️ Chyba připojení.\n(Помилка з'єднання. Перевірте інтернет-з'єднання.)",
    });
  }
}
