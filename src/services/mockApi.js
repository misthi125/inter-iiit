const generateTimestamp = (hoursAgo, baseDate = new Date()) => {
  const date = new Date(baseDate);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

const generateEnergyDataForPeriod = (period, baseDate = new Date()) => {
  const devices = ['HVAC', 'Lighting', 'Appliances', 'Computing', 'Other'];
  const locations = ['Building A', 'Building B', 'Building C', 'Residential Area'];

  let dataPoints, hoursPerPoint;

  switch (period) {
    case 'daily':
      dataPoints = 24;
      hoursPerPoint = 1;
      break;
    case 'weekly':
      dataPoints = 7;
      hoursPerPoint = 24;
      break;
    case 'monthly':
      dataPoints = 30;
      hoursPerPoint = 24;
      break;
    case 'yearly':
      dataPoints = 12;
      hoursPerPoint = 24 * 30;
      break;
    default:
      dataPoints = 24;
      hoursPerPoint = 1;
  }

  return Array.from({ length: dataPoints }, (_, i) => {
    const baseConsumption = period === 'yearly' ? 3000 : period === 'monthly' ? 1500 : 50 + Math.random() * 100;
    const timeVariation = Math.sin((i / dataPoints) * Math.PI * 2) * (baseConsumption * 0.3);
    const consumption = baseConsumption + timeVariation + (Math.random() - 0.5) * (baseConsumption * 0.2);

    return {
      id: `energy-${i}`,
      timestamp: generateTimestamp((dataPoints - i) * hoursPerPoint, baseDate),
      consumption: Math.max(0, consumption),
      prediction: consumption + (Math.random() - 0.3) * (consumption * 0.1),
      deviceType: devices[Math.floor(Math.random() * devices.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    };
  });
};

const calculateStats = (data) => {
  const consumptions = data.map(d => d.consumption);
  const total = consumptions.reduce((sum, val) => sum + val, 0);
  const avg = total / consumptions.length;
  const peak = Math.max(...consumptions);

  const halfPoint = Math.floor(consumptions.length / 2);
  const recentAvg = consumptions.slice(halfPoint).reduce((sum, val) => sum + val, 0) / (consumptions.length - halfPoint);
  const olderAvg = consumptions.slice(0, halfPoint).reduce((sum, val) => sum + val, 0) / halfPoint;

  let trend = 'stable';
  if (recentAvg > olderAvg * 1.1) trend = 'up';
  else if (recentAvg < olderAvg * 0.9) trend = 'down';

  return {
    totalConsumption: total,
    avgConsumption: avg,
    peakConsumption: peak,
    trend,
    savingsPotential: avg * 0.15
  };
};

const generateAnomalies = (period = 'daily', baseDate = new Date()) => {
  const types = ['Sudden Spike', 'Unusual Pattern', 'Device Malfunction', 'After Hours Usage'];
  const severities = ['high', 'medium', 'low'];
  const locations = ['Building A', 'Building B', 'Building C', 'Residential Area'];

  let maxHoursBack;
  switch (period) {
    case 'daily':
      maxHoursBack = 24;
      break;
    case 'weekly':
      maxHoursBack = 24 * 7;
      break;
    case 'monthly':
      maxHoursBack = 24 * 30;
      break;
    case 'yearly':
      maxHoursBack = 24 * 365;
      break;
    default:
      maxHoursBack = 24;
  }

  return Array.from({ length: 5 }, (_, i) => ({
    id: `anomaly-${i}`,
    timestamp: generateTimestamp(Math.floor(Math.random() * maxHoursBack), baseDate),
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    description: `Detected abnormal energy consumption in ${locations[i % locations.length]}`,
    consumption: 150 + Math.random() * 100
  }));
};

const generateSuggestions = () => {
  return [
    {
      id: 'sug-1',
      type: 'warning',
      title: 'High Peak Usage Detected',
      description: 'Your energy consumption peaks between 2-4 PM. Consider load shifting to off-peak hours.',
      potentialSavings: 23.5
    },
    {
      id: 'sug-2',
      type: 'tip',
      title: 'HVAC Optimization',
      description: 'HVAC systems are running at high capacity. Adjusting temperature by 2 degrees could save energy.',
      potentialSavings: 15.2
    },
    {
      id: 'sug-3',
      type: 'alert',
      title: 'Unusual After-Hours Activity',
      description: 'Significant energy usage detected after 10 PM in Building B. Investigate potential wastage.',
      potentialSavings: 8.7
    },
    {
      id: 'sug-4',
      type: 'tip',
      title: 'Lighting Efficiency',
      description: 'Switch to LED lighting in common areas for up to 30% energy savings.',
      potentialSavings: 12.4
    },
    {
      id: 'sug-5',
      type: 'warning',
      title: 'Predictive Maintenance Required',
      description: 'Equipment in Building A showing inefficient patterns. Schedule maintenance to prevent increased consumption.',
      potentialSavings: 18.9
    }
  ];
};

export const fetchEnergyData = async (period = 'daily', selectedDate = null) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const baseDate = selectedDate ? new Date(selectedDate + 'T23:59:59') : new Date();
  return generateEnergyDataForPeriod(period, baseDate);
};

export const fetchEnergyStats = async (period = 'daily', selectedDate = null) => {
  const baseDate = selectedDate ? new Date(selectedDate + 'T23:59:59') : new Date();
  const data = generateEnergyDataForPeriod(period, baseDate);
  await new Promise(resolve => setTimeout(resolve, 600));
  return calculateStats(data);
};

export const fetchAnomalies = async (period = 'daily', selectedDate = null) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const baseDate = selectedDate ? new Date(selectedDate + 'T23:59:59') : new Date();
  return generateAnomalies(period, baseDate);
};

export const fetchSuggestions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateSuggestions();
};
