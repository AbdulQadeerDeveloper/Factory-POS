import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
import PermButtons from "../Shared/PermButtons";
import CodingStyle from "./coding.module.css";
import SelUserRoles from "./SelUserRoles";

export default function UserRoleMenus() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [userRoleObject, setUserRoleObject] = useState([
    { value: 1, label: "admin" },
  ]);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);

    axios
      .get("api/perm/userroles/userroleslist")
      .then((res) => {
        console.log(res);
        setUserRoles(res.data);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
        return;
      });

    axios
      .get(`api/perm/userrolemenus/${userRoleObject?.value || 1}`)
      .then((res) => {
        console.log(res);
        setParties(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  }, [userRoleObject.value]);

  //#region Fetch All Parties
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region handle Methods

  function handleAdd(e, obj) {
    const name = e.target.name;
    const value = e.target.checked;
    obj = {
      ...obj,
      [name]: value,
    };
    axios
      .put("api/perm/userrolemenus", obj)
      .then((res) => {
        let index = parties.findIndex((x) => x.MenuId === res.data[0].MenuId);

        if (index >= 0) {
          const newParties = [...parties];
          newParties[index] = res.data[0];
          setParties(newParties);
        } else {
          setParties([...parties, res.data[0]]);
        }
      })
      .catch((err) => {
        alert(err.message + " " + err?.response?.data);
        setMsg({
          ...msg,
          err: err?.response?.data,
          color: "alert alert-error",
        });
      });
  }
  //#endregion handle Methods

  //#region JSX
  return (
    <>
      <div>
        <div
          className="container-fluid"
          style={{ background: "darkgrey", padding: "7px 0" }}
        >
          <div className="main-div">
            <div className="bg-info panel_heading">
              Menus Configuration for User Roles
            </div>
            <div className="clearfix"></div>

            <div
              className={CodingStyle.caption_area}
              style={{ background: "", padding: "20px 0" }}
            >
              <div className="col-md-12" style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br />
              <PermButtons />
              <br />
              <div className={CodingStyle.caption_party}>User Menus</div>
              <div className={CodingStyle.field_party}>
                <SelUserRoles
                  userRoles={userRoles}
                  userRoleObject={userRoleObject}
                  setUserRoleObject={setUserRoleObject}
                />
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>

            <div className="panel panel-default transactions_section">
              <div className="printing_area">
                {/* Child component Area */}
                <div>
                  <table
                    className="table table-bordered"
                    style={{ width: "100%", margin: "0" }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Role Id
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Menu Id
                        </th>
                        <th
                          style={{ textAlign: "right" }}
                          className="bg-color col-xs-3"
                        >
                          Menu Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow Select
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow Entry
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow Post
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow Audit
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow Approve
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Allow UnPost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parties &&
                        parties.map((x) => (
                          <tr key={x.MenuId}>
                            <td style={{ textAlign: "center" }}>{x.RoleId}</td>
                            <td style={{ textAlign: "center" }}>{x.MenuId}</td>
                            <td style={{ textAlign: "right" }}>{x.MenuName}</td>
                            {/* <td style={{ textAlign: "center" }}>{x.AllowSelect ? "Yes" : "No"}</td> */}
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowSelect"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowSelect}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowEntry"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowEntry}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowPost"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowPost}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowAudit"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowAudit}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowApprove"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowApprove}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                name="AllowUnPost"
                                onClick={(e) => handleAdd(e, x)}
                                style={{
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  color: "#036",
                                }}
                                type="checkbox"
                                checked={x.AllowUnPost}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="clearfix"></div>
                </div>
                {/* Child component Area */}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
    </>
  );
  //#endregion handle Methods
}
