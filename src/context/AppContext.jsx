import React, { createContext, useContext, useState, useEffect } from "react";

// ساخت Context اصلی برنامه
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // داده‌ها در state نگهداری می‌شوند
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // داده‌های شبیه‌سازی شده اولیه
  const initialProducts = [
    {
      id: 1,
      name: "کالای نمونه 1",
      stock: 50,
      price: 10000,
      category: "دسته 1",
      minStock: 10,
    },
    {
      id: 2,
      name: "کالای نمونه 2",
      stock: 20,
      price: 20000,
      category: "دسته 2",
      minStock: 5,
    },
  ];

  const initialOrders = [
    {
      id: 1,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Pending",
      items: [
        { productId: 1, quantity: 3 },
        { productId: 2, quantity: 2 },
      ],
      customer: { name: "مشتری تست" },
    },
  ];

  const initialTransactions = [
    {
      id: 1,
      productId: 1,
      type: "IN",
      quantity: 50,
      date: new Date().toISOString(),
    },
    {
      id: 2,
      productId: 2,
      type: "IN",
      quantity: 20,
      date: new Date().toISOString(),
    },
  ];

  // شبیه‌سازی fetch داده‌ها
  function fetchProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setProducts(initialProducts);
        resolve();
      }, 300);
    });
  }

  function fetchOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setOrders(initialOrders);
        resolve();
      }, 300);
    });
  }

  function fetchTransactions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTransactions(initialTransactions);
        resolve();
      }, 300);
    });
  }

  // افزودن کالا جدید
  function addProduct(product) {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    // ثبت ورود کالا در تراکنش‌ها
    const transaction = {
      id: Date.now(),
      productId: product.id || Date.now(),
      type: "IN",
      quantity: product.stock,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [...prev, transaction]);
  }

  // ویرایش کالا
  function editProduct(id, updatedProduct) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  }

  // حذف کالا
  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // ثبت سفارش جدید و کاهش موجودی
  function addOrder(order) {
    // موجودی کالاها را کاهش می‌دهیم
    setProducts((prev) =>
      prev.map((p) => {
        const item = order.items.find((i) => i.productId === p.id);
        if (item) return { ...p, stock: p.stock - item.quantity };
        return p;
      })
    );
    setOrders((prev) => [...prev, { ...order, id: Date.now() }]);

    // ثبت تراکنش خروج برای کالاهای سفارش داده شده
    const newTransactions = order.items.map((item) => ({
      id: Date.now() + Math.random(),
      productId: item.productId,
      type: "OUT",
      quantity: item.quantity,
      date: new Date().toISOString(),
    }));
    setTransactions((prev) => [...prev, ...newTransactions]);
  }

  // تغییر وضعیت سفارش
  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        transactions,
        fetchProducts,
        fetchOrders,
        fetchTransactions,
        addProduct,
        editProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
