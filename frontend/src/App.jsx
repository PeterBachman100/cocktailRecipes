import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import Navbar from './components/Navbar';
import AppNavbar from './components/AppNavbar';
import './app.css';
import FolderList from './components/FolderList';


const EmptyState = ({message}) => (
  <div>{message}</div>
);

function App() {

  const [foldersVisible, setFoldersVisible] = useState(false);
  const handleFoldersVisible = () => {
    setFoldersVisible(!foldersVisible);
  }

  return (
    <BrowserRouter>
      <div className='App_wrapper'>
        <Navbar />
        <main className='App_content'>
          <FolderList foldersVisible={foldersVisible} handleFoldersVisible={handleFoldersVisible} />
          <Routes>

            {/* --- PUBLIC LIBRARY --- */}
            <Route path="/recipes" element={<RecipeBrowser />}>
              <Route index element={<EmptyState message="Select a drink to see the specs!" />} />
              
              {/* Admin-only: Create a new public recipe */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="new" element={<RecipeEditor />} />
                <Route path=":id/edit" element={<RecipeEditor />} />
              </Route>

              {/* View a public recipe (must be below 'new' so it doesn't match /recipes/new) */}
              <Route path=":id" element={<RecipeDetails />} />
            </Route>

            {/* --- SAVED RECIPES (Private) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-recipes" element={<RecipeBrowser />}>
                <Route index element={<EmptyState message="You haven't saved any recipes yet!" />} />
                
                {/* Create/Edit personal recipes */}
                <Route path="new" element={<RecipeEditor />} />
                <Route path=":id/edit" element={<RecipeEditor />} />
                
                {/* View a personal recipe */}
                <Route path=":id" element={<RecipeDetails />} />
              </Route>
            </Route>


            {/* --- GLOBAL REDIRECTS & AUTH --- */}
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </main>
        <AppNavbar handleFoldersVisible={handleFoldersVisible} />
      </div>
    </BrowserRouter>
  );
}

export default App;