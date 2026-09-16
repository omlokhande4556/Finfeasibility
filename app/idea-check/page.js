"use client";

import { useState } from "react";
import ConfidenceMeter from '@/components/ConfidenceMeter';
import Link from "next/link";
import {
  BarChart3,
  Wallet,
  Handshake,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Landmark,
  ArrowRight,
  ExternalLink,
  Target,
  Mic,          // NEW
  MicOff,       // NEW
  Volume2, 
} from "lucide-react";
import IdeaCard from "../../components/IdeaCard";
import { createClient } from "@/lib/supabase/client";
import { useVoice } from "@/hooks/useVoice"; 

const SCHEMES_URL = "https://www.startupindia.gov.in";

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
  const supabase = createClient();

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedIdeaId, setSavedIdeaId] = useState(null);

  const [localAnalysis, setLocalAnalysis] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const [voiceLang, setVoiceLang] = useState("mr-IN");
  const { listening, startListening, speak } = useVoice();

  function handleVoiceInput() {
    startListening(voiceLang, (text) => {
      setForm((prev) => ({
        ...prev,
        idea: prev.idea ? prev.idea + " " + text : text,
      }));
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Function to detect users locattion using the Geolocation API and reverse geocoding to get a readable Location (village/block/district)
  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoordinates({
          latitude,
          longitude,
        });

        try {
          /*
           * Reverse geocoding:
           * latitude + longitude → readable location
           */
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Could not determine your location.");
          }

          const data = await response.json();

          const address = data.address || {};

          const readableLocation = [
            address.village ||
              address.town ||
              address.city ||
              address.municipality,
            address.county,
            address.state,
          ]
            .filter(Boolean)
            .join(", ");

          if (!readableLocation) {
            throw new Error("Could not determine a readable location.");
          }

          setForm((prev) => ({
            ...prev,
            location: readableLocation,
          }));
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          alert(
            "Location detected, but we couldn't convert it into a place name. You can enter your location manually."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Geolocation error:", error);

        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Location permission was denied. Please enter your village/block/district manually."
          );
        } else {
          alert("Unable to detect your location. Please enter it manually.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  async function handleLocalAnalysis() {
    if (!form.idea || !form.category || !form.location || !form.budget) {
      alert(
        "Please complete your business idea, category, location and budget first."
      );
      return;
    }

    setLocalLoading(true);
    setLocalAnalysis(null);

    try {
      const response = await fetch("/api/hyper-local-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessIdea: form.idea,
          category: form.category,
          location: form.location,
          budget: Number(form.budget),
          latitude: coordinates?.latitude ?? null,
          longitude: coordinates?.longitude ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hyper-local analysis failed.");
      }

      setLocalAnalysis(data);
    } catch (error) {
      console.error("Local analysis error:", error);

      alert(error.message || "Unable to analyze the local market.");
    } finally {
      setLocalLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);
    setResult(null);
    setSavedIdeaId(null);

    try {
      // ==============================
      // 1. CALL AI ADVISORY ENGINE
      // ==============================

      const aiResponse = await fetch("/api/analyze-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          idea: form.idea,
          category: form.category,
          location: form.location,
          budget: Number(form.budget),
          language: voiceLang.split("-")[0],
        }),
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(aiData.error || "AI analysis failed.");
      }

      console.log("AI result:", aiData);

      // Display real AI result
      setResult(aiData);

      // ==============================
      // 2. GET CURRENT USER
      // ==============================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Your session expired — please log in again to save this idea.");
        return;
      }

      // ==============================
      // 3. SAVE BUSINESS IDEA + AI RESULT
      // ==============================

      const { data: savedIdea, error } = await supabase
        .from("business_ideas")
        .insert({
          user_id: user.id,
          business_name: form.name,
          business_type: form.category,
          location: form.location,
          investment: Number(form.budget),
          idea_description: form.idea,
          viability_score: aiData.score,
          advisory_summary: aiData.summary,
          strengths: aiData.strengths,
          risks: aiData.risks,
          recommendations: aiData.recommendations,
          suggested_schemes: aiData.scheme,
          confidence_score: aiData.confidence_score,
          confidence_factors: aiData.confidence_factors,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        alert(
          "AI analysis completed, but the business idea could not be saved."
        );
      } else {
        setSavedIdeaId(savedIdea.id);
      }
    } catch (error) {
      console.error("Analysis error:", error);

      alert(error.message || "Something went wrong while analyzing your idea.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-5 py-14 sm:py-16">
      {/* PAGE HEADING */}

      <div className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E3D9C8] bg-[#F5F1EA] px-3 py-1 text-xs font-semibold tracking-widest text-secondary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          AI BUSINESS ADVISORY
        </span>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink text-balance">
          Check Your Business Idea
        </h1>

        <p className="mt-3 max-w-2xl text-muted leading-relaxed text-pretty">
          Tell us about your business idea and our AI advisory engine will
          evaluate its viability, identify strengths and risks, and suggest
          relevant government support.
        </p>
      </div>

      {/* QUICK HIGHLIGHTS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <IdeaCard
          title="Market Fit"
          subtitle="Insights on local demand and customer segments."
          icon="📊"
        />

        <IdeaCard
          title="Startup Costs"
          subtitle="A quick view of initial investment and running costs."
          icon="💰"
        />

        <IdeaCard
          title="Funding & Schemes"
          subtitle="Relevant government schemes and funding paths."
          icon="🤝"
          link={SCHEMES_URL}
          linkLabel="View schemes"
        />
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-[#F5F1EA] border border-[#E3D9C8] rounded-xl2 p-6 sm:p-8 grid gap-6 shadow-sm"
      >
        <div className="flex items-center gap-3 border-b border-[#E3D9C8] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-ink leading-tight">Idea Details</h2>
            <p className="text-xs text-muted">
              Fill in the details below to get your assessment.
            </p>
          </div>
        </div>

        {/* NAME + LOCATION */}

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Your Name">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
              className="input"
            />
          </Field>

          <Field label="Village*** / Block / District">
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Badlapur, Thane, Maharashtra"
                className="input flex-1"
              />

              <button
                type="button"
                onClick={detectLocation}
                disabled={locationLoading}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E3D9C8] bg-white hover:bg-[#F5F1EA] disabled:opacity-60 font-semibold text-sm transition-colors"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {locationLoading ? "Detecting..." : "Detect**"}
              </button>
            </div>

            <p className="text-xs text-muted mt-2">
              You can detect your location or enter your village/block/district
              manually.
            </p>
          </Field>
        </div>

        {/* BUSINESS IDEA */}

<Field label="Describe Your Business Idea">
  <div className="flex items-center gap-2 mb-2">
    <select
      value={voiceLang}
      onChange={(e) => setVoiceLang(e.target.value)}
      className="text-xs border border-[#E3D9C8] rounded-full px-3 py-1.5 bg-white"
    >
      <option value="mr-IN">मराठी</option>
      <option value="hi-IN">हिंदी</option>
      <option value="en-IN">English</option>
    </select>

    <button
      type="button"
      onClick={handleVoiceInput}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        listening
          ? "bg-primary/10 text-primary"
          : "bg-secondary/10 text-secondary hover:bg-secondary/20"
      }`}
    >
      {listening ? (
        <MicOff className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Mic className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {listening ? "Listening..." : "Speak your idea"}
    </button>
  </div>

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

        {/* CATEGORY + BUDGET */}

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Business Category">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
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

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={submitting}
          className="justify-self-start inline-flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Analyzing your idea..." : "Evaluate My Idea"}
        </button>
      </form>

      {/* AI RESULT */}

      {result && (
        <div className="mt-8 bg-white border border-[#E3D9C8] rounded-xl2 p-6 sm:p-8 shadow-sm">
          {/* SCORE + VERDICT */}

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E3D9C8]">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-secondary text-white shadow-sm">
              <span className="text-2xl font-bold leading-none">
                {result.score}
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-wider opacity-80">
                SCORE
              </span>
            </div>

            <div>
              <div className="text-xs font-bold tracking-widest text-secondary mb-1">
                AI VIABILITY SCORE
              </div>

              <div className="font-bold text-ink text-xl">{result.verdict}</div>
            </div>
          </div>
          {/* CONFIDENCE METER — NEW */}
    <ConfidenceMeter 
      score={result.confidence_score} 
      factors={result.confidence_factors} 
    />

          {/* SUMMARY */}

          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-bold text-ink mb-2">
              <Target className="h-4 w-4 text-secondary" aria-hidden="true" />
              Advisory Summary
            </h3>

            <p className="text-sm text-muted leading-6">{result.summary}</p>
          <button
             type="button"
             onClick={() => speak(result.summary, voiceLang)}
             className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-secondary hover:underline"
            >
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          Listen to summary
        </button>
          </div>

          {/* STRENGTHS + RISKS */}

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* STRENGTHS */}

            <div className="rounded-xl border border-[#E3D9C8] bg-[#F5F1EA] p-5">
              <h3 className="flex items-center gap-2 font-bold text-secondary text-sm mb-3">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Strengths
              </h3>

              <ul className="space-y-2.5 text-sm text-muted">
                {result.strengths?.map((strength, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                      aria-hidden="true"
                    />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RISKS */}

            <div className="rounded-xl border border-[#E3D9C8] bg-[#F5F1EA] p-5">
              <h3 className="flex items-center gap-2 font-bold text-primary text-sm mb-3">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Risks to Watch
              </h3>

              <ul className="space-y-2.5 text-sm text-muted">
                {result.risks?.map((risk, index) => (
                  <li key={index} className="flex gap-2">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RECOMMENDATIONS */}

          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-bold text-ink text-sm mb-3">
              <Lightbulb className="h-4 w-4 text-secondary" aria-hidden="true" />
              Recommendations
            </h3>

            <ul className="space-y-2.5 text-sm text-muted">
              {result.recommendations?.map((recommendation, index) => (
                <li key={index} className="flex gap-2">
                  <ArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink/60"
                    aria-hidden="true"
                  />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* HYPER-LOCAL MARKET ANALYSIS */}

          <div className="mb-8 rounded-xl2 border border-[#E3D9C8] bg-[#F5F1EA] p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-secondary">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  HYPER-LOCAL INTELLIGENCE
                </span>

                <h3 className="font-bold text-ink text-lg mt-2">
                  Analyze Your Local Market
                </h3>

                <p className="text-sm text-muted mt-1 leading-6">
                  Get an AI assessment of demand, competition, market gaps,
                  pricing potential and growth for your selected location.
                </p>

                <p className="text-xs text-muted mt-3 inline-flex items-center gap-1.5">
                  <MapPin
                    className="h-3.5 w-3.5 text-secondary"
                    aria-hidden="true"
                  />
                  Location: <strong className="text-ink">{form.location}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleLocalAnalysis}
                disabled={localLoading}
                className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-full transition-colors shadow-sm"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {localLoading ? "Analyzing..." : "Analyze Local Market"}
              </button>
            </div>
          </div>

          {localAnalysis && (
            <div className="mb-8 rounded-xl2 border border-[#E3D9C8] bg-white p-6 shadow-sm">
              {/* HEADER */}

              <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E3D9C8]">
                <div>
                  <span className="text-xs font-bold tracking-widest text-secondary">
                    LOCAL MARKET RESULT
                  </span>

                  <h3 className="font-bold text-ink text-xl mt-1">
                    {form.location}
                  </h3>
                </div>

                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white text-xl font-bold shadow-sm">
                    {localAnalysis.marketScore}
                  </div>

                  <p className="text-xs text-muted mt-1.5">Market Score</p>
                </div>
              </div>

              {/* SCORE CARDS */}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                <LocalScore title="Demand" score={localAnalysis.demandScore} />

                <LocalScore
                  title="Competition"
                  score={localAnalysis.competitionScore}
                />

                <LocalScore
                  title="Market Gap"
                  score={localAnalysis.marketGapScore}
                />

                <LocalScore title="Pricing" score={localAnalysis.pricingScore} />

                <LocalScore title="Growth" score={localAnalysis.growthScore} />
              </div>

              {/* SUMMARY */}

              <div className="mb-6">
                <h4 className="font-bold text-ink mb-2">
                  Local Market Assessment
                </h4>

                <p className="text-sm text-muted leading-6">
                  {localAnalysis.summary}
                </p>
              </div>

              {/* INSIGHTS */}

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <LocalInsight title="Demand" text={localAnalysis.demand} />

                <LocalInsight
                  title="Competition"
                  text={localAnalysis.competition}
                />

                <LocalInsight
                  title="Market Gap"
                  text={localAnalysis.marketGap}
                />

                <LocalInsight
                  title="Pricing Potential"
                  text={localAnalysis.pricing}
                />

                <LocalInsight
                  title="Growth Potential"
                  text={localAnalysis.growth}
                />

                <LocalInsight
                  title="Opportunity"
                  text={localAnalysis.opportunity}
                />
              </div>

              {/* RISKS */}

              {localAnalysis.risks?.length > 0 && (
                <div className="mb-6 rounded-xl border border-[#E3D9C8] bg-[#F5F1EA] p-5">
                  <h4 className="flex items-center gap-2 font-bold text-primary text-sm mb-3">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    Local Risks to Validate
                  </h4>

                  <ul className="space-y-2.5 text-sm text-muted">
                    {localAnalysis.risks.map((risk, index) => (
                      <li key={index} className="flex gap-2">
                        <AlertTriangle
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NEXT STEPS */}

              {localAnalysis.nextSteps?.length > 0 && (
                <div className="rounded-xl border border-[#E3D9C8] bg-[#F5F1EA] p-5">
                  <h4 className="flex items-center gap-2 font-bold text-secondary text-sm mb-3">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Recommended Next Steps
                  </h4>

                  <ul className="space-y-2.5 text-sm text-muted">
                    {localAnalysis.nextSteps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <ArrowRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                          aria-hidden="true"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-muted mt-6 leading-5">
                This local-market assessment is an AI advisory estimate. Local
                conditions should be verified before investing.
              </p>
            </div>
          )}

          {/* GOVERNMENT SCHEME */}

          {result.scheme && (
            <div className="bg-accent-light border border-accent/30 rounded-xl2 p-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-accent">
                <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                SUGGESTED GOVERNMENT SUPPORT
              </span>

              <h3 className="font-bold text-ink mt-2 text-lg">
                {result.scheme.name}
              </h3>

              <p className="text-sm text-muted mt-2 leading-6">
                {result.scheme.reason}
              </p>

              <p className="text-xs text-muted mt-3">
                <strong>Eligibility note:</strong>{" "}
                {result.scheme.eligibilityNote}
              </p>

              <a
                href={SCHEMES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Learn more
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          )}

          {/* DISCLAIMER */}

          <p className="text-xs text-muted mt-6 leading-5">
            This AI assessment is an advisory estimate, not a guarantee of
            business success, loan approval, or government-scheme eligibility.
            Always verify current scheme requirements through official government
            sources.
          </p>

          {savedIdeaId && (
            <Link
              href={`/loan-check/${savedIdeaId}`}
              className="inline-flex items-center gap-2 mt-6 bg-secondary hover:bg-secondary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
            >
              Check Loan Affordability
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

/* REUSABLE FIELD COMPONENT */

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

function LocalScore({ title, score }) {
  return (
    <div className="rounded-xl border border-[#E3D9C8] bg-white p-3.5">
      <p className="text-xs font-medium text-muted">{title}</p>

      <p className="text-2xl font-bold text-ink mt-1 leading-none">{score}</p>

      <div className="h-1.5 bg-[#E3D9C8] rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full transition-all"
          style={{
            width: `${Math.max(0, Math.min(100, score))}%`,
          }}
        />
      </div>
    </div>
  );
}

function LocalInsight({ title, text }) {
  return (
    <div className="rounded-xl border border-[#E3D9C8] border-l-4 border-l-secondary bg-white p-4">
      <h4 className="font-semibold text-ink text-sm">{title}</h4>

      <p className="text-sm text-muted mt-1 leading-6">{text}</p>
    </div>
  );
}