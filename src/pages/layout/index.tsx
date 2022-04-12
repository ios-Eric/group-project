import React from "react";
import { Outlet } from "react-router-dom";

const LayoutComponent = () => {
  return (
    <div>
      <div>header...</div>
      <Outlet />
      <div>footer...</div>
    </div>
  )
};

export default LayoutComponent;
