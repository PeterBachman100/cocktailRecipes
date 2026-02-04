import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/api/public-recipes/${id}`);
                setRecipe(response.data);
            } catch (error) {
                console.error(error);
            } 
        };
        fetchRecipe();
    }, [id]);

    if (!recipe) return <div>Loading recipe...</div>

    let renderedSpirits = recipe.spirits.map((spirit) => <span key={spirit} style={{ color: '#c23131', backgroundColor: '#f5f3f3ff', padding: '0.25rem 0.5rem', fontWeight: '900', textTransform: 'capitalize' }}>{ spirit }</span>);
    let renderedFlavors = recipe.flavors.map((flavor) => <span style={{backgroundColor: '#f5f3f3ff', color: '#3a3a3aff', padding: '0.125rem 0.25rem', textTransform: 'capitalize'}} key={flavor}>{flavor}</span>);
    let renderedCocktailType = <span style={{textTransform: 'capitalize', color: '#5b5b5bff'}}>{recipe.cocktailType}</span>;
    let renderedSeasons = recipe.seasons.map((season) => <span key={season} style={{color: '#5b5b5bff', textTransform: 'capitalize'}}>{season}</span>);

    return (
        <div className='recipe-page'>
            <button onClick={() => navigate('/')} className='mobile-only back-button'><ArrowLeft size={20} /> Back to Library</button>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        
                <img style={{marginBottom: '0.5rem'}} src={recipe.image} />
                
                <div style={{paddingInline: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', gap: '0.25rem', borderRight: '1px solid #a09d9dff', paddingRight: '0.5rem'}}>{renderedSpirits}</div>
                    <div style={{display: 'flex', gap: '0.25rem', paddingLeft: '1rem'}}>{renderedFlavors}</div>
                    </div>
                    <div style={{display: 'flex'}}>
                    <div style={{borderRight: '1px solid #a09d9dff', paddingRight: '0.5rem'}}>{renderedCocktailType}</div>
                    <div style={{display: 'flex', gap: '0.5rem', paddingLeft: '0.5rem'}}>{renderedSeasons}</div>
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <h1 style={{textTransform: 'uppercase'}}>{recipe.title}</h1>
                    <div>{recipe.description}</div>  
                </div>
                
                <div>
                    <h2>Ingredients</h2>
                    <ul style={{marginInlineStart: '0.5rem', listStyleType: 'disc'}}>
                    {recipe.ingredients.map((ingredient) => (
                        <li style={{marginInlineStart: '1rem'}} key={ingredient.name}>{ingredient.amount} {ingredient.unit} {ingredient.name}</li>
                    ))}
                    </ul>
                </div>
                
                <div>
                    <h2>Instructions</h2>
                    <ol style={{marginInlineStart: '0.5rem'}}>
                    {recipe.steps.map((step, index) => (
                        <li style={{marginInlineStart: '1rem'}} key={index}>{step.instruction} {step.tip}</li>
                    ))}
                    </ol>
                </div>
                
                <div>{recipe.notes}</div>

                </div>

            </div>
        </div>
    );
}

export default RecipeDetails;