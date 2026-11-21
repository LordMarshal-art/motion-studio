import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GraphicKind, MotionStyle } from "@/types/motion";

const RequestSchema = z.object({
  prompt: z.string().trim().min(2, "Please describe the graphic you want.").max(800),
});

interface GeneratedSpecPayload {
  kind: GraphicKind;
  headline: string;
  subtext: string;
  accentColor: string;
  textColor: string;
  background: "transparent" | "dark" | "gradient";
  fontSize: number;
  durationSec: number;
  motionStyle: MotionStyle;
  source: "ai-provider" | "local-parser";
}

function parsePromptLocally(prompt: string): GeneratedSpecPayload {
  const lower = prompt.toLowerCase();

  let kind: GraphicKind = "title";
  if (lower.includes("lower third") || lower.includes("speaker") || lower.includes("name tag")) {
    kind = "lower_third";
  } else if (lower.includes("subscribe") || lower.includes("bell") || lower.includes("cta")) {
    kind = "subscribe";
  } else if (lower.includes("stat") || lower.includes("%") || lower.includes("metric") || lower.includes("number")) {
    kind = "stat";
  } else if (lower.includes("quote")) {
    kind = "quote";
  } else if (lower.includes("bullet") || lower.includes("list") || lower.includes("steps")) {
    kind = "bullets";
  } else if (lower.includes("chart") || lower.includes("graph") || lower.includes("bar")) {
    kind = "bar_chart";
  } else if (lower.includes("callout") || lower.includes("label")) {
    kind = "callout";
  }

  const quotedMatch = prompt.match(/["“']([^"”'\n]{1,120})["”']/);
  const saysMatch = prompt.match(/\b(?:says|saying|reads?|titled?|headline)\s+([^.,!?\n]{2,90})/i);

  const rawHeadline =
    quotedMatch?.[1] ?? saysMatch?.[1] ?? prompt.split(/[.!?\n]/)[0].slice(0, 64);
  const headline =
    kind === "quote" || kind === "bullets" ? rawHeadline.trim() : rawHeadline.trim().toUpperCase();

  let accentColor = "#EAB308";
  if (lower.includes("electric blue") || lower.includes("blue") || lower.includes("cyan")) {
    accentColor = "#38BDF8";
  } else if (lower.includes("gold") || lower.includes("metallic")) {
    accentColor = "#EAB308";
  } else if (lower.includes("emerald") || lower.includes("green")) {
    accentColor = "#34D399";
  } else if (lower.includes("red") || lower.includes("crimson")) {
    accentColor = "#F87171";
  }

  let background: "transparent" | "dark" | "gradient" = "dark";
  if (lower.includes("transparent") || lower.includes("overlay") || lower.includes("alpha")) {
    background = "transparent";
  } else if (lower.includes("gradient")) {
    background = "gradient";
  }

  let motionStyle: MotionStyle = "rise";
  if (lower.includes("wipe") || lower.includes("slide")) {
    motionStyle = "wipe";
  } else if (lower.includes("zoom") || lower.includes("scale") || lower.includes("pop")) {
    motionStyle = "scale";
  } else if (lower.includes("static") || lower.includes("no animation")) {
    motionStyle = "none";
  }

  return {
    kind,
    headline,
    subtext: "LORDMARSHAL MOTION STUDIO",
    accentColor,
    textColor: "#F8FAFC",
    background,
    fontSize: kind === "stat" ? 88 : 74,
    durationSec: 4,
    motionStyle,
    source: "local-parser",
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid prompt payload." },
        { status: 400 }
      );
    }

    const { prompt } = parsed.data;
    const apiKey = process.env.AI_PROVIDER_API_KEY;
    const baseUrl = process.env.AI_PROVIDER_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_PROVIDER_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json(parsePromptLocally(prompt));
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You convert motion-graphics prompts into JSON with keys: kind ("title"|"lower_third"|"stat"|"subscribe"|"quote"|"bullets"|"bar_chart"|"callout"), headline (string), subtext (string), accentColor (hex string), textColor (hex string), background ("transparent"|"dark"|"gradient"), fontSize (number 24-120), durationSec (number 2-10), motionStyle ("rise"|"scale"|"wipe"|"none"). Return valid JSON only.',
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(parsePromptLocally(prompt));
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(parsePromptLocally(prompt));
    }

    const aiJson = JSON.parse(content);
    const fallback = parsePromptLocally(prompt);

    const result: GeneratedSpecPayload = {
      kind: aiJson.kind || fallback.kind,
      headline:
        typeof aiJson.headline === "string" && aiJson.headline.trim()
          ? aiJson.headline.trim()
          : fallback.headline,
      subtext: typeof aiJson.subtext === "string" ? aiJson.subtext.trim() : fallback.subtext,
      accentColor: /^#[0-9A-Fa-f]{6}$/.test(aiJson.accentColor || "")
        ? aiJson.accentColor
        : fallback.accentColor,
      textColor: /^#[0-9A-Fa-f]{6}$/.test(aiJson.textColor || "")
        ? aiJson.textColor
        : fallback.textColor,
      background:
        aiJson.background === "transparent" ||
        aiJson.background === "dark" ||
        aiJson.background === "gradient"
          ? aiJson.background
          : fallback.background,
      fontSize:
        typeof aiJson.fontSize === "number" && aiJson.fontSize >= 24 && aiJson.fontSize <= 120
          ? Math.round(aiJson.fontSize)
          : fallback.fontSize,
      durationSec:
        typeof aiJson.durationSec === "number" &&
        aiJson.durationSec >= 2 &&
        aiJson.durationSec <= 10
          ? Number(aiJson.durationSec.toFixed(1))
          : fallback.durationSec,
      motionStyle:
        aiJson.motionStyle === "rise" ||
        aiJson.motionStyle === "scale" ||
        aiJson.motionStyle === "wipe" ||
        aiJson.motionStyle === "none"
          ? aiJson.motionStyle
          : fallback.motionStyle,
      source: "ai-provider",
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to process graphic generation request." },
      { status: 500 }
    );
  }
}
