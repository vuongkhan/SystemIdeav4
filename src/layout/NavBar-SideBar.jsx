import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

export default function NavbarSidebarLayout ({children}) {
    return (
        <>
            <NavBar />
            <div className="flex items-start pt-16">
                <SideBar />
                <div className="sm:ml-64 mt-12 fixed inset-0 z-10 hidden"> </div>
                      <Outlet />
                      {children}
                 
            </div>
        </>
    )
}


