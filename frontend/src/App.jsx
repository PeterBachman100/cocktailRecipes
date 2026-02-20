import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import Navbar from './components/Navbar';
import './app.css';

const EmptyState = () => (
  <div></div>
);

function App() {
  return (
    <Router>
      <div className='App_wrapper'>
        <main className='App_content'>
          <Routes>

            {/* Main Split-view browser */}
            <Route path="/" element={<RecipeBrowser />}>
              <Route index element={<EmptyState />} />
              
              {/* View Recipe */}
              <Route path="recipe/:id" element={<RecipeDetails />} />

              {/* Recipe Editor: ADMIN ONLY */}
              <Route element={<ProtectedRoute adminOnly={true} />}>

                  {/* New Recipe */}
                  <Route path="new" element={<RecipeEditor key='new' />} />
                  
                  {/* Edit Recipe */}
                  <Route path="recipe/:id/edit" element={<RecipeEditor isEdit={true} key={window.location.pathname} />} />
              </Route>
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />

          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;