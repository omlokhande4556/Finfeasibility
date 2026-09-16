export default function IdeaCard({ title, subtitle, icon, link, linkLabel }) {
  return (
    <div className="flex items-start gap-4 bg-white border border-[#E8E3DB] rounded-xl p-4 shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shrink-0">
        {icon ? (
          <span className="text-lg">{icon}</span>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div>
        <div className="font-semibold text-ink text-sm">{title}</div>
        <div className="text-muted text-xs mt-1">{subtitle}</div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            {linkLabel || "Learn more"}
          </a>
        )}

      </div>
    </div>
  );
}
