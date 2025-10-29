export const DonutChart = ({ data, title }) => {
  const deviceConsumption = data.reduce((acc, item) => {
    acc[item.deviceType] = (acc[item.deviceType] || 0) + item.consumption;
    return acc;
  }, {});

  const total = Object.values(deviceConsumption).reduce((sum, val) => sum + val, 0);

  const segments = Object.entries(deviceConsumption).map(([device, consumption]) => ({
    device,
    consumption,
    percentage: (consumption / total) * 100
  }));

  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981'
  ];

  let currentAngle = 0;
  const radius = 40;
  const center = 50;

  const createArc = (startAngle, endAngle) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} L ${center} ${center} Z`;
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {segments.map((segment, index) => {
              const startAngle = currentAngle;
              const endAngle = currentAngle + (segment.percentage / 100) * 360;
              currentAngle = endAngle;

              return (
                <path
                  key={segment.device}
                  d={createArc(startAngle, endAngle)}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{total.toFixed(0)}</p>
              <p className="text-xs text-gray-500">kWh</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={segment.device} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-600">{segment.device}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {segment.percentage.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {segment.consumption.toFixed(0)} kWh
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
