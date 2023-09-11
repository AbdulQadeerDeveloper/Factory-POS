import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
import CodingStyle from "./coding.module.css";
import PermButtons from "../Shared/PermButtons";

export default function Users() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  let emptyObject = {
    PartyTypeId: 0,
    UserId: 0,
    UserName: "",
    Pwd: "",
    NTN: "",
    CrLimit: 0,
    CrDays: 0,
    Email: "",
    RoleId: "",
    RoleName: 1,
    Margin: 0
  };
  const UserIdRef = useRef(null);
  const UserNameRef = useRef(null);
  const PwdRef = useRef(null);
  const EmailRef = useRef(null);
  const RoleIdRef = useRef(null);
  const MarginRef = useRef(null);
  const RoleNameRef = useRef(null);
  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/perm/users")
      .then((res) => {
        console.log(res);
        setParties(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  }, []);

  //#region Fetch All Parties
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region handle Methods
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setPartyObject((p) => {
      return { ...p, [name]: value };
    });

    // console.log(partyObject);
  }

  function handleAdd() {
    axios
      .post("api/perm/users", partyObject)
      .then((res) => {
        alert("Data Added @ID=" + res.data.UserId);
        let index = parties.findIndex((x) => x.UserId === partyObject.UserId);

        if (index >= 0) {
          parties[index] = partyObject;
          index = parties.findIndex((x) => x.UserId === partyObject.UserId);
          parties[index] = partyObject;
          setPartyObject(emptyObject);
        } else {
          setParties([...parties, res.data]);
          setPartyObject(emptyObject);
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

  function handleEdit(prod) {
    setPartyObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/perm/users/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = parties.findIndex((x) => x.UserId === id);
        parties.splice(index, 1);
      })
      .catch((err) => {
        setMsg({
          ...msg,
          err: err.response.data,
          color: "alert alert-warning",
        });
      });
  }

  function handleClear() {
    setPartyObject(emptyObject);
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
            <div className="bg-info panel_heading">Users Coding</div>
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
                          User Id
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          User Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Pwd
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Email
                        </th>
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
                          Role Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Margin
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1 action_without_print"
                        >
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="UserId"
                            type="number"
                            ref={UserIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.UserId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="UserName"
                            type="text"
                            ref={UserNameRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.UserName}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Pwd"
                            type="password"
                            ref={PwdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Pwd}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Email"
                            type="text"
                            ref={EmailRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Email}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="RoleId"
                            type="text"
                            ref={RoleIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.RoleId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="RoleName"
                            type="text"
                            ref={RoleNameRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.RoleName}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Margin"
                            type="text"
                            ref={MarginRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Margin}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-info btn-xs"
                            onClick={handleAdd}
                          >
                            <i className="fa fa-plus"></i>
                          </button>{" "}
                          &nbsp;
                          <button
                            className="btn btn-info btn-xs"
                            onClick={handleClear}
                          >
                            <i className="fa fa-refresh"></i>
                          </button>
                        </td>
                      </tr>
                      {parties &&
                        parties.map((x) => (
                          <tr key={x.UserId}>
                            <td style={{ textAlign: "center" }}>{x.UserId}</td>
                            <td style={{ textAlign: "left" }}>{x.UserName}</td>
                            <td style={{ textAlign: "center" }}>{"***"}</td>
                            <td style={{ textAlign: "center" }}>{x.Email}</td>
                            <td style={{ textAlign: "center" }}>{x.RoleId}</td>
                            <td style={{ textAlign: "center" }}>
                              {x.RoleName}
                            </td>
                            <td style={{ textAlign: "center" }}>{x.Margin}</td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() => handleEdit(x)}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>{" "}
                              &nbsp;
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDelete(x.UserId)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
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
