import Fraction from 'fraction.js';

function Ingredient ({ name, amount, unit }) {
  
  const getDisplayAmount = (amount, unit) => {
    if (unit === 'top') return (<span className="Ingredient_amount"></span>);
    const displayAmount = new Fraction(amount).simplify(0.01).toFraction(true);
    return (<span className="Ingredient_amount">{displayAmount}</span>);
  }
  
  const getDisplayUnit = (u, qty) => {
    if (u === 'count') return (<span className="Ingredient_unit"></span>);
    if (u === 'top') return (<span className="Ingredient_unit">To top:</span>);
    if (u === 'garnish') return (<span className='Ingredient_unit'>garnish</span>);
    
    if (qty <= 1) return <span className="Ingredient_unit">{u}</span>;

    
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