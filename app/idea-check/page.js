"use client";

import { useState } from "react";

const CATEGORIES = [
  "Retail / General Store",
  "Food & Beverage",
  "Handicrafts / Weaving",
  "Agri-processing",
  "Services (repair, tailoring, salon)",
  "Other",
];

const initialForm = {
  name: "",
  idea: "",
  category: CATEGORIES[0],
  location: "",
  budget: "",
};

export default function IdeaCheckPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    // NOTE: This is a frontend-only placeholder.
    // Replace this block with a real API call once the backend
    // and AI advisory engine are ready, e.g.:
    //   const res = await fetch("/api/evaluate-idea", { method: "POST", body: JSON.stringify(form) });
    setTimeout(() => {
      setResult({
        score: 74,
        verdict: "Promising, with a few gaps to cover",
        strengths: [
          `Steady local demand expected for "${form.category.toLowerCase()}" in your area`,
          "Low starting competition based on nearby market density",
        ],
        risks: [
          "Seasonal demand swings may affect monthly cash flow",
          "Budget entered may be tight for the first 3 months of stock",
        ],
        scheme: "Prime Minister's Employment Generation Programme (PMEGP)",
      });
      setSubmitting(false);
    }, 900);
  }

  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      
      <h1 className="text-3xl font-bold text-ink mb-2">
        Check Your Business Idea
      </h1>
      <p className="text-muted mb-10">
        Fill in a few details below. This form currently shows a mock result
        &mdash; it will call the real AI advisory engine once the backend is
        connected.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#F5F1EA] border border-[#E3D9C8] rounded-xl2 p-8 grid gap-5"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Your Name">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Radha Devi"
              className="input"
            />
          </Field>

          <Field label="Village / Block / District">
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. Barmer, Rajasthan"
              className="input"
            />
          </Field>
        </div>

        <Field label="Describe Your Business Idea">
          <textarea
            name="idea"
            value={form.idea}
            onChange={handleChange}
            required
            rows={4}
            placeholder="e.g. A small grocery store near the bus stand selling daily essentials"
            className="input resize-none"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Business Category">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Available Budget (₹)">
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 50000"
              className="input"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="justify-self-start bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          {submitting ? "Analyzing..." : "Evaluate My Idea"}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white border border-[#E3D9C8] rounded-xl2 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold">
              {result.score}
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-secondary mb-1">
                VIABILITY SCORE
              </div>
              <div className="font-bold text-ink text-lg">
                {result.verdict}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-secondary text-sm mb-2">
                Strengths
              </h3>
              <ul className="list-disc list-inside text-sm text-muted space-y-1">
                {result.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary text-sm mb-2">
                Risks to Watch
              </h3>
              <ul className="list-disc list-inside text-sm text-muted space-y-1">
                {result.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-accent-light border border-accent/30 rounded-xl2 p-4">
            <span className="text-xs font-bold tracking-widest text-accent">
              SUGGESTED SCHEME
            </span>
            <p className="text-sm text-ink mt-1">{result.scheme}</p>
          </div>

          <p className="text-xs text-muted mt-6">
            This is placeholder output for the frontend demo. Real scoring
            will come from the AI advisory engine once it&apos;s built.
          </p>
        </div>
      )}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
