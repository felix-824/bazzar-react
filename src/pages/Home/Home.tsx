import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import type { RootState } from '../../app/store'
import groceryHero from '../../assets/grocery-hero.png'
import ProductCard from '../../components/ProductCard/ProductCard'
import { setProducts } from '../../features/products/productSlice'
import axiosInstance from '../../lib/axios'
import { ProductCollection } from '../../types/product'
import './Home.css'

const categories = [
  {
    title: 'Fruits & Vegetables',
    value: ProductCollection.FRUIT_VEGETABLE,
    icon: '🥬',
  },
  {
    title: 'Meat',
    value: ProductCollection.MEAT,
    icon: '🥩',
  },
  {
    title: 'Dairy',
    value: ProductCollection.DAIRY,
    icon: '🥛',
  },
  {
    title: 'Bakery',
    value: ProductCollection.BAKERY,
    icon: '🥖',
  },
  {
    title: 'Beverages',
    value: ProductCollection.BEVERAGE,
    icon: '🧃',
  },
  {
    title: 'Snacks',
    value: ProductCollection.SNACK,
    icon: '🍿',
  },
]

const newsArticles = [
  {
    date: 'May 12, 2026',
    title: 'How to Keep Fresh Greens Crisp for Longer',
    text: 'Simple storage habits can help leafy vegetables stay fresh through the week.',
    icon: '🥗',
    className: 'news-vegetables',
  },
  {
    date: 'May 18, 2026',
    title: 'Easy Breakfast Ideas with Fresh Dairy',
    text: 'Build quick morning meals with milk, yogurt, bread, and seasonal fruit.',
    icon: '🥛',
    className: 'news-breakfast',
  },
  {
    date: 'May 24, 2026',
    title: 'Smart Grocery Planning for Busy Families',
    text: 'Plan a balanced weekly basket with fresh produce, bakery items, and snacks.',
    icon: '🛒',
    className: 'news-delivery',
  },
]

const benefits = [
  {
    title: 'Fresh Quality',
    text: 'Carefully selected groceries',
    icon: '✓',
  },
  {
    title: 'Fast Delivery',
    text: 'Quick service to your door',
    icon: '🚚',
  },
  {
    title: 'Best Price',
    text: 'Good value every week',
    icon: '🏷',
  },
  {
    title: 'Customer Support',
    text: 'Friendly help when needed',
    icon: '🎧',
  },
]

function Home() {
  const dispatch = useDispatch()

  const products = useSelector(
    (state: RootState) => state.products.products
  )

  const featuredProducts = products.slice(0, 4)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products')

        dispatch(setProducts(response.data))
      } catch (error) {
        console.log('Failed to fetch featured products:', error)
      }
    }

    fetchProducts()
  }, [dispatch])

  return (
    <>
      <main className="home">
        <section className="hero">
          <div className="home-container hero-container">
            <div className="hero-content">
              <p className="hero-subtitle">Fresh & Healthy</p>

              <h1>Fresh groceries delivered to your door</h1>

              <p className="hero-description">
                Shop fresh fruits, vegetables, bakery favorites, dairy, drinks,
                and everyday groceries from Bazzar.
              </p>

              <Link to="/products" className="home-btn">
                Shop Now
              </Link>
            </div>

            <div className="hero-image">
              <img src={groceryHero} alt="Fresh groceries" />
            </div>
          </div>
        </section>

        <section className="home-section categories">
          <div className="home-container">
            <div className="section-heading">
              <p>Browse Categories</p>
              <h2>Shop by Category</h2>
            </div>

            <div className="category-list">
              {categories.map((category) => (
                <Link
                  key={category.value}
                  to={`/products?category=${category.value}`}
                  className="category-card"
                >
                  <span>{category.icon}</span>
                  <h3>{category.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section featured-products">
          <div className="home-container">
            <div className="section-top">
              <div className="section-heading section-heading-left">
                <p>Fresh Picks</p>
                <h2>Featured Products</h2>
              </div>

              <Link to="/products" className="home-outline-btn">
                View All Products
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="featured-product-list">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="home-empty">No featured products found.</p>
            )}
          </div>
        </section>

        <section className="home-section fresh-news">
          <div className="home-container">
            <div className="section-heading">
              <p>Fresh News</p>
              <h2>Tips for Better Grocery Days</h2>
            </div>

            <div className="news-list">
              {newsArticles.map((article) => (
                <article className="news-card" key={article.title}>
                  <div className={`news-card-visual ${article.className}`}>
                    <span>{article.icon}</span>
                  </div>

                  <div className="news-card-body">
                    <p>{article.date}</p>
                    <h3>{article.title}</h3>
                    <span>{article.text}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="discount-section">
          <div className="home-container">
            <div className="discount-banner">
              <div>
                <p>Special Discount</p>
                <h2>Fresh Deals This Week</h2>
                <span>Save up to 20% on selected fresh products.</span>
              </div>

              <div className="discount-visual" aria-hidden="true">
                <span>🥬</span>
                <span>🍎</span>
                <span>🥖</span>
              </div>

              <Link to="/products" className="home-btn">
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="home-container benefits-list">
            {benefits.map((benefit) => (
              <div className="benefit-item" key={benefit.title}>
                <span>{benefit.icon}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="home-container footer-content">
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
            <span>Cart</span>
          </div>

          <div className="footer-column">
            <h3>Account</h3>
            <span>Login</span>
            <span>My Orders</span>
            <span>My Profile</span>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <span>Fresh Quality</span>
            <span>Fast Delivery</span>
            <span>Customer Support</span>
          </div>
        </div>

        <p className="footer-copy">Copyright 2026 Bazzar. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Home
