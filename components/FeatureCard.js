const COLOR_MAP = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

export default function FeatureCard({ badge, title, description, color = "primary" }) {
  return (
    <div className="bg-[#F5F1EA] border border-[#E3D9C8] rounded-xl2 p-6 h-full">
      <div
        className={`w-11 h-11 rounded-full ${COLOR_MAP[color]} text-white flex items-center justify-center font-bold text-sm mb-4`}
      >
        {badge}
      </div>
      <h3 className="font-bold text-ink text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
