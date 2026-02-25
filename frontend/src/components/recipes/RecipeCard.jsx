import { NavLink } from 'react-router-dom';
import BadgeList from './BadgeList';
import placeholderImage from '../../assets/placeholder.png';

function RecipeCard({ recipe, isPersonal }) {
  
  const path = isPersonal ? `/my-recipes/${recipe._id}` : `/recipe/${recipe._id}`;
  return (
    <NavLink to={path} className={({ isActive }) => `RecipeCard ${isActive ? 'active' : ''}`}>
        <article className='RecipeCard_root'>
            <div className='RecipeCard_main'>
                <img className='RecipeCard_image' src={recipe.image ? recipe.image : placeholderImage} alt={recipe.title} />
                <section className='RecipeCard_info'>
                    <h2 className='RecipeCard_title'>{recipe.title}</h2>
                    <BadgeList items={recipe.spirits} type="spirit" />
                    <BadgeList items={recipe.flavors} type="flavor" />
                    <p className='RecipeCard_description'>{recipe.description}</p>
                </section>
            </div>
            
        </article>
    </NavLink>
  );
}

export default RecipeCard;

