import { Outlet, useParams } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';

const RecipeBrowser = () => {
    const { id } = useParams();
    const isFullWidth = !id;

    return (
        <div className={`RecipeBrowser_root ${isFullWidth ? 'RecipeBrowser--full' : 'RecipeBrowser--split'}`}>
            <aside className='RecipeBrowser_sidebar'>
                <RecipeList viewMode={isFullWidth ? 'grid' : 'list'} />
            </aside>
            <main className='RecipeBrowser_main'>
                <Outlet />
            </main>
        </div>
    );
}

export default RecipeBrowser;