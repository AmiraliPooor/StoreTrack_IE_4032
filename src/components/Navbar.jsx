import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">StoreTrack</h1>
      <div className="flex gap-4">
        <Link to="/">داشبورد</Link>
        <Link to="/products">کالاها</Link>
        <Link to="/orders">سفارشات</Link>
        <Link to="/transactions">تاریخچه</Link>
        <Link to="/reports">گزارشات</Link>
        <Link to="/alerts">هشدارها</Link>
      </div>
    </nav>
  )
}
