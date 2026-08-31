import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Home from '../pages/Home/Home';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Products from '../pages/Products/Products';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/'element={<Home />}  />

        <Route path='/products' element={<Products />} />

        <Route path='/products/:id' element={<ProductDetail />} />
      </Routes>
    </>
  );
}

export default App;
