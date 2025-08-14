import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";

export default function Orders() {
  const {
    orders,
    products,
    fetchOrders,
    fetchProducts,
    addOrder,
    updateOrderStatus,
  } = useAppContext();

  const statusMap = {
    Cancelled: "لغو شده",
    Shipped: "ارسال شده",
    Pending: "در انتظار",
  };

  const [form, setForm] = useState({
    customerName: "",
    items: [],
  });
  const [filter, setFilter] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    setAvailableProducts(products.filter((p) => p.stock > 0));
  }, [products]);

  const handleCustomerChange = (e) => {
    setForm((prev) => ({ ...prev, customerName: e.target.value }));
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    if (field === "productId") {
      newItems[index].productId = Number(value);
      newItems[index].quantity = 1;
    } else if (field === "quantity") {
      newItems[index].quantity = Number(value);
    }
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customerName.trim()) {
      toast.error("لطفا نام مشتری را وارد کنید");
      return;
    }
    if (form.items.length === 0) {
      toast.error("حداقل یک کالا باید انتخاب شود");
      return;
    }

    for (const item of form.items) {
      if (!item.productId) {
        toast.error("لطفا کالای معتبر انتخاب کنید");
        return;
      }

      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        toast.error("کالای انتخاب شده موجود نیست");
        return;
      }

      if (item.quantity <= 0 || item.quantity > product.stock) {
        toast.error(`مقدار نامعتبر برای کالا ${product.name}`);
        return;
      }
    }

    const order = {
      customerName: form.customerName.trim(),
      items: form.items,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    addOrder(order);
    setForm({ customerName: "", items: [] });

    toast.success("سفارش با موفقیت ثبت شد");
  };

  const filteredOrders = orders.filter((o) => {
    return o.customerName.includes(filter) || String(o.id).includes(filter);
  });

  return (
    <div>
      <h2         style={{
          fontFamily: "IRANSANS-bold",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}>سفارشات</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام مشتری یا شماره سفارش"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-3"
        style={{ maxWidth: 400 }}
      />

      {/* دکمه باز کردن مودال */}
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#orderModal"
        onClick={() => setForm({ customerName: "", items: [] })}
      >
        افزودن سفارش
      </button>

      {/* جدول سفارشات */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>شماره سفارش</th>
            <th>نام مشتری</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>کالاها</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{new Date(order.createdAt).toLocaleString("fa-IR")}</td>
              <td>{statusMap[order.status]}</td>
              <td>
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      style={{ borderBottom: "1px solid #e7edef" }}
                      key={item.productId}
                    >
                      {product ? product.name : "کالای حذف شده"} ×{" "}
                      {item.quantity}
                    </div>
                  );
                })}
              </td>
              <td>
                {order.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Shipped")}
                      className="btn btn-success btn-sm me-2"
                    >
                      تایید
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Cancelled")}
                      className="btn btn-danger btn-sm"
                      style={{ marginRight: "0.3rem" }}
                    >
                      لغو
                    </button>
                  </>
                )}
                {order.status !== "Pending" && <em>{statusMap[order.status]}</em>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="orderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit} style={{ display: "block" }}>
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ fontFamily: "IRANSANS-bold" }}
                >
                  ثبت سفارش جدید
                </h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="نام مشتری"
                  value={form.customerName}
                  onChange={handleCustomerChange}
                  required
                  className="form-control mb-3"
                />
                {form.items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex gap-2 align-items-center mb-2"
                  >
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      required
                      className="form-select"
                      style={{ flex: 2 }}
                    >
                      <option value="">انتخاب کالا</option>
                      {availableProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (موجودی: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      max={
                        availableProducts.find((p) => p.id === item.productId)
                          ?.stock || 1
                      }
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      required
                      className="form-control"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(index)}
                      style={{ marginTop: "-10px" }}
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddItem}
                >
                  افزودن کالا
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  انصراف
                </button>
                <button type="submit" className="btn btn-primary">
                  ثبت سفارش
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
