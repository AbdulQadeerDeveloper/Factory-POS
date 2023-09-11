import React from "react";

const LoggedInUser = ({ getDataApi }) => {
  let userName =
    JSON.parse(window.localStorage.getItem("user"))?.UserName || "";

  return (
    <div style={{ backgroundColor: "aliceblue" }}>
      {userName && (
        <div className="loggedinuser">
          {" "}
          User: {userName}
          <button onClick={getDataApi}>Refresh Data</button>
        </div>
      )}
    </div>
  );
};

export default LoggedInUser;
