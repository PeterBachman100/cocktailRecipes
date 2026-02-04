import { Outlet } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';

const RecipeBrowser = () => {
    return (
        <div className='RecipeBrowser_root'>
            <aside className='RecipeBrowser_sidebar'>
                <RecipeList />
            </aside>
            <main className='RecipeBrowser_main'>
                <Outlet />
            </main>
        </div>
    );
}

export default RecipeBrowser;