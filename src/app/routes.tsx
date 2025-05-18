import { createRootRoute, createRoute, Router } from "@tanstack/react-router";
import { AppLayout } from "../components/layout";
import { Home } from "../pages/home";
import { Products } from "../pages/products";
import { About } from "../pages/about";

import { ProductsManagementPage } from "../pages/products-management";
import SellsManagementPage from "../pages/sells-management";
import { CouponsManagementPage } from "../pages/cupones";
import CartView from "../pages/cart";
import ProductDetailsView from "../pages/product-details";
import LoginView from "../pages/login";
import { RegisterForm } from "../pages/register";
import { ColorsManagementPage } from "../pages/colors";
import { SizesManagementPage } from "../pages/sizes";
import CheckoutView from "../pages/checkout";
import { UsersManagementPage } from "../pages/users-management";
import PurchaseSuccessPage from "../pages/purchase-success";
import { AdminRoute, EmployeeRoute } from "../components/protected-routes";
import { PurchaseHistory } from "../pages/purchase-history";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: Products,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: () => (
    <AdminRoute>
      <UsersManagementPage />
    </AdminRoute>
  ),
});

const productsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products-management",
  component: () => (
    <EmployeeRoute>
      <ProductsManagementPage />
    </EmployeeRoute>
  ),
});

const sellsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sells-management",
  component: () => (
    <EmployeeRoute>
      <SellsManagementPage />
    </EmployeeRoute>
  ),
});

const couponsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/coupons",
  component: () => (
    <EmployeeRoute>
      <CouponsManagementPage />
    </EmployeeRoute>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartView,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product-details/$id",
  component: ProductDetailsView,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginView,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterForm,
});

const checkoutPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutView,
});

const purchaseSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/purchase-success",
  component: PurchaseSuccessPage,
});

const purchaseHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/purchase-history",
  component: PurchaseHistory,
});

const colorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/colors",
  component: () => (
    <EmployeeRoute>
      <ColorsManagementPage />
    </EmployeeRoute>
  ),
});

const sizesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sizes",
  component: () => (
    <EmployeeRoute>
      <SizesManagementPage />
    </EmployeeRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productsRoute,
  aboutRoute,
  usersRoute,
  productsManagementRoute,
  sellsManagementRoute,
  couponsRoute,
  cartRoute,
  productDetailsRoute,
  loginRoute,
  registerRoute,
  checkoutPageRoute,
  purchaseSuccessRoute,
  colorsRoute,
  sizesRoute,
  purchaseHistoryRoute,
]);

export const router = new Router({ routeTree });
