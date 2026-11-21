"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface PromptGeneratorProps {
  isGenerating: boolean;
  onGenerate: (prompt: string) => Promise<void>;
}

const SAMPLE_PROMPTS = [
  'Create a cinematic title that says "THE FUTURE IS NOW" with metallic gold accent and smooth rise.',
  'Create a lower third that says "COURTENEY // CREATOR LABS" with electric blue accent.',
  'Create a big statistic that says "+248%" with electric blue and dark gradient background.',
];

export function PromptGenerator({ isGenerating, onGenerate }: PromptGeneratorProps) {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-[#0D121E] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="ai-graphic-prompt"
          className="text-xs font-bold tracking-wider text-amber-400 uppercase"
        >
          AI Graphic Prompt
        </label>
        <span className="text-[11px] text-slate-400">
          Uses /api/generate-graphic (LLM when configured, local parser otherwise)
        </span>
      </div>

      <textarea
        id="ai-graphic-prompt"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your title, lower third, stat, quote, or chart..."
        className="w-full rounded-xl border border-slate-700 bg-[#07090F] p-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(sample)}
              className="rounded-md border border-slate-800 bg-[#131B2E] px-2.5 py-1 text-[11px] text-slate-300 hover:border-sky-400/50 hover:text-white"
            >
              Sample {idx + 1}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isGenerating ? "Generating..." : "Generate Graphic"}</span>
        </button>
      </div>
    </form>
  );
}
