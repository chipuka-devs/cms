import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../utils/MainContext";
import { UnorderedListOutlined, CloseOutlined } from "@ant-design/icons";

export const Navbar = () => {
  const { isApprover, currentTab, setCurrentTab } = useContext(Context);
  const { setUser } = useContext(Context);

  const [showNav, setShowNav] = useState(false);

  const signOut = () => {
    setUser(null);
  };

  return (
    <div className="w-full bg-[#001529] ">
      {/* container */}
      <div className="max-w-[1250px]  mx-auto h-[80px] flex items-center justify-between px-3">
        {/* logo */}
        <div>
          <Link to="/">
            <h6 className="text-base font-bold text-slate-300 underline uppercase">
              District Contributions
            </h6>
          </Link>
        </div>

        {/* list */}
        <ul className=" hidden md:flex nav text-slate-300 ">
          <Link to="/" onClick={() => setCurrentTab("home")}>
            <li className={currentTab === "home" ? "current" : ""}>Home</li>
          </Link>

          {isApprover && (
            <Link to="/approve" onClick={() => setCurrentTab("approvals")}>
              <li className={currentTab === "approvals" ? "current" : ""}>
                Approvals
              </li>
            </Link>
          )}
          <Link to="/profile" onClick={() => setCurrentTab("profile")}>
            <li className={currentTab === "profile" ? "current" : ""}>
              Profile
            </li>
          </Link>

          <li onClick={() => signOut()}>Logout</li>
        </ul>

        {/* Humburger menu */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setShowNav((prev) => !prev)}
        >
          {showNav ? <CloseOutlined /> : <UnorderedListOutlined />}
        </button>

        <div
          className={
            showNav
              ? " flex justify-center text-center border-t border-blue-200 md:hidden absolute top-[80px] left-0 text-slate-300 w-full h-screen nav z-[100] bg-[#001529] ease-in-out duration-300"
              : "absolute left-[-100%] top-[80px]"
          }
        >
          <ul>
            <Link to="/" onClick={() => setCurrentTab("home")}>
              <li className={currentTab === "home" ? "current" : ""}>Home</li>
            </Link>

            {isApprover && (
              <Link to="/approve" onClick={() => setCurrentTab("approvals")}>
                <li className={currentTab === "approvals" ? "current" : ""}>
                  Approvals
                </li>
              </Link>
            )}
            <Link to="/profile" onClick={() => setCurrentTab("profile")}>
              <li className={currentTab === "profile" ? "current" : ""}>
                Profile
              </li>
            </Link>

            <li onClick={() => signOut()}>Logout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
