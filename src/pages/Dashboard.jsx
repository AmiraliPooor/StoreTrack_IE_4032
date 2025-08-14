import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const { products, orders, fetchProducts, fetchOrders } = useAppContext();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    // تعداد کالاهای با موجودی پایین
    const lowStock = products.filter((p) => p.stock <= p.minStock);
    setLowStockCount(lowStock.length);

    // تعداد سفارشات امروز
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.createdAt === today);
    setOrdersCount(todayOrders.length);

    // درآمد کل
    let revenue = 0;
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) revenue += product.price * item.quantity;
      });
    });
    setTotalRevenue(revenue);

    // داده‌های نمودار فروش روزانه 7 روز گذشته
    const salesMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      salesMap[dayStr] = 0;
    }

    orders.forEach((order) => {
      if (salesMap.hasOwnProperty(order.createdAt)) {
        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            salesMap[order.createdAt] += product.price * item.quantity;
          }
        });
      }
    });

    setSalesData({
      labels: Object.keys(salesMap),
      datasets: [
        {
          label: "درآمد روزانه (تومان)",
          data: Object.values(salesMap),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    });
  }, [products, orders]);

  return (
    <div>
      <h2 style={{ fontFamily: "IRANSANS-bold", marginTop: "1.5rem" }}>
        داشبورد
      </h2>
      <div
        style={{ display: "flex", gap: 20, marginTop: 20, marginBottom: 40 }}
      >
        <StatCard title="تعداد کالاها" value={products.length} />
        <StatCard title="سفارشات امروز" value={ordersCount} />
        <StatCard
          title="درآمد کل (تومان)"
          value={totalRevenue.toLocaleString()}
        />
        <StatCard title="کالاهای با موجودی پایین" value={lowStockCount} />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Bar
          data={salesData}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#f0f4f8",
        borderRadius: 8,
        flex: "1 1 0",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "transform 0.2s ease", 
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h5 style={{ marginBottom: 10, fontFamily: "IRANSANS-bold" }}>{title}</h5>
      <p
        style={{
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "IRANSANS-bold",
        }}
      >
        {value}
      </p>
    </div>
  );
}
