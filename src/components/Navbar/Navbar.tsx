import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar () {
   return(
     <nav className='navbar'>

        <Link to="/" className='navbar-logo'>
           Bazzar
        </Link>

        <div className='navbar-menu'>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
        </div>

          <div className='navbar-actions'>
            <Link to="/cart">Cart</Link>
            <Link to="/login" className='login-btn'>
               Login
            </Link>
        </div>
    </nav>
   )
}

export default Navbar

