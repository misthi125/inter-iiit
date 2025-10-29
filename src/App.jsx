import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { LineChart } from './components/LineChart';
import { DonutChart } from './components/DonutChart';
import { DataTable } from './components/DataTable';
import { AlertCard } from './components/AlertCard';
import { PeriodSelector } from './components/PeriodSelector';
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dataResult, statsResult, anomaliesResult, suggestionsResult] = await Promise.all([
          fetchEnergyData(selectedPeriod),
          fetchEnergyStats(selectedPeriod),
          fetchAnomalies(),
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
  }, [selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'daily':
        return 'Last 24 hours';
      case 'weekly':
        return 'Last 7 days';
      case 'monthly':
        return 'Last 30 days';
      case 'yearly':
        return 'Last 12 months';
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Energy Consumption Dashboard
            </h1>
            <p className="text-gray-600">
              AI-powered energy monitoring and predictive analytics
            </p>
          </div>
          <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LineChart data={energyData} title="Energy Consumption Trends" period={selectedPeriod} />
          </div>
          <div>
            <DonutChart data={energyData} title="Consumption by Device" />
          </div>
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
