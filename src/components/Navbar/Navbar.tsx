import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { clearMember } from '../../features/auth/authSlice'
import axiosInstance from '../../lib/axios'
import './Navbar.css'

const API_URL = 'http://localhost:3001'

function getMemberImageUrl(image?: string) {
   if (!image) {
      return ''
   }

   if (image.startsWith('http')) {
      return image
   }

   if (image.startsWith('/')) {
      return `${API_URL}${image}`
   }

   return `${API_URL}/${image}`
}

function Navbar () {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const member = useSelector((state: RootState) => state.auth.member)
   const cartCount = useSelector((state: RootState) =>
     state.cart.items.reduce((total, item) => total + item.quantity, 0)
   )
   const memberImageUrl = getMemberImageUrl(member?.memberImage)

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
     <header className='site-header'>
       <div className='top-info-bar'>
          <span>Fresh groceries, happy life.</span>
          <span>Simple ordering for everyday products</span>
       </div>

     <nav className='navbar'>

        <Link to="/" className='navbar-logo'>
           Bazzar
        </Link>

        <div className='navbar-menu'>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/#categories">Categories</Link>
            <Link to="/#about">About Us</Link>
        </div>

          <div className='navbar-actions'>
            <Link to="/products" className='navbar-search' aria-label='Search products'>
              Search
            </Link>
            <Link to="/cart" className='navbar-cart'>
              <span className='navbar-cart-icon'>Cart</span>
              <span className='navbar-cart-badge'>{cartCount}</span>
            </Link>
            {member ? (
              <>
                <Link to="/profile" className='navbar-avatar'>
                  {memberImageUrl ? (
                    <img src={memberImageUrl} alt={member.memberNick} />
                  ) : (
                    member.memberNick.charAt(0).toUpperCase()
                  )}
                </Link>
                <Link to="/orders">My Orders</Link>
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
     </header>
   )
}

export default Navbar

