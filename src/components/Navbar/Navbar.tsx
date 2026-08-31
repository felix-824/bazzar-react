import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import './Navbar.css'

function Navbar () {
   const cartCount = useSelector((state: RootState) =>
     state.cart.items.reduce((total, item) => total + item.quantity, 0)
   )

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
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/login" className='login-btn'>
               Login
            </Link>
        </div>
    </nav>
   )
}

export default Navbar

