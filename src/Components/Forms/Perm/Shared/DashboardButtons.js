import React from "react";
import { Link } from "react-router-dom";

export default function DashboardButtons({ menu, setCurrentDashBoard }) {
  return (
    <>
      <div style={{ padding: '5px', textAlign: "center", width: "100%" }}>
        {menu.includes("DashBoard1") && (
          <button className="btn btn-secondary" onClick={()=> setCurrentDashBoard("DashBoard1") }>DashBoard1
          </button>
        )}
        {menu.includes("DashBoard2") && (
          <button className="btn btn-secondary" onClick={()=> setCurrentDashBoard("DashBoard2") }>DashBoard2
          </button>
        )}
      </div>
    </>
  );
}
