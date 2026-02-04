import { NavLink } from 'react-router-dom';
import Badge from './Badge';

function RecipeCard({ recipe }) {

  let renderedSpirits = recipe.spirits.map((spirit) => <Badge key={spirit} type="spirit">{spirit}</Badge>);
  let renderedFlavors = recipe.flavors.map((flavor) => <Badge key={flavor} type="flavor">{flavor}</Badge>);
  
  return (
    <NavLink to={`/recipe/${recipe._id}`} className={({ isActive }) => `recipe-card ${isActive ? 'active' : ''}`}>
    <div 
        style={{
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1rem', 
        gap: '1rem', 
        borderRadius: '1rem', 
        boxShadow: '#5a5a6e33 0px 7px 29px 0px', 
        backgroundColor: '#f7f7f7ff'
    }}>  
        <div style={{
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr', 
            gap: '0.5rem', 
            width: '100%'
        }}>
            <div style={{position: 'relative'}}>
                <img style={{width: '100%', borderRadius: '5%'}} src={recipe.image} />
            </div>
            <div style={{
                padding: '0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '0.5rem'
            }}>
                <h2 style={{
                    textTransform: 'uppercase', 
                    fontSize: '1.5rem', 
                    fontWeight: '400', 
                    fontFamily: 'sans-serif',
                    letterSpacing: '1.5px', 
                    lineHeight: '90%'
                }}>
                    {recipe.title}
                </h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap', 
                    gap: '0.5rem'
                }}>
                    {renderedSpirits}
                </div>
                <div style={{
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem'
                }}>
                    {renderedFlavors}
                </div>  
            </div>
        </div>
        <div style={{
            display: 'flex', 
            gap: '0.5rem'
        }}>
            <div style={{
                fontWeight: '100', 
                color: '#5b5a5aff', 
                display: '-webkit-box', 
                WebkitBoxOrient: 'vertical', 
                WebkitLineClamp: '3', 
                overflow: 'hidden'
            }}>
                {recipe.description}
            </div>
        </div>
    </div>
    </NavLink>
  );
}

export default RecipeCard;

