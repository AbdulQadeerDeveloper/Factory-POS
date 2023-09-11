import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "../../../AxiosInstance";
import GetPartiesList from "../../../Comps/PartiesList";
import PermButtons from "../Shared/PermButtons";
import CodingStyle from "./coding.module.css";

export default function ByPassCrLimit() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  let emptyObject = {
    Id: 0,
    PartyId: 0,
    PartyName: "",
    ExcessLimit: 0,
  };

  const btnAddRef = useRef(null);
  const ExcessLimitRef = useRef(null);
  const partyRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [dataObject, setDataObject] = useState([emptyObject]);
  const [data, setData] = useState([]);
  //#endregion variables

  const getData = useCallback(() => {
    setIsLoading(true);

    axios
      .get(`api/perm/bypasscrlimit`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
    setDataObject({ emptyObject });
  }, []);

  //#region Fetch All Parties
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region handle Methods

  function handleAdd(e, obj) {
    axios
      .post("api/perm/bypasscrlimit", dataObject)
      .then((res) => {
        //alert("Data Added @ID=" + res.data.Id);
        let index = data.findIndex((x) => x.Id === res.data.Id);

        if (index >= 0) {
          data[index] = dataObject;
          index = data.findIndex((x) => x.Id === res.data.Id);
          data[index] = dataObject;
          setDataObject(emptyObject);
        } else {
          setData([...data, res.data]);
          setDataObject(emptyObject);
        }

        partyRef.current?.focus();


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
  function handleKeyDown(e) {
    if (e.key === "Enter") btnAddRef.current.focus()
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setDataObject((p) => {
      return { ...p, [name]: value };
    });

    // console.log(partyObject);
  }

  function handleClear() {
    setDataObject(emptyObject);
  }

  function handleEdit(prod) {
    setDataObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/perm/bypasscrlimit/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = data.findIndex((x) => x.Id === id);
        data.splice(index, 1);
      })
      .catch((err) => {
        setMsg({
          ...msg,
          err: err.response.data,
          color: "alert alert-warning",
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
              ByPass Party's Credit Limit
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
                          Id
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Party Id
                        </th>
                        <th
                          style={{ textAlign: "right" }}
                          className="bg-color col-xs-8"
                        >
                          Party Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Excess Limit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="Id"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            readOnly
                            onChange={handleChange}
                            value={dataObject.Id}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyId"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={dataObject.PartyId}
                            required
                          />
                        </td>
                        <td>
                          <GetPartiesList
                            PartyRef={partyRef}
                            childobj={dataObject}
                            setChildobj={setDataObject}
                            NextElemRef={ExcessLimitRef}
                          />
                        </td>
                        <td>
                          <input
                            name="ExcessLimit"
                            type="number"
                            ref={ExcessLimitRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            value={dataObject.ExcessLimit}
                            required
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            ref={btnAddRef}
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

                      {data &&
                        data.map((x) => (
                          <tr key={x.Id}>
                            <td style={{ textAlign: "center" }}>{x.Id}</td>
                            <td style={{ textAlign: "center" }}>{x.PartyId}</td>
                            <td style={{ textAlign: "right" }}>
                              {x.PartyName}
                            </td>
                            <td style={{ textAlign: "right" }}>{x.ExcessLimit}</td>
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
                                onClick={() => handleDelete(x.Id)}
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
