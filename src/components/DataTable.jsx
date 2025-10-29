export const DataTable = ({ anomalies }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Anomalies</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Consumption</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Severity</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((anomaly) => (
              <tr key={anomaly.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600">{formatTime(anomaly.timestamp)}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{anomaly.type}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{anomaly.description}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{anomaly.consumption.toFixed(1)} kWh</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                      anomaly.severity
                    )}`}
                  >
                    {anomaly.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
