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
            <div className='Navbar_container'>
                <Link to='/' className='Navbar_logo'>
                    <GlassWater size={24} className='Navbar_icon' />
                    <span className='Navbar_brand'>Cocktail Recipes</span>
                </Link>

                <div className='Navbar_actions'>
                    {user ? (
                        <>
                            {isAdmin && (
                                <Link to='/admin/add-recipe' className='Navbar_link'>
                                    <Settings size={20} />
                                    <span className='Navbar_label'>Add Recipe</span>
                                </Link>
                            )}
                            <div className='Navbar_user'>
                                <User size={20} />
                                <span>{user.username}</span>
                            </div>
                            <button onClick={handleLogout} className='Navbar_logoutBtn'>
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to='/login' className='Navbar_loginLink'>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;