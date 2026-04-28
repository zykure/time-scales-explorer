import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatNumber } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RingData {
  label: string;
  value: number | string;
  progress: number;
  color: string;
}

interface ConcentricRingsProps {
  data?: RingData[];
}

export const ConcentricRings: React.FC<ConcentricRingsProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-500">
        No data to display
      </div>
    );
  }

  const validData = data.filter(item => item !== null && item !== undefined);

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-500">
        No valid data
      </div>
    );
  }

  // Map each ring item to a dataset object
  const datasets = validData.map((item, index) => ({
    data: [Math.max(0, Math.min(1, item.progress)), 1 - Math.max(0, Math.min(1, item.progress))],
    backgroundColor: [item.color, '#e5e7eb'],
    borderWidth: 0,
    hoverOffset: 4,
    // Optional: Add labels for tooltips if needed
    label: item.label
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const item = validData[index];
            return `${item.label}: ${item.value}`;
          }
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {datasets.map((_, idx) => {
        const scale = 1 - (idx * 0.15);

        // We need to slice the datasets array to pass only the current ring's dataset
        // because Chart.js renders ALL datasets in the chartData object.
        // To simulate concentric rings, we render multiple Doughnut charts on top of each other.
        const currentDataset = [datasets[idx]];
        const currentChartData: ChartData<'doughnut', number[], unknown> = {
          datasets: currentDataset
        };

        return (
          <div
            key={idx}
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              transform: `scale(${scale})`,
              zIndex: datasets.length - idx,
              opacity: scale > 0 ? 1 : 0
            }}
          >
            <Doughnut
              data={currentChartData}
              options={options}
              width={256}
              height={256}
            />
          </div>
        );
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {validData[validData.length - 1]?.label}
        </span>
        <span className="text-lg font-bold text-gray-800">
          {formatNumber(Number(validData[validData.length - 1]?.value), 2)}
        </span>
      </div>
    </div>
  );
};
