
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Role from './pages/Role'
import Petugas from './pages/Petugas'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import Kasir from './pages/Kasir'
import { TransactionProvider } from './context/TransactionContext'
import PaymentComponent from './components/kasir/PaymentComponent'
import DataTransaction from './pages/DataTransaction'
// import Page from './pages/Pages'

function App() {

  return (
    <>
     <AuthProvider>
      <TransactionProvider>

      
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
          
        }>
          <Route index element={<Home />} />
          <Route path="/kasir" element={<Kasir />} />
          <Route path="/payment" element={<PaymentComponent />} />
          <Route path="/transaksi" element={<DataTransaction />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product" element={<Product />} />
          <Route path="/petugas" element={<Petugas />} />
          <Route path="/role" element={<Role />} />

        </Route>
      </Routes>
      </TransactionProvider>
      </AuthProvider>    
      
    </>
  )
}

export default App
