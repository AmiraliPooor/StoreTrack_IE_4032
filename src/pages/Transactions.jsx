import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function Transactions() {
  const { transactions, products, fetchTransactions, fetchProducts } =
    useAppContext();

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  return (
    <div>
      <h2
        style={{
          fontFamily: "IRANSANS-bold",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        تاریخچه ورود/خروج کالاها
      </h2>
      <table>
        <thead>
          <tr>
            <th>کالا</th>
            <th>نوع تراکنش</th>
            <th>تعداد</th>
            <th>تاریخ و زمان</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .slice()
            .reverse()
            .map((tx) => {
              const product = products.find((p) => p.id === tx.productId);
              return (
                <tr
                  key={tx.id}
                  style={{
                    backgroundColor: tx.type === "OUT" ? "#ffe6e6" : "#ffffffff",
                  }}
                >
                  <td>{product ? product.name : "کالای حذف شده"}</td>
                  <td>{tx.type === "IN" ? "ورود" : "خروج"}</td>
                  <td>{tx.quantity}</td>
                  <td>{new Date(tx.date).toLocaleString("fa-IR")}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
