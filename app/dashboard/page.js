// app/dashboard/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  LayoutGrid,
  MapPin,
  ArrowUpRight,
  AlertTriangle,
  Landmark,
  CalendarDays,
  Gauge,
} from "lucide-react";

function scoreTier(score) {
  if (score >= 70) {
    return {
      bg: "#E8F0E0",
      text: "#3B5E3D",
      bar: "#4D7C4F",
    };
  }

  if (score >= 40) {
    return {
      bg: "#F7ECD6",
      text: "#8A5A12",
      bar: "#B45309",
    };
  }

  return {
    bg: "#F6E0DE",
    text: "#9A3412",
    bar: "#C2410C",
  };
}

function confidenceTier(score) {
  if (score >= 75) {
    return {
      bg: "#E8F0E0",
      text: "#3B5E3D",
    };
  }

  if (score >= 50) {
    return {
      bg: "#F7ECD6",
      text: "#8A5A12",
    };
  }

  return {
    bg: "#F6E0DE",
    text: "#9A3412",
  };
}

const CATEGORY_ICON = {
  "Retail / General Store": "🏪",
  "Food & Beverage": "🍲",
  "Handicrafts / Weaving": "🧵",
  "Agri-processing": "🌾",
  "Services (repair, tailoring, salon)": "🔧",
  Other: "💼",
};

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: ideas, error } = await supabase
    .from("business_ideas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const scores =
    ideas?.map((i) => i.viability_score).filter((s) => s != null) || [];

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const bestScore = scores.length ? Math.max(...scores) : null;

  return (
    <div className="min-h-screen bg-[#faf7f1]">
      <div className="max-w-3xl mx-auto py-12 sm:py-14 px-5">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E3D9C8] bg-[#F5F1EA] px-3 py-1 text-xs font-semibold tracking-widest text-secondary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              YOUR PORTFOLIO
            </span>

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink text-balance">
              Your Ideas
            </h1>

            <p className="mt-2 text-sm text-muted leading-relaxed">
              Track every idea you&apos;ve checked and its outlook
            </p>
          </div>

          <Link
            href="/idea-check"
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Idea
          </Link>
        </div>

        {/* STATS */}
        {ideas?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="rounded-xl2 border border-[#E3D9C8] bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-muted mb-2">
                <LayoutGrid
                  className="h-4 w-4 text-secondary"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Ideas checked</p>
              </div>

              <p className="text-2xl sm:text-3xl font-bold text-ink leading-none">
                {ideas.length}
              </p>
            </div>

            <div className="rounded-xl2 border border-[#E3D9C8] bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-muted mb-2">
                <TrendingUp
                  className="h-4 w-4 text-secondary"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Average score</p>
              </div>

              <p className="text-2xl sm:text-3xl font-bold text-secondary leading-none">
                {avgScore ?? "—"}
              </p>
            </div>

            <div className="rounded-xl2 border border-[#E3D9C8] bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-muted mb-2">
                <Award
                  className="h-4 w-4 text-accent"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Best idea</p>
              </div>

              <p className="text-2xl sm:text-3xl font-bold text-accent leading-none">
                {bestScore ?? "—"}
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm mb-4 rounded-xl border border-primary/30 bg-primary/10 text-primary px-4 py-3">
            {error.message}
          </p>
        )}

        {/* EMPTY STATE */}
        {!ideas?.length && (
          <div className="rounded-xl2 border border-[#E3D9C8] bg-white p-10 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F1EA] text-secondary">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>

            <p className="font-bold text-ink text-lg mb-1">
              No ideas checked yet
            </p>

            <p className="text-sm text-muted mb-5">
              Check your first business idea to see it here.
            </p>

            <Link
              href="/idea-check"
              className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Check Your Idea
            </Link>
          </div>
        )}

        {/* IDEAS LIST */}
        <div className="grid gap-4">
          {ideas?.map((idea) => {
            const tier = scoreTier(idea.viability_score ?? 0);
            const topStrength = idea.strengths?.[0];
            const topRisk = idea.risks?.[0];

            const scheme =
              typeof idea.suggested_schemes === "object" &&
              idea.suggested_schemes
                ? idea.suggested_schemes.name
                : idea.suggested_schemes;

            const icon = CATEGORY_ICON[idea.business_type] || "💼";

            const confTier =
              idea.confidence_score != null
                ? confidenceTier(idea.confidence_score)
                : null;

            return (
              <div
                key={idea.id}
                className="rounded-xl2 border border-[#E3D9C8] bg-white overflow-hidden hover:border-secondary/50 hover:shadow-md transition-all shadow-sm"
              >
                <div
                  className="h-1.5"
                  style={{ backgroundColor: tier.bar }}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: tier.bg }}
                      >
                        {icon}
                      </div>

                      <div>
                        <h2 className="font-bold text-ink text-base leading-tight">
                          {idea.business_name}
                        </h2>

                        <p className="text-xs text-muted mt-1 inline-flex items-center gap-1">
                          <MapPin
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {idea.location} · {idea.business_type}
                        </p>
                      </div>
                    </div>

                    {idea.viability_score != null && (
                      <div className="text-center shrink-0">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm"
                          style={{
                            backgroundColor: tier.bar,
                            color: "#ffffff",
                          }}
                        >
                          {idea.viability_score}
                        </div>

                        <p className="text-[10px] font-semibold tracking-wider text-muted mt-1">
                          SCORE
                        </p>
                      </div>
                    )}
                  </div>

                  {idea.advisory_summary && (
                    <p className="text-sm text-muted leading-6 mb-4">
                      {idea.advisory_summary}
                    </p>
                  )}

                  {(topStrength || topRisk || scheme) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {topStrength && (
                        <span className="inline-flex items-center gap-1.5 bg-[#E8F0E0] text-[#3B5E3D] text-xs font-medium px-3 py-1.5 rounded-full">
                          <ArrowUpRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {topStrength}
                        </span>
                      )}

                      {topRisk && (
                        <span className="inline-flex items-center gap-1.5 bg-[#F6E0DE] text-[#9A3412] text-xs font-medium px-3 py-1.5 rounded-full">
                          <AlertTriangle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {topRisk}
                        </span>
                      )}

                      {scheme && (
                        <span className="inline-flex items-center gap-1.5 bg-[#EAF0F5] text-[#2F5A80] text-xs font-medium px-3 py-1.5 rounded-full">
                          <Landmark
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {scheme}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-[#E3D9C8] pt-3">
                    <p className="text-xs text-muted inline-flex items-center gap-1.5">
                      <CalendarDays
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />

                      {new Date(idea.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {/* CONFIDENCE BADGE */}
                    {confTier && (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: confTier.bg,
                          color: confTier.text,
                        }}
                      >
                        <Gauge
                          className="h-3 w-3"
                          aria-hidden="true"
                        />
                        {idea.confidence_score}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}