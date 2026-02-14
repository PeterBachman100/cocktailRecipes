import Fraction from 'fraction.js';

function Ingredient ({ name, amount, unit }) {
  // 1. Format the Number (using Fraction.js)
  const getDisplayAmount = (amount, unit) => {
    if (unit === 'top') return '';
    const displayAmount = new Fraction(amount).simplify(0.01).toFraction(true);
    return (<span className="Ingredient_amount">{displayAmount}</span>);
  }
  // 2. Handle Plurals
  const getDisplayUnit = (u, qty) => {
    if (u === 'count') return ''; // Hide the word "count"
    if (u === 'top') return (<span className="Ingredient_unit">To top:</span>);
    
    // If the amount is 1 or less (like 1/2), keep it singular
    if (qty <= 1) return <span className="Ingredient_unit">{u}</span>;

    // Simple Plural Mapping
    const plurals = {
      'dash': 'dashes',
      'glass': 'glasses',
      'part': 'parts',
      'barspoon': 'barspoons',
      'tsp': 'tsps',
      'tbsp': 'tbsps'
    };

    return (
        <span className="Ingredient_unit">
            {plurals[u] || u}
        </span>
    );
  };

  return (
    <div className="Ingredient_item">
      {getDisplayAmount(amount, unit)}
      {getDisplayUnit(unit, amount)}
      <span className="Ingredient_name">{name}</span>
    </div>
  );
};

export default Ingredient;