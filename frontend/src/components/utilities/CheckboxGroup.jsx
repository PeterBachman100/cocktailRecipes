export default function CheckboxGroup({ label, name, options, selectedValues, onChange, required}) {
    return (
        <fieldset className='CheckboxGroup_root'>
            <legend><h3>{label}</h3></legend>
            <div className='CheckboxGroup_checkboxes'>
                {options.map((option) => (
                    <label key={option} className='CheckboxGroup_checkboxLabel'>
                        <input
                            type='checkbox'
                            name={name}
                            value={option}
                            checked={selectedValues.includes(option)}
                            onChange={() => onChange(name, option)}
                            required={required && selectedValues.length === 0}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}