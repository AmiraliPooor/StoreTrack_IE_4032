import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function Products() {
  const { products, fetchProducts, addProduct, editProduct, deleteProduct } =
    useAppContext();
  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
    category: "",
    minStock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success("محصول با موفقیت حذف شد");
      setProductToDelete(null);
      // بستن مودال
      const modalEl = document.getElementById("deleteModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name: form.name.trim(),
      stock: Number(form.stock),
      price: Number(form.price),
      category: form.category.trim(),
      minStock: Number(form.minStock),
    };

    if (editingId) {
      editProduct(editingId, newProduct);
      toast.info("محصول با موفقیت ویرایش شد");
      setEditingId(null);
    } else {
      addProduct(newProduct);
      toast.success("محصول با موفقیت اضافه شد");
    }

    setForm({ name: "", stock: "", price: "", category: "", minStock: "" });
    document.getElementById("closeModalBtn").click();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      stock: product.stock,
      price: product.price,
      category: product.category,
      minStock: product.minStock,
    });
    // const modal = new bootstrap.Modal(document.getElementById("productModal"));
    // modal.show();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", stock: "", price: "", category: "", minStock: "" });
  };

  const filteredProducts = products.filter(
    (p) => p.name.includes(filter) || p.category.includes(filter)
  );

  return (
    <div className="container mt-4">
      <h2 style={{ fontFamily: "IRANSANS-bold" }}>کالاها</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام یا دسته‌بندی"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-3"
        style={{ maxWidth: 400 }}
      />

      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#productModal"
        onClick={cancelEdit}
      >
        افزودن کالا
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>نام کالا</th>
            <th>موجودی</th>
            <th>قیمت</th>
            <th>دسته‌بندی</th>
            <th>حداقل موجودی</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              style={{
                backgroundColor:
                  p.stock <= p.minStock ? "#ffdddd" : "transparent",
              }}
            >
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>{p.price.toLocaleString()}</td>
              <td>{p.category}</td>
              <td>{p.minStock}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#productModal"
                  onClick={() => startEdit(p)}
                >
                  ویرایش
                </button>
                <button
                  style={{ marginRight: "0.5rem" }}
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => setProductToDelete(p)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <b>{editingId ? "ویرایش کالا" : "افزودن کالا"}</b>
              </h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="نام کالا"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-control mb-2"
                />
                <input
                  name="stock"
                  type="text" // به جای number
                  placeholder="موجودی"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="form-control mb-2"
                />
                <input
                  name="price"
                  type="number"
                  placeholder="قیمت"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="form-control mb-2"
                  min={0}
                />
                <input
                  name="category"
                  placeholder="دسته‌بندی"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="form-control mb-2"
                />
                <input
                  name="minStock"
                  type="number"
                  placeholder="حداقل موجودی هشدار"
                  value={form.minStock}
                  onChange={handleChange}
                  required
                  className="form-control mb-3"
                  min={0}
                />
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-success">
                    {editingId ? "ویرایش" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    id="closeModalBtn"
                    className="btn btn-secondary ms-2"
                    style={{ marginRight: "0.5rem" }}
                    data-bs-dismiss="modal"
                  >
                    بستن
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal تأیید حذف */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                style={{ fontFamily: "IRANSANS-bold" }}
              >
                تأیید حذف
              </h5>
            </div>
            <div className="modal-body">
              آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                لغو
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                data-bs-dismiss="modal"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
