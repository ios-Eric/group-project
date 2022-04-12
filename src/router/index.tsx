import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutComponent from "../pages/layout";
import Home from "../pages";
import Shopping from "../pages/shopping";

const AppRoutes = (props: any) => {
  console.log(props, "zouguo...");
  return (
    <Routes>
      <Route path="/" element={<LayoutComponent />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shopping" element={<Shopping />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
