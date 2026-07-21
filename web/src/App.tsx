import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import MyAccount from './pages/MyAccount';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import MyAddresses from './pages/MyAddresses';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import Promotions from './pages/Promotions';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentPending from './pages/PaymentPending';
import PaymentRejected from './pages/PaymentRejected';
import NotFound from './pages/NotFound';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/pedido-confirmado" element={<OrderConfirmed />} />
        <Route path="/pago-exitoso" element={<PaymentSuccess />} />
        <Route path="/pago-pendiente" element={<PaymentPending />} />
        <Route path="/pago-rechazado" element={<PaymentRejected />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-password" element={<RecoverPassword />} />
        <Route path="/mi-cuenta" element={<MyAccount />}>
          <Route index element={<Profile />} />
          <Route path="mis-pedidos" element={<MyOrders />} />
          <Route path="mis-pedidos/:id" element={<OrderDetail />} />
          <Route path="mis-direcciones" element={<MyAddresses />} />
          <Route path="favoritos" element={<Favorites />} />
        </Route>
        <Route path="/pedidos" element={<Orders />} />
<Route path="/categorias" element={<Categories />} />
        <Route path="/categorias/:categoryId" element={<Subcategories />} />
        <Route path="/promociones" element={<Promotions />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;