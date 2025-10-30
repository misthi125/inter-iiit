export const BarChart = ({ data, period }) => {
  const maxValue = Math.max(...data.map(d => d.consumption));

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

  const showEveryNth = Math.ceil(data.length / 12);

  return (
    <div className="w-full h-64 flex items-end justify-between gap-1">
      {data.map((item, index) => {
        const height = (item.consumption / maxValue) * 100;
        const showLabel = index % showEveryNth === 0;

        return (
          <div key={item.id} className="flex-1 flex flex-col items-center group">
            <div className="w-full flex items-end justify-center h-56">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500 relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.consumption.toFixed(1)} kWh
                </div>
              </div>
            </div>
            {showLabel && (
              <span className="text-xs text-gray-500 mt-2 text-center">
                {formatTime(item.timestamp)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
