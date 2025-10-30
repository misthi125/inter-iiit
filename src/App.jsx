import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { LineChart } from './components/LineChart';
import { BarChart } from './components/BarChart';
import { AreaChart } from './components/AreaChart';
import { DataTable } from './components/DataTable';
import { AlertCard } from './components/AlertCard';
import { PeriodSelector } from './components/PeriodSelector';
import { DatePicker } from './components/DatePicker';
import { ChartTypeSelector } from './components/ChartTypeSelector';
import {
  fetchEnergyData,
  fetchEnergyStats,
  fetchAnomalies,
  fetchSuggestions
} from './services/mockApi';

function App() {
  const [energyData, setEnergyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dataResult, statsResult, anomaliesResult, suggestionsResult] = await Promise.all([
          fetchEnergyData(selectedPeriod, selectedDate),
          fetchEnergyStats(selectedPeriod, selectedDate),
          fetchAnomalies(selectedPeriod, selectedDate),
          fetchSuggestions()
        ]);

        setEnergyData(dataResult);
        setStats(statsResult);
        setAnomalies(anomaliesResult);
        setSuggestions(suggestionsResult);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedDate]);

  const getPeriodLabel = () => {
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    switch (selectedPeriod) {
      case 'daily':
        return formattedDate;
      case 'weekly':
        return `7 days ending ${formattedDate}`;
      case 'monthly':
        return `30 days ending ${formattedDate}`;
      case 'yearly':
        return `12 months ending ${formattedDate}`;
      default:
        return 'Current period';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Smart Energy Consumption Dashboard
              </h1>
              <p className="text-gray-600">
                AI-powered energy monitoring and predictive analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
              <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Consumption"
              value={`${stats.totalConsumption.toFixed(0)} kWh`}
              subtitle={getPeriodLabel()}
              icon={Zap}
              iconColor="bg-blue-500"
            />
            <StatCard
              title="Average Usage"
              value={`${stats.avgConsumption.toFixed(1)} kWh`}
              subtitle={`Per ${selectedPeriod === 'daily' ? 'hour' : selectedPeriod === 'weekly' ? 'day' : selectedPeriod === 'monthly' ? 'day' : 'month'}`}
              icon={Activity}
              iconColor="bg-green-500"
            />
            <StatCard
              title="Peak Consumption"
              value={`${stats.peakConsumption.toFixed(0)} kWh`}
              subtitle="Maximum recorded"
              icon={TrendingUp}
              trend={stats.trend}
              trendValue={`${stats.trend === 'up' ? '+' : stats.trend === 'down' ? '-' : ''}${Math.abs(12).toFixed(1)}%`}
              iconColor="bg-orange-500"
            />
            <StatCard
              title="Savings Potential"
              value={`${stats.savingsPotential.toFixed(0)} kWh`}
              subtitle="Estimated reduction"
              icon={AlertCircle}
              iconColor="bg-purple-500"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Energy Consumption Trends</h3>
            <ChartTypeSelector selectedType={selectedChartType} onTypeChange={setSelectedChartType} />
          </div>
          {selectedChartType === 'line' && <LineChart data={energyData} period={selectedPeriod} />}
          {selectedChartType === 'bar' && <BarChart data={energyData} period={selectedPeriod} />}
          {selectedChartType === 'area' && <AreaChart data={energyData} period={selectedPeriod} />}
        </div>

        <div className="mb-8">
          <DataTable anomalies={anomalies} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recommendations & Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <AlertCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
