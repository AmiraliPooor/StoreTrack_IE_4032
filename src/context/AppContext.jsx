import React, { createContext, useContext, useState, useEffect } from "react";

// ساخت Context اصلی برنامه
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);


// fetchProducts()
async function fetchProducts() {
  const { data } = await api.get('/api/products');
  setProducts(data);
}

  // fetchOrders()
async function fetchOrders() {
  const { data } = await api.get('/api/orders');
  setOrders(data);
}

// fetchTransactions()
async function fetchTransactions() {
  const { data } = await api.get('/api/transactions');
  setTransactions(data);
}

// addProduct(product)
async function addProduct(product) {
  const { data } = await api.post('/api/products', product);
  setProducts(prev => [...prev, data]);
  // transactions view will refresh from API when you navigate; or call fetchTransactions() here
}

// editProduct(id, updatedProduct)
async function editProduct(id, updatedProduct) {
  const { data } = await api.put(`/api/products/${id}`, updatedProduct);
  setProducts(prev => prev.map(p => p.id === id ? data : p));
}

// deleteProduct(id)
async function deleteProduct(id) {
  await api.delete(`/api/products/${id}`);
  setProducts(prev => prev.filter(p => p.id !== id));
}

// addOrder(order)
async function addOrder(order) {
  const { data } = await api.post('/api/orders', {
    customerName: order.customerName,
    createdAtStr: order.createdAt,
    items: order.items
  });
  setOrders(prev => [...prev, data]);
  // also update stocks locally (optional) or re-fetch products
  fetchProducts();
  fetchTransactions();
}

// updateOrderStatus(id, status)
async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/api/orders/${id}/status`, { status });
  setOrders(prev => prev.map(o => o.id === id ? { ...o, status: data.status } : o));
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

import api from '../api/apiClient';
