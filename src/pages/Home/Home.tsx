import { Link } from 'react-router-dom'
import './Home.css'
import groceryHero from '../../assets/grocery-hero.png'

function Home() {
    return (
       <main className='home'>


        <section className='hero'>
            <div className='hero-content'>
                <p className='hero-subtitle'>Fresh & Healty</p>

                <h1>
                     Fresh groceries
                     <br />
                      delivered to your door
                </h1>

                <p className='hero-description'>
                     Shop fresh fruits, vegetables and everyday groceries
                     from Bazzar.
                </p>
                 
                 <Link to="/products" className='hero-btn'>
                   Shop Now
                 </Link> 
            </div>

            <div className='hero-image'>
              <img src={groceryHero} alt="Fresh groceries" />
            </div>
        </section>

    <section className="categories">
        <div className="section-heading">
            <p>Browse Categories</p>
            <h2>Shop by Category</h2>
        </div>

  <div className="category-list">
    <Link  to="/products?category=FRUIT_VEGETABLE" className="category-card">
       <span>🥬</span>
      <h3>Fruits & Vegetables</h3>
    </Link>

    <Link   to="/products?category=MEAT" className="category-card">
       <span>🥩</span>
        <h3>Meat</h3>
    </Link>

    <Link to="/products?category=DAIRY" className="category-card">
      <span>🥛</span>
      <h3>Dairy</h3>
    </Link>

    <Link to="/products?category=BAKERY" className="category-card">
      <span>🍞</span>
      <h3>Bakery</h3>
    </Link>

      <Link to="/products?category=BEVERAGE" className="category-card" >
         <span>🧃</span>
         <h3>Beverages</h3>
       </Link>

      <Link
         to="/products?category=SNACK"
         className="category-card"
          >
        <span>🍿</span>
          <h3>Snacks</h3>
     </Link>

  </div>
</section>
       </main>
    )
}

export default Home