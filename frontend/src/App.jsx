import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import './app.css';

const EmptyState = () => (
  <div className="empty-msg">Select a drink to see the recipe</div>
);

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;