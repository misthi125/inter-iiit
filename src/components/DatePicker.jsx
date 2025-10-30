import { Calendar } from 'lucide-react';

export const DatePicker = ({ selectedDate, onDateChange }) => {
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const today = formatDate(new Date());
  const minDate = formatDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2">
      <Calendar className="w-5 h-5 text-gray-500" />
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        max={today}
        min={minDate}
        className="border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
      />
    </div>
  );
};
