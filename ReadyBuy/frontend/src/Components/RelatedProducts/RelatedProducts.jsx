import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { getProducts } from '../../services/product.service'

const RelatedProducts = ({ s_product }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.docs || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [])

  if (!s_product) return null

  const currentProductId = s_product._id || s_product.id

  const related = products
    .filter(
      (item) =>
        item.category === s_product.category &&
        (item._id || item.id) !== currentProductId
    )
    .slice(0, 4)

  return (
    <div className='related-products'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.map((item) => (
          <Item
            key={item._id}
            slug={item.slug}
            name={item.name}
            image={
              item.images?.[0] ||
              '/placeholder.png'
            }
            new_price={
              item.price?.discounted || 0
            }
            old_price={
              item.price?.original || 0
            }
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts