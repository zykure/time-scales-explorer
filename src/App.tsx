import { cache, useState, useEffect, useCallback } from 'react';
import { DatePicker, type ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { DateTime } from 'luxon';
import { calculateTimeDiff, calculateStandardScales, calculateAstronomicalScales } from './utils/calculations';
import { formatNumber, formatDate } from './utils/formatters';
import { type TimeScale } from './types/timeScales';
//import { ConcentricRings } from './components/ConcentricRings';
//import { ScaleCard } from './components/ScaleCards';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'

function App() {

  const defaultStartDate = new Date('1986-04-26T01:23:00+0400');  // use a significant date as default

  const [startDateInput, setStartDateInput] = useState<Date | null>(defaultStartDate);
  const [endDateInput, setEndDateInput] = useState<Date | null>(null);

  const [startMonthOffset, setStartMonthOffset] = useState(0);
  const [startDayOffset, setStartDayOffset] = useState(0);
  const [startHourOffset, setStartHourOffset] = useState(0);
  const [endMonthOffset, setEndMonthOffset] = useState(0);
  const [endDayOffset, setEndDayOffset] = useState(0);
  const [endHourOffset, setEndHourOffset] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    standard: TimeScale[];
    astronomical: TimeScale[];
  } | null>(null);

  const getEffectiveDate = (inputVal: Date | null, offsetMonths: number, offsetDays: number, offsetHours: number): Date => {
    let base: DateTime;
    if (inputVal) {
      base = DateTime.fromJSDate(inputVal);
    } else {
      base = DateTime.now();
    }
    return base.plus({ months: offsetMonths, days: offsetDays, hours: offsetHours }).toJSDate();
  }

  const getStandardScales = cache(calculateStandardScales);
  const getAstronomicalScales = cache(calculateAstronomicalScales);

  // Memorize the calculation function so it doesn't recreate every render
  const performCalculation = useCallback(() => {
    try {
      const startDate = getEffectiveDate(startDateInput, startMonthOffset, startDayOffset, startHourOffset);
      const endDate = getEffectiveDate(endDateInput, endMonthOffset, endDayOffset, endHourOffset);

      console.log('[App] start/end date is: ', startDate ? startDate.toString() : 'null', ' - ', endDate ? endDate.toString() : 'null');
      const { milliseconds, interval } = calculateTimeDiff(startDate, endDate);

      const standard = getStandardScales(milliseconds, interval.start, interval.end);
      const astronomical = getAstronomicalScales(milliseconds, interval.start, interval.end);

      setResult({
        standard,
        astronomical,
      });
    } catch (err) {
      console.error('Calculation error:', err);
    }
  }, [
    startDateInput,
    startMonthOffset,
    startDayOffset,
    startHourOffset,
    endMonthOffset,
    endDateInput,
    endDayOffset,
    endHourOffset
  ]);

  useEffect(() => {
    console.log('[App] Mounting - Starting initial calc and timer');

    // Perform initial calculation
    performCalculation();

    // Start the timer immediately (don't wait for result state to update)
    const intervalId = setInterval(() => {
      performCalculation();
    }, 1000);

    // Cleanup
    return () => {
      console.log('[App] Cleaning up timer');
      clearInterval(intervalId);
    };
  }, [performCalculation]); // Runs ONCE on mount

  // Handlers for Sliders
  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartMonthOffset(Number(e.target.value));
  };

  const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDayOffset(Number(e.target.value));
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartHourOffset(Number(e.target.value));
  };

  const handleStartMonthReset = () => {
    setStartMonthOffset(0);
  };

  const handleStartDayReset = () => {
    setStartDayOffset(0);
  };

  const handleStartHourReset = () => {
    setStartHourOffset(0);
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndMonthOffset(Number(e.target.value));
  };

  const handleEndDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDayOffset(Number(e.target.value));
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndHourOffset(Number(e.target.value));
  };

  const handleEndMonthReset = () => {
    setEndMonthOffset(0);
  };

  const handleEndDayReset = () => {
    setEndDayOffset(0);
  };

  const handleEndHourReset = () => {
    setEndHourOffset(0);
  };

  // Handlers for Inputs
  const handleStartInput = (e: Date) => {
    setStartDateInput(e || null);
    setStartDayOffset(0); // Reset offsets when manually typing
    setStartHourOffset(0);
  };

  const handleEndInput = (e: Date) => {
    setEndDateInput(e || null);
    setEndDayOffset(0);
    setEndHourOffset(0);
  };

  // Helper to format the "Current Effective Date" for display
  const formatEffectiveDate = (dt: Date) => {
    return DateTime.fromJSDate(dt).toLocaleString(DateTime.DATETIME_FULL);
  };

  function range(start: number, end: number, step = 1): number[] {
    return Array.from(
      { length: (end - start) / step + 1 },
      (_, i) => start + i * step,
    );
  }

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  const YEARS = range(1900, (new Date()).getFullYear() + 1, 1) as number[];

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {"<"}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(+value)}
      >
        {YEARS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={MONTHS[date.getMonth()]}
        onChange={({ target: { value } }) =>
          changeMonth(MONTHS.indexOf(value as (typeof MONTHS)[number]))
        }
      >
        {MONTHS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {">"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Time Scales Explorer</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

        {/* --- INPUT SECTION --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">

            {/* START DATE */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Start Date</label>
              <DatePicker
              showIcon showTimeSelect closeOnScroll isClearable
              selected={startDateInput}
              onChange={(date) => handleStartInput(date)}
              dateFormat="YYYY-MM-dd HH:mm:ss"
              className="w-full p-2 border rounded"
              renderCustomHeader={CustomHeader}
              />
              <div className="text-xs text-gray-500 italic">
                Effective: {formatEffectiveDate(getEffectiveDate(startDateInput, startMonthOffset, startDayOffset, startHourOffset))}
              </div>

              {/* SLIDERS FOR START DATE */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-60 Months</span>
                    <span>Offset: {startMonthOffset} months</span>
                    <span>+60 Months</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={startMonthOffset}
                    onChange={handleStartMonthChange}
                    onDoubleClick={handleStartMonthReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-30 Days</span>
                    <span>Offset: {startDayOffset} days</span>
                    <span>+30 Days</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={startDayOffset}
                    onChange={handleStartDayChange}
                    onDoubleClick={handleStartDayReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-24 Hours</span>
                    <span>Offset: {startHourOffset} hours</span>
                    <span>+24 Hours</span>
                  </div>
                  <input
                    type="range"
                    min="-24"
                    max="24"
                    value={startHourOffset}
                    onChange={handleStartHourChange}
                    onDoubleClick={handleStartHourReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* END DATE */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">End Date</label>
              <DatePicker
                showIcon showTimeSelect closeOnScroll isClearable
                selected={endDateInput}
                onChange={(date) => handleEndInput(date)}
                dateFormat="YYYY-MM-dd HH:mm:ss"
                className="w-full p-2 border rounded"
                renderCustomHeader={CustomHeader}
                />
              <div className="text-xs text-gray-500 italic">
                Effective: {formatEffectiveDate(getEffectiveDate(endDateInput, endMonthOffset, endDayOffset, endHourOffset))}
              </div>

              {/* SLIDERS FOR END DATE */}
              <div className="space-y-3 pt-2">
                                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-60 Months</span>
                    <span>Offset: {endMonthOffset} months</span>
                    <span>+60 Months</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={endMonthOffset}
                    onChange={handleEndMonthChange}
                    onDoubleClick={handleEndMonthReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-30 Days</span>
                    <span>Offset: {endDayOffset} days</span>
                    <span>+30 Days</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={endDayOffset}
                    onChange={handleEndDayChange}
                    onDoubleClick={handleEndDayReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>-24 Hours</span>
                    <span>Offset: {endHourOffset} hours</span>
                    <span>+24 Hours</span>
                  </div>
                  <input
                    type="range"
                    min="-24"
                    max="24"
                    value={endHourOffset}
                    onChange={handleEndHourChange}
                    onDoubleClick={handleEndHourReset}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RESULTS SECTION --- */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Standard */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Time Breakdown</h2>
              <div className="space-y-2">
                <h3>Casual</h3>
                {result.standard.map(scale => (
                  <div key={scale.id} className="grid grid-cols-4 gap-4 justify-between py-1 border-b">
                    <span className="text-left">{scale.label}</span>
                    <span className="text-right font-mono">
                      {formatNumber(Number(scale.value), scale.id === 'distance' ? 2 : 0)}
                    </span>
                    <span className="text-left font-mono">
                      {' '}
                      <span className="text-gray-500 text-sm">{scale.unit}</span>
                    </span>
                    <span></span>
                  </div>
                ))}

                {/* Astronomical */}
                <h3>Astronomical</h3>
                {result.astronomical.map(scale => (
                  <div key={scale.id} className="grid grid-cols-4 gap-4 justify-between py-1 border-b">
                    <span className="text-left">{scale.label}</span>
                    <span className="text-right font-mono">
                      {formatNumber(Number(scale.value), (scale.value != Math.floor(scale.value)) ? (scale.value < 1 ? 2 : 1) : 0)}
                    </span>
                    <span className="text-left font-mono">
                      {' '}
                      <span className="text-gray-500 text-sm">{scale.unit}</span>
                    </span>
                    <span className="text-right text-gray-500 text-sm">{scale.last != null ? 'Last: ' + formatDate(scale.last) : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
