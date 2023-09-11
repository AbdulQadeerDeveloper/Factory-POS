import React from "react";
import { Link } from "react-router-dom";

export default function PermButtons() {
  return (
    <>
      <div style={{ textAlign: "center", width: "100%" }}>
        <button>
          <Link to="/users">Configure Users</Link>
        </button>
        <button>
          <Link to="/userroles">Configure User Roles</Link>
        </button>
        <button>
          <Link to="/usermenus">Configure User Menus</Link>
        </button>
        <button>
          <Link to="/userrolemenus">Configure User Role Menus</Link>
        </button>
        <button>
          <Link to="/userparties">Allowed Parties</Link>
        </button>
        <button>
          <Link to="/bypasscrlimit">ByPass Cr Limit</Link>
        </button>
        <button>
          <Link to="/ipaddress">IP Addresses</Link>
        </button>
        <button>
          <Link to="/acsettings">A/C Settings</Link>
        </button>
      </div>
    </>
  );
}
