import { NavLink } from 'react-router-dom';
import BadgeList from './BadgeList';

function RecipeCard({ recipe }) {
  
  return (
    <NavLink to={`/recipe/${recipe._id}`} className={({ isActive }) => `RecipeCard ${isActive ? 'active' : ''}`}>
        <article className='RecipeCard_root'>
            <div className='RecipeCard_main'>
                <img className='RecipeCard_image' src={recipe.image} alt={recipe.title} />
                <section className='RecipeCard_info'>
                    <h2 className='RecipeCard_title'>{recipe.title}</h2>
                    <BadgeList items={recipe.spirits} type="spirit" />
                    <BadgeList items={recipe.flavors} type="flavor" />
                </section>
            </div>
            <p className='RecipeCard_description'>{recipe.description}</p>
        </article>
    </NavLink>
  );
}

export default RecipeCard;

