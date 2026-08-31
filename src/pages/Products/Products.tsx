import { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import axiosInstance from '../../lib/axios'
import { setProducts } from '../../features/products/productSlice'
import type { RootState } from '../../app/store'
import ProductCard from '../../components/ProductCard/ProductCard'
import { ProductCollection } from '../../types/product'
import './Products.css'

const PAGE_LIMIT = 8

const categories = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Fruits & Vegetables',
    value: ProductCollection.FRUIT_VEGETABLE,
  },
  {
    label: 'Meat',
    value: ProductCollection.MEAT,
  },
  {
    label: 'Dairy',
    value: ProductCollection.DAIRY,
  },
  {
    label: 'Bakery',
    value: ProductCollection.BAKERY,
  },
  {
    label: 'Beverages',
    value: ProductCollection.BEVERAGE,
  },
  {
    label: 'Snacks',
    value: ProductCollection.SNACK,
  },
]

const sortOptions = [
  {
    label: 'Default',
    value: '',
  },
  {
    label: 'Price: Low to High',
    value: 'price_low',
  },
  {
    label: 'Price: High to Low',
    value: 'price_high',
  },
]

function Products() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get('search') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const products = useSelector(
    (state: RootState) => state.products.products
  )

  const selectedCategory = searchParams.get('category') || ''
  const submittedSearch = searchParams.get('search') || ''
  const sortFromUrl = searchParams.get('sort') || ''
  const selectedSort = sortOptions.some((option) => option.value === sortFromUrl)
    ? sortFromUrl
    : ''
  const page = Number(searchParams.get('page') || '1')
  const safePage = page > 0 ? page : 1
  const hasNextPage = products.length === PAGE_LIMIT

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await axiosInstance.get('/products', {
          params: {
            productCollection: selectedCategory || undefined,
            search: submittedSearch || undefined,
            page: safePage,
            limit: PAGE_LIMIT,
            sort: selectedSort || undefined,
          },
        })

        dispatch(setProducts(response.data))
      } catch (error) {
        console.log('Failed to fetch products:', error)
        setError('Failed to load products. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch, safePage, selectedCategory, selectedSort, submittedSearch])

  useEffect(() => {
    setSearchText(submittedSearch)
  }, [submittedSearch])

  const updateProductsQuery = (
    nextValues: Record<string, string | number | undefined>
  ) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, String(value))
      } else {
        nextParams.delete(key)
      }
    })

    setSearchParams(nextParams)
  }

  const handleCategoryChange = (category: string) => {
    updateProductsQuery({
      category,
      page: 1,
    })
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    updateProductsQuery({
      search: searchText.trim(),
      page: 1,
    })
  }

  const handleSortChange = (sort: string) => {
    updateProductsQuery({
      sort,
      page: 1,
    })
  }

  const handlePageChange = (nextPage: number) => {
    updateProductsQuery({
      page: nextPage,
    })
  }

  return (
    <main className="products-page">
      <div className="products-container">
        <div className="products-header">
          <p>Fresh Products</p>
          <h1>Shop groceries from Bazzar</h1>
          <span>
            Find fresh produce, bakery favorites, dairy, drinks, snacks, and
            daily grocery essentials.
          </span>
        </div>

        <section className="products-toolbar">
          <form className="products-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <label className="products-sort">
            <span>Sort</span>
            <select
              value={selectedSort}
              onChange={(event) => handleSortChange(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.label}
              type="button"
              className={
                selectedCategory === category.value
                  ? 'category-filter active'
                  : 'category-filter'
              }
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="products-message">Loading products...</p>
        ) : error ? (
          <p className="products-message products-error">{error}</p>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="products-message">No products found.</p>
        )}

        <div className="products-pagination">
          <button
            type="button"
            disabled={safePage === 1 || isLoading}
            onClick={() => handlePageChange(safePage - 1)}
          >
            Previous
          </button>

          <span>Page {safePage}</span>

          <button
            type="button"
            disabled={!hasNextPage || isLoading}
            onClick={() => handlePageChange(safePage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  )
}

export default Products
