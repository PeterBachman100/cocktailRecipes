import SegmentedControl from '../utilities/SegmentedControl';

const RecipeFilter = ({ filters, updateField, toggleArrayItem, resetFilters }) => {
  
  const SPIRITS = ["Whiskey", "Bourbon", "Rye", "Scotch", "Rum", "Vodka", "Tequila / Mezcal", "Cognac", "Brandy", "Gin", "Liqueur", "Fortified Wine", "Other"];
  const FLAVORS = ['Bitter', 'Sweet', 'Savory', 'Sour', 'Spiced', 'Fruity', 'Smoky', 'Herbal'];
  const TYPES = ["Classic", "Modern Classic", "Tiki & Tropical", "Coffee & Dessert", "Shots & Shooters", "Punches", "Other"];

  return (
    <div className="RecipeFilter_root">
      <div className='RecipeFilter_header'>
        <h2 className='RecipeFilter_heading'>Filter & Search</h2>
        <button onClick={resetFilters} className='RecipeFilter_buttonReset'>Reset Filters</button>
      </div>
      {/* Text Search */}
      <section className='RecipeFilter_search'>
        <label htmlFor="search" className='RecipeEditor_sectionTitle'>Keywords</label>
        <input
          id="search"
          type="text"
          placeholder="Ingredients, titles..."
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
        />
      </section>
      <div className='RecipeFilter_main'>
        {/* Spirits Filter */}
        <section className='RecipeFilter_section'>
          <div className='RecipeFilter_sectionHeader'>
            <h3 className='RecipeFilter_sectionTitle'>Spirits</h3>
            <SegmentedControl 
              activeValue={filters.spiritsMatch}
              onChange={(val) => updateField('spiritsMatch', val)}
              options={[
                { label: 'Any', value: 'any' },
                { label: 'All', value: 'all' }
              ]}
            />
          </div>
          <div className='RecipeFilter_sectionList'>
            {SPIRITS.map((spirit) => (
              <div key={spirit} className='RecipeFilter_checkbox'>
                <input
                  type="checkbox"
                  id={`spirit-${spirit}`}
                  checked={filters.spirits.includes(spirit)}
                  onChange={() => toggleArrayItem('spirits', spirit)}
                />
                <label htmlFor={`spirit-${spirit}`}>{spirit}</label>
              </div>
            ))}
          </div>
        </section>

        {/* Flavors Filter */}
        <section className='RecipeFilter_section'>
          <div className='RecipeFilter_sectionHeader'>
            <h3 className='RecipeFilter_sectionTitle'>Flavors</h3>
            <SegmentedControl 
              activeValue={filters.flavorsMatch}
              onChange={(val) => updateField('flavorsMatch', val)}
              options={[
                { label: 'Any', value: 'any' },
                { label: 'All', value: 'all' }
              ]}
            />
          </div>
          <div className='RecipeFilter_sectionList'>
            {FLAVORS.map((flavor) => (
              <div key={flavor} className='RecipeFilter_checkbox'>
                <input
                  type="checkbox"
                  id={`flavor-${flavor}`}
                  checked={filters.flavors.includes(flavor)}
                  onChange={() => toggleArrayItem('flavors', flavor)}
                />
                <label htmlFor={`flavor-${flavor}`}>{flavor}</label>
              </div>
            ))}
          </div>
        </section>

        {/* Cocktail Type Filter */}
        <section className='RecipeFilter_section'>
          <div className='RecipeFilter_sectionHeader'>
            <h3 className='RecipeFilter_sectionTitle'>Cocktail Type</h3>
          </div>
          <div className='RecipeFilter_sectionList'>
            {TYPES.map((type) => (
              <div key={type} className='RecipeFilter_checkbox'>
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={filters.cocktailType.includes(type)}
                  onChange={() => toggleArrayItem('cocktailType', type)}
                />
                <label htmlFor={`type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeFilter;