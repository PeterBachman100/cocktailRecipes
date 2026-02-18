import React from 'react';

const SegmentedControl = ({ options, activeValue, onChange }) => {
  return (
    <div className="SegmentedControl_root">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`SegmentedControl_button ${activeValue === opt.value ? 'SegmentedControl_button--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;