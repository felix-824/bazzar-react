import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/'element={<Home />}  />

        <Route path='/products' element={<Products />} />
      </Routes>
    </>
  );
}

export default App;
