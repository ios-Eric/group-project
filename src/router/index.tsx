import React, { lazy, ReactElement } from "react";
import { useRoutes } from "react-router-dom";

const LayoutComponent = lazy(() => import('../pages/layout'));
const Home = lazy(() => import('../pages'));
const Shopping = lazy(() => import('../pages/shopping'));
const Login = lazy(() => import('../pages/login'));

const MainRoutes:React.FC = () => {
  const routers = useRoutes([
    {
      path: '/',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          path: '/',
          element: <Login />,
        },
        {
          path: '/index',
          element: <Home />,
        },
        {
          path: '/shop',
          element: <Shopping />,
        }
      ],
    },
  ]);
  return routers;
};

export default MainRoutes;
