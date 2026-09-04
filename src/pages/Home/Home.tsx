import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import type { RootState } from '../../app/store'
import groceryHero from '../../assets/grocery-hero.png'
import bakeryImage from '../../assets/categories/bakery.png'
import beveragesImage from '../../assets/categories/beverages.png'
import dairyImage from '../../assets/categories/dairy.png'
import fruitsVegetablesImage from '../../assets/categories/fruits-vegetables.png'
import meatImage from '../../assets/categories/meat.png'
import snacksImage from '../../assets/categories/snacks.png'
import ProductCard from '../../components/ProductCard/ProductCard'
import { setProducts } from '../../features/products/productSlice'
import axiosInstance from '../../lib/axios'
import { ProductCollection } from '../../types/product'
import './Home.css'

const categories = [
  {
    title: 'Fruits & Vegetables',
    value: ProductCollection.FRUIT_VEGETABLE,
    image: fruitsVegetablesImage,
  },
  {
    title: 'Meat',
    value: ProductCollection.MEAT,
    image: meatImage,
  },
  {
    title: 'Dairy',
    value: ProductCollection.DAIRY,
    image: dairyImage,
  },
  {
    title: 'Bakery',
    value: ProductCollection.BAKERY,
    image: bakeryImage,
  },
  {
    title: 'Beverages',
    value: ProductCollection.BEVERAGE,
    image: beveragesImage,
  },
  {
    title: 'Snacks',
    value: ProductCollection.SNACK,
    image: snacksImage,
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

  const selectedFeaturedProducts = []
  const selectedCollections = new Set<string>()

  for (const product of products) {
    if (!selectedCollections.has(product.productCollection)) {
      selectedFeaturedProducts.push(product)
      selectedCollections.add(product.productCollection)
    }

    if (selectedFeaturedProducts.length === 4) {
      break
    }
  }

  const selectedFeaturedIds = new Set(
    selectedFeaturedProducts.map((product) => product._id)
  )
  const fallbackFeaturedProducts = products.filter(
    (product) => !selectedFeaturedIds.has(product._id)
  )
  const featuredProducts = [
    ...selectedFeaturedProducts,
    ...fallbackFeaturedProducts,
  ].slice(0, 4)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products', {
          params: { limit: 24 },
        })

        dispatch(setProducts(response.data))
      } catch (error) {
        console.log('Failed to fetch featured products:', error)
      }
    }

    fetchProducts()
  }, [dispatch])

  return (
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
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/products?category=${category.value}`}
                className="category-card"
              >
                <span className="category-card-image">
                  <img src={category.image} alt="" aria-hidden="true" />
                </span>
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
                <h2>Fresh picks for every kitchen</h2>
                <span>Stock up on produce, pantry favorites, and daily essentials.</span>
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
    </main>
  )
}

export default Home
