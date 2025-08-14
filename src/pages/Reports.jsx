import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Reports() {
  const { products, orders, fetchProducts, fetchOrders } = useAppContext()
  const [salesReport, setSalesReport] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  useEffect(() => {
    // گزارش فروش مجموع کالاها
    const sales = products.map(product => {
      let totalSold = 0;
      orders
        .filter(o => o.status === "Shipped")
        .forEach(order => {
          order.items.forEach(item => {
            if (item.productId === product.id) {
              totalSold += item.quantity;
            }
          });
        });
      return {
        id: product.id,
        name: product.name,
        totalSold,
        revenue: totalSold * product.price
      };
    });
    setSalesReport(sales)

    // کالاهای با موجودی پایین
    const lowStock = products.filter(p => p.stock <= p.minStock)
    setLowStockProducts(lowStock)
  }, [products, orders])

  return (
    <div>
      <h2
              style={{
          fontFamily: "IRANSANS-bold",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
        >گزارشات فروش و موجودی پایین</h2>

      <table>
        <thead>
          <tr>
            <th>نام کالا</th>
            <th>تعداد فروش</th>
            <th>درآمد (تومان)</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.totalSold}</td>
              <td>{item.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 
      style={{
          fontFamily: "IRANSANS-bold",
          marginTop: "2rem",
          marginTop:"40px"
        }}>کالاهای با موجودی پایین</h3>
      {lowStockProducts.length === 0 ? (
        <p>همه کالاها موجودی کافی دارند.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>نام کالا</th>
              <th>موجودی</th>
              <th>حداقل موجودی</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map(p => (
              <tr key={p.id} style={{ backgroundColor: '#ffe6e6' }}>
                <td>{p.name}</td>
                <td>{p.stock}</td>
                <td>{p.minStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
