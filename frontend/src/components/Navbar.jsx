import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassWater, LogOut, User, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className='Navbar_root'>
            <Link to='/' className='Navbar_link'>
                <span>Cocktail Library</span>
            </Link>
            <div className='Navbar_actions'>
                {user ? (
                    <>
                        {isAdmin && (
                            <Link to='/admin/add-recipe' className='Navbar_link'>
                                <span className='Navbar_label'>Add Recipe</span>
                            </Link>
                        )}
                        <div className='Navbar_user'>
                            <span>{user.username}</span>
                            <button onClick={handleLogout} className='Navbar_logoutBtn'>
                                <LogOut size={16} />
                            </button>
                        </div>
                        
                    </>
                ) : (
                    <Link to='/login' className='Navbar_loginLink'>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;