import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import Navbar from './components/Navbar';
import AppNavbar from './components/AppNavbar';
import './app.css';
import FolderList from './components/FolderList';


const EmptyState = () => (
  <div></div>
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
              <Route index element={<EmptyState />} />
              
              {/* Admin-only: Create a new public recipe */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="new" element={<RecipeEditor />} />
                <Route path=":id/edit" element={<RecipeEditor />} />
              </Route>

              {/* View a public recipe */}
              <Route path=":id" element={<RecipeDetails />} />
            </Route>

            {/* --- SAVED RECIPES (Private) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-recipes" element={<RecipeBrowser />}>
                <Route index element={<EmptyState />} />
                
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
            <Route path='/register' element={<Register />} />

          </Routes>
        </main>
        <AppNavbar handleFoldersVisible={handleFoldersVisible} />
      </div>
    </BrowserRouter>
  );
}

export default App;