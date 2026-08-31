import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { clearMember } from '../../features/auth/authSlice'
import axiosInstance from '../../lib/axios'
import './Navbar.css'

function Navbar () {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const member = useSelector((state: RootState) => state.auth.member)
   const cartCount = useSelector((state: RootState) =>
     state.cart.items.reduce((total, item) => total + item.quantity, 0)
   )

   const handleLogout = async () => {
      try {
        await axiosInstance.post('/member/logout')
      } catch (error) {
        console.log('Failed to logout:', error)
      } finally {
        dispatch(clearMember())
        navigate('/')
      }
   }

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
            {member ? (
              <>
                <span className='navbar-member'>My Page</span>
                <button type='button' className='login-btn' onClick={handleLogout}>
                   Logout
                </button>
              </>
            ) : (
              <Link to="/login" className='login-btn'>
                 Login
              </Link>
            )}
        </div>
    </nav>
   )
}

export default Navbar

