const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ENUMS = { 
    spirits: ['whiskey', 'bourbon', 'rye', 'scotch', 'rum', 'vodka', 'tequila / mezcal', 'cognac', 'brandy', 'gin', 'fortified wine', 'liqueur', 'other'], 
    cocktailType: ['classic', 'modern classic', 'tiki & tropical', 'coffee & dessert', 'shots & shooters', 'punches', 'other'], 
    flavors: ['bitter', 'sweet', 'savory', 'sour', 'spiced', 'fruity', 'smoky', 'herbal'], 
    units: ['oz', 'ml', 'g', 'tsp', 'tbsp', 'dash', 'drop', 'barspoon', 'part', 'count', 'top', 'garnish', 'pinch'] 
};

const IngredientSchema = new Schema({ 
    name: { type: String, required: true, trim: true }, 
    amount: { type: Number, required: true, min: 0 }, 
    unit: { type: String, enum: ENUMS.units, required: true } 
}); 

const StepSchema = new Schema({ 
    instruction: { type: String, required: true }, 
    tip: { type: String, default: "" } 
});

const recipe = {
  title: { type: String, required: true, trim: true },
  description: { type: String },
  ingredients: [IngredientSchema],
  steps: [StepSchema],
  notes: { type: String },
  spirits: [{ type: String, enum: ENUMS.spirits }],
  cocktailType: { type: String, enum: ENUMS.cocktailType },
  flavors: [{ type: String, enum: ENUMS.flavors }],
  image: { type: String },
  cloudinaryId: { type: String }
};

module.exports = { recipe, ENUMS };