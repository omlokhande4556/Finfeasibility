import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import WorkflowSteps from "@/components/WorkflowSteps";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Problem / Solution */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-6">
        <div className="bg-primary text-white rounded-xl2 p-8">
          <h2 className="text-xs font-bold tracking-widest mb-3">
            THE PROBLEM
          </h2>
          <p className="leading-relaxed text-[#FBEEEA]">
            Rural micro-entrepreneurs launch businesses on gut feeling, with
            no way to check local demand, competition, or footfall. Loan and
            financial planning is left to informal money-lenders and generic
            bank forms that don&apos;t fit their reality.
          </p>
        </div>
        <div className="bg-secondary text-white rounded-xl2 p-8">
          <h2 className="text-xs font-bold tracking-widest mb-3">
            OUR SOLUTION
          </h2>
          <p className="leading-relaxed text-[#EAF3EC]">
            A one-stop AI advisory assistant &mdash; accessible over
            WhatsApp, voice, and a simple app &mdash; that evaluates a
            business idea against hyper-local market signals and generates a
            right-sized loan plan mapped to government schemes.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 py-4">
        <h2 className="text-2xl font-bold text-ink mb-8">How It Works</h2>
        <WorkflowSteps />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <h2 className="text-2xl font-bold text-ink mb-8">
          What The Platform Offers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            badge="MI"
            color="primary"
            title="Hyper-Local Market Intelligence"
            description="Analyzes local business opportunities, demand & competition insights, and underserved market gaps."
          />
          <FeatureCard
            badge="AI"
            color="accent"
            title="AI Business Advisory"
            description="Generates SWOT analysis, identifies risks & opportunities, and gives personalized recommendations."
          />
          <FeatureCard
            badge="FIN"
            color="secondary"
            title="Smart Financial Calculator"
            description="Calculates project cost & contribution, defines eligible loan, interest & EMI, and builds a repayment schedule."
          />
          <FeatureCard
            badge="GOV"
            color="primary"
            title="Government Scheme Router"
            description="Matches your project with the relevant scheme and simplifies complex eligibility rules."
          />
          <FeatureCard
            badge="LANG"
            color="secondary"
            title="Multilingual Rural Assistant"
            description="A simple, user-friendly interface that supports regional languages and voice-based interaction."
          />
          <FeatureCard
            badge="+"
            color="accent"
            title="More, on the way"
            description="This frontend is a starting point &mdash; new modules will plug in as the backend and AI engine are built."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="bg-[#F5F1EA] border border-[#E3D9C8] rounded-xl2 p-10 text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">
            Ready to check your business idea?
          </h2>
          <p className="text-muted mb-6 max-w-xl mx-auto">
            This is a demo flow &mdash; the results are placeholders until
            the AI and financial engine are connected.
          </p>
          <Link
            href="/idea-check"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Try the Demo
          </Link>
        </div>
      </section>
    </>
  );
}
