import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { setMember } from '../features/auth/authSlice';
import axiosInstance from '../lib/axios';
import Cart from '../pages/Cart/Cart';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Orders from '../pages/Orders/Orders';
import Profile from '../pages/Profile/Profile';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Products from '../pages/Products/Products';
import type { Member } from '../types/member';
import '../App.css';

function getMemberFromResponse(data: unknown): Member | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  if ('memberNick' in data && '_id' in data) {
    return data as Member;
  }

  if ('member' in data) {
    const responseData = data as { member?: Member };

    return responseData.member || null;
  }

  return null;
}

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const shouldShowFooter = location.pathname !== '/login';

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axiosInstance.get('/member/detail');
        const member = getMemberFromResponse(response.data);

        if (member) {
          dispatch(setMember(member));
        }
      } catch (error) {
        console.log('No active member session:', error);
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <Routes>
          <Route path='/'element={<Home />}  />

          <Route path='/products' element={<Products />} />

          <Route path='/products/:id' element={<ProductDetail />} />

          <Route path='/cart' element={<Cart />} />

          <Route path='/login' element={<Login />} />

          <Route path='/orders' element={<Orders />} />

          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>

      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
