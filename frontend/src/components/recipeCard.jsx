import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Leaf, HeartPlus, Folder } from 'lucide-react';


function RecipeCard({ recipeId }) {
  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/public-recipes/${recipeId}`);
        setRecipe(response.data);
        setLoading(false);
        console.group(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipe();
  }, []);

  if (loading) return <p>Loading</p>;

  let renderedSpirits = recipe.spirits.map((spirit) => <span key={spirit} style={{textTransform: 'uppercase', fontSize: '0.75rem', backgroundColor: '#fdcc82ff', color: '#373737ff', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{ spirit }</span>);
  let renderedFlavors = recipe.flavors.map((flavor) => <span style={{textTransform: 'capitalize', fontWeight: '500'}} key={flavor}><Leaf size={12} color='#499144ff' strokeWidth={3} /> {flavor}</span>);
  
  return (
    <div style={{display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', borderRadius: '1rem', boxShadow: '#5a5a6e33 0px 7px 29px 0px', backgroundColor: '#f7f7f7ff'}}>  
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', width: '100%'}}>
            <img style={{width: '100%', borderRadius: '5%'}} src={recipe.image} />
            <div style={{padding: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <h2 style={{textTransform: 'uppercase', fontSize: '1.5rem', fontWeight: '400', fontFamily: 'sans-serif', letterSpacing: '1.5px', lineHeight: '90%'}}>{recipe.title}</h2>
                <div style={{display: 'flex', gap: '0.5rem'}}>{renderedSpirits}</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>{renderedFlavors}</div>  
            </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', gap: '0.5rem'}}>
            <div style={{fontWeight: '100', color: '#5b5a5aff', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '3', overflow: 'hidden'}}>{recipe.description}</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}><HeartPlus size={20} /><Folder size={20} /></div>
        </div>
    </div>
  );
}

export default RecipeCard;

