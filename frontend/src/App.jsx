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
        <Navbar />
        <main className='App_content'>
          <Routes>
            {/* Main Split-view browser */}
            <Route path="/" element={<RecipeBrowser />}>
              <Route index element={<EmptyState />} />
              <Route path="recipe/:id" element={<RecipeDetails />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/add-recipe" element={<RecipeEditor />} />
            </Route>

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;