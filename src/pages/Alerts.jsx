import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Alerts() {
  const { products, fetchProducts } = useAppContext()
  const [lowStockProducts, setLowStockProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const lowStock = products.filter(p => p.stock <= p.minStock)
    setLowStockProducts(lowStock)
  }, [products])

  return (
    <div>
      <h2
        style={{
        fontFamily: "IRANSANS-bold",
        marginTop: "2rem",
        }}
      >هشدارهای موجودی کم</h2>
      {lowStockProducts.length === 0 ? (
        <p>هیچ کالایی موجودی کمی ندارد.</p>
      ) : (
        <ul>
          {lowStockProducts.map(p => (
            <li key={p.id} style={{ color: 'red', marginBottom: 8 }}>
              ⚠️ کالا <strong>{p.name}</strong> موجودی کمی دارد ({p.stock} عدد)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
