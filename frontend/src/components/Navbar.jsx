import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CirclePlus, BookMarked, Folder} from 'lucide-react';

const Navbar = ({handleFoldersVisible}) => {
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
                            <Link to='/recipes/new' className='Navbar_link'>
                                <CirclePlus size={16} />
                            </Link>
                        )}

                        <button className='Navbar_link' onClick={handleFoldersVisible}>
                            <Folder size={16} />
                        </button>

                        <Link to='/my-recipes' className='Navbar_link'>
                            <BookMarked size={16} />
                        </Link>
                        
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