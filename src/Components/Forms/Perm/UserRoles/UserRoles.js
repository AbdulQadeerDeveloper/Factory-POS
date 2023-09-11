import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
import PermButtons from "../Shared/PermButtons";
import CodingStyle from './coding.module.css';

export default function UserRoles() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  let emptyObject = {
    RoleId: 0,
    RoleName: "",
    IsAdmin: false
  };
  const RoleId = useRef(null)
  const RoleNameRef = useRef(null)
  const IsAdminRef = useRef(null)
  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log('getdata')
    setIsLoading(true);
    axios
      .get("api/perm/userroles")
      .then((res) => {
        console.log(res);
        setParties(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message)
        setIsLoading(false);
      });
  }, [])

  //#region Fetch All Parties
  useEffect(() => {
    getData();

  }, [getData]);
  //#endregion

  //#region handle Methods
  function handleChange(e) {
    const name = e.target.name;
    let value = ""
    if (e.target.type === "checkbox")
      value = e.target.checked;
    else
      value = e.target.value;

    setPartyObject((p) => {
      return { ...p, [name]: value };
    });
    //console.log(partyObject);

  }

  function handleAdd() {
    axios.post("api/perm/userroles", partyObject).then((res) => {
      alert("Data Added @ID=" + res.data.RoleId)
      let index = parties.findIndex(
        (x) => x.RoleId === partyObject.RoleId
      );

      if (index >= 0) {
        parties[index] = partyObject;
        index = parties.findIndex((x) => x.RoleId === partyObject.RoleId);
        parties[index] = partyObject;
        setPartyObject(emptyObject);
      } else {
        setParties([...parties, res.data]);
        setPartyObject(emptyObject);
      }
    })
      .catch(err => {
        alert(err.message + " " + err?.response?.data)
        setMsg({ ...msg, err: err?.response?.data, color: "alert alert-error" });
      })
  }

  function handleEdit(prod) {
    setPartyObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/perm/userroles/${id}`)
      .then((res) => {
        setMsg({ ...msg, err: "Deleted Successfully", color: "alert alert-success" });
        let index = parties.findIndex((x) => x.RoleId === id);
        parties.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.response.data, color: "alert alert-warning" });
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
        <div className='container-fluid' style={{ background: "darkgrey", padding: "7px 0" }}>
          <div className='main-div'>
            <div className='bg-info panel_heading'>
              User Roles Coding
            </div>
            <div className='clearfix'></div>

            <div className={CodingStyle.caption_area} style={{ background: "", padding: "20px 0" }}>
              <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br />
              <PermButtons />
              <div className='clearfix'></div>
            </div>
            <div className='clearfix'></div>

            <div className="panel panel-default transactions_section">
              <div className='printing_area'>
                {/* Child component Area */}
                <div>
                  <table className="table table-bordered" style={{ width: "100%", margin: "0" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }} className="bg-color col-xs-1">Role Id</th>
                        <th style={{ textAlign: "left" }} className="bg-color col-xs-3">Role Name</th>
                        <th style={{ textAlign: "center" }} className="bg-color col-xs-1">IsAdmin</th>
                        <th style={{ textAlign: "center" }} className="bg-color col-xs-1 action_without_print">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="RoleId"
                            type="number"
                            ref={RoleId}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{ borderRadius: "2px", textAlign: "center", color: "#036" }}
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
                            style={{ borderRadius: "2px", textAlign: "left", color: "#036" }}
                            onChange={handleChange}
                            value={partyObject.RoleName}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="IsAdmin"
                            type="checkbox"
                            ref={IsAdminRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{ borderRadius: "2px", textAlign: "center", color: "#036" }}
                            onChange={handleChange}
                            checked={partyObject.IsAdmin}
                            required
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button className="btn btn-info btn-xs" onClick={handleAdd}>
                            <i className='fa fa-plus'></i>
                          </button> &nbsp;
                          <button className="btn btn-info btn-xs" onClick={handleClear}>
                            <i className='fa fa-refresh'></i>
                          </button>
                        </td>
                      </tr>
                      {parties &&
                        parties.map((x) => (
                          <tr key={x.RoleId}>
                            <td style={{ textAlign: "center" }}>{x.RoleId}</td>
                            <td style={{ textAlign: "left" }}>{x.RoleName}</td>
                            <td style={{ textAlign: "center" }}>{x.IsAdmin ? "Yes": "No"}</td>
                            <td style={{ textAlign: "center" }}>
                              <button className="btn btn-info btn-xs" onClick={() => handleEdit(x)}>
                                <i className='fa fa-pencil'></i>
                              </button> &nbsp;
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(x.RoleId)}>
                                <i className='fa fa-times'></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className='clearfix'></div>
                </div>
                {/* Child component Area */}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className='clearfix'></div>
          </div>
          <div className='clearfix'></div>
        </div>
        <div className='clearfix'></div>
      </div>
    </>
  );
  //#endregion handle Methods
}
