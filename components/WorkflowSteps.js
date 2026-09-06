const STEPS = [
  {
    title: "Idea & Location Input",
    desc: "Share your idea, budget and village/block via WhatsApp, IVR or the app.",
    color: "bg-primary",
  },
  {
    title: "Hyper-Local Market Scan",
    desc: "We cross-check local demand, competition & footfall using public datasets.",
    color: "bg-accent",
  },
  {
    title: "Viability Scoring",
    desc: "Get a clear rating of your idea's success probability and key risks.",
    color: "bg-secondary",
  },
  {
    title: "Financial Structuring",
    desc: "We build a loan plan and match you to eligible government schemes.",
    color: "bg-primary",
  },
  {
    title: "Advisory Report",
    desc: "A simple report you can act on and share with your bank.",
    color: "bg-secondary",
  },
];

export default function WorkflowSteps() {
  return (
    <div className="grid md:grid-cols-5 gap-4">
      {STEPS.map((s, i) => (
        <div
          key={s.title}
          className="bg-white border border-[#E3D9C8] rounded-xl2 p-5 relative"
        >
          <div
            className={`w-9 h-9 rounded-full ${s.color} text-white flex items-center justify-center font-bold text-sm mb-4`}
          >
            {i + 1}
          </div>
          <h4 className="font-bold text-ink text-sm mb-2">{s.title}</h4>
          <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
