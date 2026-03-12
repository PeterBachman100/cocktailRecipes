import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/recipes');
    }

    return (
        <nav className='Navbar_root'>
            <Link to='/recipes' className='Navbar_link Navbar_logo'>
                <span>Tippl</span>
            </Link>
            {user ? 
                (
                    <button onClick={handleLogout} className='Navbar_link'>
                        <User size={20} />
                        <span>Logout</span>
                    </button>
                ) : 
                (
                    <Link to='/login' className='Navbar_link'>
                        <User size={20} />
                        <span>Login</span>
                    </Link>
                )
            }
        </nav>
    );
};

export default Navbar;