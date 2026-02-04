import { Outlet } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import './RecipeBrowser.css';

const RecipeBrowser = () => {
    return (
        <div className='browser-root'>
            <aside className='sidebar'>
                <div className='sidebar-header'>
                    <h2>Cocktail Library</h2>
                </div>
                <RecipeList />
            </aside>
            <main className='detail-view'>
                <Outlet />
            </main>
        </div>
    );
}

export default RecipeBrowser;