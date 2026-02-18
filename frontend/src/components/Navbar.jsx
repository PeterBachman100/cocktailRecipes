import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Martini, Citrus, Sparkles, LogOut, CirclePlus} from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className='Navbar_root'>
            <Link to='/' className='Navbar_link Navbar_logo' style={{position: 'relative'}}>
                <span>Tippl</span>
            </Link>
            <div className='Navbar_actions'>
                {user ? (
                    <>
                        {isAdmin && (
                            <Link to='/admin/add-recipe' className='Navbar_link'>
                                <CirclePlus size={16} />
                            </Link>
                        )}
                        
                        <button onClick={handleLogout} className='Navbar_link'>
                            <LogOut size={16} />
                        </button>
                      
                        
                    </>
                ) : (
                    <Link to='/login' className='Navbar_loginLink'>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;