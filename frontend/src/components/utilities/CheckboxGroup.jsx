export default function CheckboxGroup({ name, options, selectedValues, onChange, required}) {
    return (
        <fieldset className='CheckboxGroup_root'>
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