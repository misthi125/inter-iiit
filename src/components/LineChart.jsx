export const LineChart = ({ data, period }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.consumption, d.prediction)));
  const minValue = Math.min(...data.map(d => Math.min(d.consumption, d.prediction)));
  const range = maxValue - minValue;

  const getY = (value) => {
    return 100 - ((value - minValue) / range) * 100;
  };

  const createPath = (values) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = getY(value);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const consumptionPath = createPath(data.map(d => d.consumption));
  const predictionPath = createPath(data.map(d => d.prediction));

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    switch (period) {
      case 'daily':
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      case 'weekly':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'yearly':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }
  };

  const showEveryNth = Math.ceil(data.length / 6);

  return (
    <div className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-64" preserveAspectRatio="none">
          <defs>
            <linearGradient id="consumptionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={`${consumptionPath} L 100,100 L 0,100 Z`}
            fill="url(#consumptionGradient)"
          />

          <path
            d={consumptionPath}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={predictionPath}
            fill="none"
            stroke="rgb(168, 85, 247)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {data.filter((_, i) => i % showEveryNth === 0).map((d, i) => (
            <span key={i}>{formatTime(d.timestamp)}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Actual Consumption</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Predicted</span>
          </div>
        </div>
      </div>
  );
};
