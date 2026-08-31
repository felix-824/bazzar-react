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
    title: 'Vegetables',
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
    title: 'Quality Products',
    text: 'Fresh products selected with care.',
    icon: '🛡',
  },
  {
    title: 'Fast Delivery',
    text: 'Get your order delivered quickly.',
    icon: '🚚',
  },
  {
    title: 'Best Prices',
    text: 'Fair prices for everyday groceries.',
    icon: '🏷',
  },
  {
    title: 'Customer Support',
    text: 'We are here to help anytime.',
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
              <h1>Fresh groceries delivered to your door</h1>

              <p className="hero-description">
                Shop fresh fruits, vegetables, bakery favorites, dairy, drinks,
                and everyday groceries from Bazzar.
              </p>

              <Link to="/products" className="home-btn">
                Shop Now <span>→</span>
              </Link>

              <div className="hero-benefits">
                <div>
                  <span>✓</span>
                  <p>Best Quality</p>
                  <small>Fresh products</small>
                </div>
                <div>
                  <span>🚚</span>
                  <p>Fast Delivery</p>
                  <small>Quick service</small>
                </div>
                <div>
                  <span>🏷</span>
                  <p>Best Prices</p>
                  <small>Save more</small>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img src={groceryHero} alt="Fresh groceries" />
            </div>
          </div>
        </section>

        <section className="home-section categories" id="categories">
          <div className="home-container">
            <div className="section-top">
              <div className="section-heading section-heading-center">
              <h2>Shop by Category</h2>
              </div>

              <Link to="/products" className="section-action">
                View all categories →
              </Link>
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
                View all products →
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

        <section className="promo-section">
          <div className="home-container">
            <div className="promo-grid">
              <article className="promo-card">
                <div>
                  <p>Fresh Deals</p>
                  <h2>On your first order</h2>
                  <span>Use code BAZZAR20</span>
                  <Link to="/products">Shop Now</Link>
                </div>
                <div className="promo-visual">🥬🍎</div>
              </article>

              <article className="promo-card promo-card-soft">
                <div>
                  <p>Delivery</p>
                  <h2>Fresh groceries to your door</h2>
                  <span>Simple ordering for everyday products.</span>
                  <Link to="/products">Learn More</Link>
                </div>
                <div className="promo-visual">🛵</div>
              </article>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="home-container">
            <div className="section-heading section-heading-center">
              <h2>Why choose Bazzar?</h2>
            </div>

            <div className="benefits-list">
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
          </div>
        </section>

        <section className="home-section fresh-news">
          <div className="home-container">
            <div className="section-heading section-heading-center">
              <h2>Fresh News</h2>
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

        <section className="about-section" id="about">
          <div className="home-container about-card">
            <p>About Bazzar</p>
            <h2>Fresh everyday grocery shopping made simple.</h2>
            <span>
              Bazzar helps customers shop fresh produce, dairy, bakery items,
              drinks, snacks, and daily essentials with a clean and simple
              grocery experience.
            </span>
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
            <Link to="/#categories">Categories</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className="footer-column">
            <h3>Account</h3>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/login">Login</Link>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <Link to="/#about">About Us</Link>
            <span>Fresh Quality</span>
            <span>Fast Delivery</span>
          </div>
        </div>

        <p className="footer-copy">Copyright 2026 Bazzar. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Home
