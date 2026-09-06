export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3B2417] text-white mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-bold text-lg mb-2">Rural Advisor</div>
          <p className="text-sm text-[#D8C9B8] leading-relaxed">
            AI-driven hyper-local business advisory and financial structuring
            assistant for rural micro-entrepreneurs. SIH 2026 &middot;
            SIH26091.
          </p>
        </div>

        <div>
          <div className="font-semibold text-sm mb-3 text-accent">
            Product
          </div>
          <ul className="space-y-2 text-sm text-[#D8C9B8]">
            <li>Home</li>
            <li>Check My Idea</li>
            <li>Financial Planner (coming soon)</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-sm mb-3 text-accent">Team</div>
          <p className="text-sm text-[#D8C9B8]">Your Team Name</p>
          <p className="text-sm text-[#D8C9B8]">Team ID: Your Team ID</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-[#D8C9B8] py-4">
        &copy; {year} Rural Advisor. Built for Smart India Hackathon.
      </div>
    </footer>
  );
}
