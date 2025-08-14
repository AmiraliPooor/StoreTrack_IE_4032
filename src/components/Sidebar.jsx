import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const links = [
    { to: "/", label: "داشبورد" },
    { to: "/products", label: "کالاها" },
    { to: "/orders", label: "سفارشات" },
    { to: "/transactions", label: "تاریخچه" },
    { to: "/reports", label: "گزارشات" },
    { to: "/alerts", label: "هشدارها" },
  ];

  return (
    <nav
      style={{
        width: 220,
        backgroundColor: "#f7f9fc",
        height: "100vh",
        padding: 20,
        boxSizing: "border-box",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          fontSize: 26,
          fontFamily: "IRANSANS-bold",
          color: "#515151ff",
        }}
      >
        StoreTrack
      </h2>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          style={{
            position: "relative",
            textDecoration: "none",
            display: "block",
            margin: "5px 0",
          }}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="sidebarHighlight"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                    backgroundColor: "#278671ff",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span
                style={{
                  display: "block",
                  padding: "12px 20px",
                  color: isActive ? "white" : "#333",
                  borderRadius: 5,
                }}
              >
                {link.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
