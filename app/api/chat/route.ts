import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const body = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorType = res.status === 401 || res.status === 403 ? "unavailable" : "transient";
    return NextResponse.json({ error: errorType }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
