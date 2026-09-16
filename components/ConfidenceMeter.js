export default function ConfidenceMeter({ score, factors = [] }) {
  const getColor = (s) => {
    if (s >= 75) return 'bg-green-500';
    if (s >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const typeConfig = {
    verified: { icon: '✓', label: 'Verified', color: 'text-green-400' },
    'data-derived': { icon: '📊', label: 'Data-derived', color: 'text-blue-400' },
    estimated: { icon: '△', label: 'Estimated', color: 'text-yellow-400' },
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-300 tracking-wide">
          RECOMMENDATION CONFIDENCE
        </span>
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>

      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      {factors.length > 0 && (
        <div className="pt-2 space-y-1.5">
          {factors.map((f, i) => {
            const cfg = typeConfig[f.type] || typeConfig.estimated;
            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={cfg.color}>{cfg.icon}</span>
                <span className="text-gray-300">{f.label}</span>
                <span className={`ml-auto text-xs ${cfg.color} opacity-70`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}