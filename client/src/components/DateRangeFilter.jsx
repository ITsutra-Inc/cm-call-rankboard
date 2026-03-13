import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
} from 'date-fns';

const PRESETS = ['Today', 'This Week', 'This Month', 'Custom'];

function getPresetRange(preset) {
  const now = new Date();
  switch (preset) {
    case 'Today':
      return { dateFrom: startOfDay(now), dateTo: endOfDay(now) };
    case 'This Week':
      return { dateFrom: startOfWeek(now, { weekStartsOn: 1 }), dateTo: endOfDay(now) };
    case 'This Month':
      return { dateFrom: startOfMonth(now), dateTo: endOfDay(now) };
    default:
      return null;
  }
}

export default function DateRangeFilter({ onRangeChange }) {
  const [activePreset, setActivePreset] = useState('Today');
  const [customFrom, setCustomFrom] = useState(null);
  const [customTo, setCustomTo] = useState(null);

  function handlePreset(preset) {
    setActivePreset(preset);
    if (preset !== 'Custom') {
      const range = getPresetRange(preset);
      onRangeChange(range.dateFrom.toISOString(), range.dateTo.toISOString());
    }
  }

  function handleCustomApply() {
    if (customFrom && customTo) {
      onRangeChange(
        startOfDay(customFrom).toISOString(),
        endOfDay(customTo).toISOString()
      );
    }
  }

  return (
    <div className="date-filter">
      <div className="date-filter-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            className={`preset-btn ${activePreset === preset ? 'active' : ''}`}
            onClick={() => handlePreset(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      {activePreset === 'Custom' && (
        <div className="date-filter-custom">
          <DatePicker
            selected={customFrom}
            onChange={setCustomFrom}
            placeholderText="From date"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
          />
          <DatePicker
            selected={customTo}
            onChange={setCustomTo}
            placeholderText="To date"
            dateFormat="yyyy-MM-dd"
            minDate={customFrom}
            maxDate={new Date()}
          />
          <button className="preset-btn active" onClick={handleCustomApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
