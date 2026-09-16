"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const SCHEME_RATES = {
  "Pradhan Mantri MUDRA Yojana (PMMY)": 9.5,
  PMEGP: 8.5,
  "Stand-Up India": 10,
  CGTMSE: 11,
  Other: 12,
};

export default function LoanCheckPage() {
  const { id } = useParams();
  const supabase = createClient();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10");
  const [tenureMonths, setTenureMonths] = useState("36");
  const [expectedProfit, setExpectedProfit] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchIdea() {
      const { data, error } = await supabase
        .from("business_ideas")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setIdea(data);
        setLoanAmount(data.investment || "");

        const schemeName =
          typeof data.suggested_schemes === "object"
            ? data.suggested_schemes?.name
            : data.suggested_schemes;

        if (schemeName && SCHEME_RATES[schemeName]) {
          setInterestRate(String(SCHEME_RATES[schemeName]));
        }
      }
      setLoading(false);
    }

    if (id) fetchIdea();
  }, [id]);

  function calculateAffordability(e) {
    e.preventDefault();

    const P = Number(loanAmount);
    const r = Number(interestRate) / 12 / 100;
    const n = Number(tenureMonths);
    const profit = Number(expectedProfit);

    if (!P || !r || !n || !profit) return;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const emiRatio = (emi / profit) * 100;

    let verdict, verdictColor, advice;
    if (emiRatio <= 40) {
      verdict = "Comfortable";
      verdictColor = "#27500A";
      advice =
        "The EMI takes up a healthy share of your expected profit, leaving room for expenses and savings.";
    } else if (emiRatio <= 65) {
      verdict = "Tight";
      verdictColor = "#633806";
      advice =
        "The EMI is manageable but leaves little buffer. Consider a longer tenure or smaller loan amount.";
    } else {
      verdict = "Risky";
      verdictColor = "#791F1F";
      advice =
        "The EMI would consume most of your expected profit. Re-evaluate the loan amount, tenure, or your revenue assumptions before proceeding.";
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setResult({
      emi: Math.round(emi),
      emiRatio: Math.round(emiRatio),
      verdict,
      verdictColor,
      advice,
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    });
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-5 py-16 text-muted">Loading...</div>;
  }

  if (!idea) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16">
        <p className="text-muted">Idea not found.</p>
        <Link href="/dashboard" className="text-primary underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="text-3xl font-bold text-ink mb-2">Check Loan Affordability</h1>
      <p className="text-muted mb-8">
        For <strong>{idea.business_name}</strong> in {idea.location} — see whether
        the EMI fits your expected monthly profit before you take the loan.
      </p>

      <form
        onSubmit={calculateAffordability}
        className="bg-[#F5F1EA] border border-[#E3D9C8] rounded-xl2 p-8 grid gap-5"
      >
        <Field label="Loan Amount Needed (₹)">
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
            min="0"
            className="input"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Interest Rate (% per year)">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
              min="0"
              className="input"
            />
          </Field>

          <Field label="Tenure (months)">
            <input
              type="number"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              required
              min="1"
              className="input"
            />
          </Field>
        </div>

        <Field label="Expected Monthly Profit (₹)">
          <input
            type="number"
            value={expectedProfit}
            onChange={(e) => setExpectedProfit(e.target.value)}
            required
            min="0"
            placeholder="e.g. 15000"
            className="input"
          />
          <span className="text-xs text-muted mt-1 block">
            Your realistic monthly earnings after expenses, before loan repayment.
          </span>
        </Field>

        <button
          type="submit"
          className="justify-self-start bg-secondary hover:bg-secondary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Calculate Affordability
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white border border-[#E3D9C8] rounded-xl2 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="px-4 py-2 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: result.verdictColor }}
            >
              {result.verdict}
            </div>
            <div className="text-sm text-muted">
              EMI is <strong>{result.emiRatio}%</strong> of your expected profit
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted mb-1">Monthly EMI</p>
              <p className="text-xl font-bold text-ink">
                ₹{result.emi.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Total Interest</p>
              <p className="text-xl font-bold text-ink">
                ₹{result.totalInterest.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted leading-6">{result.advice}</p>
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