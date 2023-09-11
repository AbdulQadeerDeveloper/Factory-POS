import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import PartyTypes from "../../../Comps/PartyTypes";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function PartyCoding() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [fparties, setFparties] = useState([]);
  const [parentobj, setParentobj] = useState({});
  let emptyObject = {
    PartyTypeId: 0,
    PartyId: 0,
    PartyName: "",
    GSTNo: "",
    NTN: "",
    CrLimit: 0,
    CrDays: 0,
    Email: "",
    Abbr: "",
    FirmId: 1,
  };
  const TypeIdRef = useRef(null);
  const ProdIdRef = useRef(null);
  const PartyNameRef = useRef(null);
  const GSTNoRef = useRef(null);
  const NTNRef = useRef(null);
  const EmailRef = useRef(null);
  const AbbrRef = useRef(null);
  const FirmIdRef = useRef(null);
  const CrDaysRef = useRef(null);
  const CrLimitRef = useRef(null);
  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/party")
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

  //#region Filter Product Array Based On PartyTypeId
  useEffect(() => {
    if (parentobj.length > 0) {
      setPartyObject(emptyObject);
      setFparties([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < parties.length; k++) {
          if (parties[k].PartyTypeId === parentobj[j].value) {
            setFparties((p) => [...p, parties[k]]);
            setPartyObject({
              ...partyObject,
              PartyTypeId: parentobj[j].value,
            });
            // setPartyObject({
            //   ...partyObject,
            //   PartyTypeId: parentobj[j].PartyTypeId,
            // });
          }
        }
      }
    } else {
      setFparties(parties);
    }
  }, [parties, parentobj]);
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
      .post("api/party", partyObject)
      .then((res) => {
        alert("Data Added @ID=" + res.data.PartyId);
        let index = fparties.findIndex(
          (x) => x.PartyId === partyObject.PartyId
        );

        if (index >= 0) {
          fparties[index] = partyObject;
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

  function handleDelete(productId) {
    console.log(productId);
    axios
      .delete(`/api/party/${productId}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fparties.findIndex((x) => x.PartyId === productId);
        fparties.splice(index, 1);
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
    // if (parentobj[0]?.PartyTypeId > 0) {
    //     setPartyObject({ PartyTypeId: parentobj[0].PartyTypeId });
    // }
  }
  //#endregion handle Methods

  //#region JSX
  return (
    <>
      <AnimatedPage>
        <div className="container-fluid main_container">
          <div className="main-div">
            {/* <div className='bg-info panel_heading'>
              Party Coding
            </div> */}
            <Header title="Party Coding" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">PartyTypes</div>
              <div className="field_big">
                <PartyTypes parentobj={parentobj} setParentobj={setParentobj} />
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
                          PartyTypeId
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Party ID{" "}
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          Party Name{" "}
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          GSTNo
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          NTN
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
                          Abbr
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          FirmId
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Cr Days
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-3"
                        >
                          Cr Limit
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
                            name="PartyTypeId"
                            type="text"
                            ref={TypeIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyTypeId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyId"
                            type="number"
                            ref={ProdIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyName"
                            type="text"
                            ref={PartyNameRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyName}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="GSTNo"
                            type="text"
                            ref={GSTNoRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.GSTNo}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="NTN"
                            type="text"
                            ref={NTNRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.NTN}
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
                            name="Abbr"
                            type="text"
                            ref={AbbrRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Abbr}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="FirmId"
                            type="number"
                            ref={FirmIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.FirmId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="CrDays"
                            type="number"
                            ref={CrDaysRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.CrDays}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="CrLimit"
                            type="number"
                            ref={CrLimitRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.CrLimit}
                            required
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
                          {/* {
                            !localStorage.getItem('upd-prodtype') ?
                              <input
                                style={{ borderRadius: "2px" }}
                                type="button"
                                onClick={handleAdd}
                                className="btn btn-info cdr_btn"
                                value="Enter" />
                              :
                              <input
                                style={{ borderRadius: "2px" }}
                                type="button"
                                className="btn btn-info cdr_btn btn-block"
                                value="Update" />
                          } */}
                        </td>
                      </tr>
                      {fparties &&
                        fparties.map((x) => (
                          <tr key={x.PartyId}>
                            <td style={{ textAlign: "center" }}>
                              {x.PartyTypeId}
                            </td>
                            <td style={{ textAlign: "center" }}>{x.PartyId}</td>
                            <td style={{ textAlign: "left" }}>{x.PartyName}</td>
                            <td style={{ textAlign: "left" }}>{x.GSTNo}</td>
                            <td style={{ textAlign: "center" }}>{x.NTN}</td>
                            <td style={{ textAlign: "center" }}>{x.Email}</td>
                            <td style={{ textAlign: "center" }}>{x.Abbr}</td>
                            <td style={{ textAlign: "center" }}>{x.FirmId}</td>
                            <td style={{ textAlign: "center" }}>{x.CrDays}</td>
                            <td style={{ textAlign: "center" }}>{x.CrLimit}</td>
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
                                onClick={() => handleDelete(x.PartyId)}
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
      </AnimatedPage>
    </>
  );
  //#endregion handle Methods
}
