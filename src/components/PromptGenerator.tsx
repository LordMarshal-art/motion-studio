"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

interface PromptGeneratorProps {
  isGenerating: boolean;
  onGenerate: (prompt: string) => Promise<void> | void;
}

const QUICK_PROMPTS = [
  {
    label: "Retention Hook",
    prompt:
      "Create a bold retention hook title saying 'STOP SCROLLING' with electric cyan accent and smooth rise.",
  },
  {
    label: "Tech Metric",
    prompt:
      "Create a metric callout saying '+340% CTR' with subtext 'THUMBNAIL TEST RESULT' and scale pop motion.",
  },
  {
    label: "Lower Third",
    prompt:
      "Create a sleek broadcast lower third saying 'LORD MARSHAL' with subtext 'CREATOR & BUILDER' and directional wipe.",
  },
];

export function PromptGenerator({ isGenerating, onGenerate }: PromptGeneratorProps) {
  const [prompt, setPrompt] = useState(
    'Create a cinematic title that says "THE FUTURE IS NOW" with electric cyan accent and smooth rise.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt.trim());
  };

  return (
    <section className="mt-5 rounded-2xl border border-slate-800/90 bg-[#11192c] p-4 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
            <Wand2 className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold tracking-wide text-white uppercase">
              AI Motion Coach
            </h2>
            <p className="text-[11px] text-slate-400">
              Uses <code className="text-cyan-300">/api/generate-graphic</code> with automatic structured fallback
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={isGenerating}
              onClick={() => {
                setPrompt(item.prompt);
                void onGenerate(item.prompt);
              }}
              className="rounded-full border border-slate-700/80 bg-[#0b101d] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your title, lower third, callout, colors, and motion..."
          className="flex-1 rounded-xl border border-slate-700/90 bg-[#080d1a] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Spec</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
