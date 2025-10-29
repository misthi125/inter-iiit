import { AlertTriangle, Info, Lightbulb } from 'lucide-react';

export const AlertCard = ({ suggestion }) => {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'warning':
        return AlertTriangle;
      case 'alert':
        return AlertTriangle;
      case 'tip':
        return Lightbulb;
      default:
        return Info;
    }
  };

  const getStyles = () => {
    switch (suggestion.type) {
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-900'
        };
      case 'alert':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900'
        };
      case 'tip':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-900'
        };
    }
  };

  const Icon = getIcon();
  const styles = getStyles();

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex gap-3">
        <div className={`${styles.iconBg} p-2 rounded-lg h-fit`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${styles.titleColor} mb-1`}>
            {suggestion.title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
          {suggestion.potentialSavings && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-700">
              <span>Potential savings:</span>
              <span className="font-bold">{suggestion.potentialSavings}% reduction</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
