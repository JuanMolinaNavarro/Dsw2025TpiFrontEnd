import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { CartProvider } from './modules/customer/context/CartContext';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import ProductsListPage from './modules/products/pages/ProductListaPage';
import CartPage from './modules/customer/pages/CartPage';
import Header from './modules/shared/components/Header';
import Footer from './modules/shared/components/Footer';

// Layout para las páginas públicas (Cliente)
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    // ========== RUTAS PÚBLICAS (CLIENTE) ==========
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          // Página principal - Listado de productos público
          path: '/',
          element: <ProductsListPage />,
        },
        {
          // Carrito - Accesible sin login, pero requiere login para checkout
          path: '/cart',
          element: <CartPage />,
        },

      ],
    },

    // ========== RUTAS DE AUTENTICACIÓN ==========
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <RegisterPage />,
    },

    // ========== RUTAS PROTEGIDAS DE ADMINISTRADOR ==========
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['Administrador']}>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          // Dashboard principal con estadísticas
          index: true,
          element: <Home />,
        },
        {
          // Gestión de productos
          path: 'products',
          element: <ListProductsPage />,
        },
        {
          path: 'products/create',
          element: <CreateProductPage />,
        },
       
        {
          // Gestión de órdenes
          path: 'orders',
          element: <ListOrdersPage />,
        },
      
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;