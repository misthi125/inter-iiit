import { LineChart as LineIcon, BarChart3, TrendingUp } from 'lucide-react';

export const ChartTypeSelector = ({ selectedType, onTypeChange }) => {
  const types = [
    { value: 'line', label: 'Line', icon: LineIcon },
    { value: 'bar', label: 'Bar', icon: BarChart3 },
    { value: 'area', label: 'Area', icon: TrendingUp }
  ];

  return (
    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              selectedType === type.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};
