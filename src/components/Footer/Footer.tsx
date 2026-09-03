import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container footer-content">
        <div className="footer-brand">
          <h2>Bazzar</h2>
          <p>
            Fresh groceries, daily essentials, and healthy picks for simple
            home shopping.
          </p>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">My Page</Link>
        </div>

        <div className="footer-column">
          <h3>Company</h3>
          <span>Fresh Quality</span>
          <span>Fast Delivery</span>
        </div>
      </div>

      <p className="footer-copy">Copyright 2026 Bazzar. All rights reserved.</p>
    </footer>
  )
}

export default Footer
