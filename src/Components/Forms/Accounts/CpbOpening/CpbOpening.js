import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import PartyTypes from "../../../Comps/PartyTypes";
import Parties from "../../../Comps/Parties";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";
import BanksList from "../../../Comps/BanksList";
import CashAcList from "../../../Comps/CashAcList";
import Header from "../../../Shared_Components/Header";
import { useContext } from "react";
import { GlobalData } from "../../../GlobalData";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function CpbOpening() {
  const datacontext = useContext(GlobalData);

  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [fparties, setFparties] = useState([]);
  const [parentobj, setParentobj] = useState({}); //Party Type
  let emptyObject = {
    Id: 0,
    SrNo: 0,
    Date: localStorage.getItem("sDate"),
    BankId: null,
    BankName: "",
    CPB: null,
    CHQNo: null,
    Dated: new Date().toISOString().slice(0, 10),
    IssueTo: null,
    IssueToName: "",
    isAct: false,
    PartyId: null,
    PartyName: "",
    Description: "Opening...",
    NetCredit: null,
    Status: 0,
  };

  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/cpb/opening")
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
          if (parties[k].PartyTypeId === parentobj[j].PartyTypeId) {
            setFparties((p) => [...p, parties[k]]);
            setPartyObject({
              ...partyObject,
              PartyTypeId: parentobj[j].PartyTypeId,
            });
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

    console.log(partyObject);
  }

  function handleAdd() {
    // console.log(partyObject);
    axios.post("api/cpb/opening", partyObject).then((res) => {
      console.log(res);
      let index = fparties.findIndex((x) => x.PartyId === partyObject.PartyId);

      if (index >= 0) {
        fparties[index] = partyObject;
        index = parties.findIndex((x) => x.PartyId === partyObject.PartyId);
        parties[index] = partyObject;
        setPartyObject(emptyObject);
      } else {
        setParties([...parties, res.data]);
      }
    });
  }

  function handleEdit(prod) {
    setPartyObject({
      ...prod,
      Date: prod.Date.slice(0, 10),
      Dated: prod.Dated.slice(0, 10),
    });
  }

  function handleDelete(productId) {
    console.log(productId);
    axios
      .delete(`/api/cpb/opening/${productId}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fparties.findIndex((x) => x.PartyId === productId);
        fparties.splice(index, 1);
        index = parties.findIndex((x) => x.PartyId === productId);
        parties.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.message, color: "alert alert-warning" });
      });
  }

  function handleClear() {
    setPartyObject(emptyObject);
    // if (parentobj[0]?.PartyTypeId > 0) {
    //     setPartyObject({ PartyTypeId: parentobj[0].PartyTypeId });
    // }
  }

  function CheckBoxFunc() {
    if (partyObject.isAct === false) {
      setPartyObject({ ...partyObject, isAct: true });
    } else {
      setPartyObject({ ...partyObject, isAct: false });
    }
  }
  //#endregion handle Methods

  //#region JSX
  return (
    <>
      <AnimatedPage>
        <div className="container-fluid main_container">
          <div className="main-div">
            {/* <div className='bg-info panel_heading'>
              CPB Opening
            </div> */}
            <Header title="CPB Opening" isLoading={isLoading} />
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
                        <th className="bg-color text-center">Id</th>
                        <th className="bg-color text-center">SrNo</th>
                        <th className="bg-color text-center">Date</th>
                        <th className="bg-color text-center col-xs-2">Party</th>
                        <th className="bg-color col-xs-2">Bank</th>
                        <th className="bg-color text-center">CPB</th>
                        <th className="bg-color text-center">CHQNo</th>
                        <th className="bg-color text-center col-xs-1">Dated</th>
                        <th className="bg-color col-xs-2 text-center">
                          IssueTo
                        </th>
                        <th className="bg-color text-center">isAct</th>
                        <th className="bg-color col-xs-2 text-left">
                          Description
                        </th>
                        <th className="bg-color col-xs-1 text-center">
                          Credit
                        </th>
                        <th className="bg-color col-xs-1 text-center">
                          Status
                        </th>
                        <th className="bg-color col-xs-1 action_without_print">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="Id"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Id}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="SrNo"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.SrNo}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Date"
                            type="date"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Date}
                            required
                          />
                        </td>
                        <td>
                          <Parties
                            parentobj={partyObject}
                            setParentobj={setPartyObject}
                          />
                        </td>
                        <td>
                          <BanksList
                            childobj={partyObject}
                            setChildobj={setPartyObject}
                          />
                        </td>
                        <td>
                          <input
                            name="CPB"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.CPB !== null ? partyObject.CPB : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="CHQNo"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.CHQNo !== null
                                ? partyObject.CHQNo
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Dated"
                            type="date"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.Dated !== null
                                ? partyObject.Dated
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <CashAcList
                            childobj={partyObject}
                            setChildobj={setPartyObject}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {partyObject.isAct === false && (
                            <input
                              style={{
                                borderRadius: "2px",
                                color: "#036",
                                width: "100%",
                              }}
                              onKeyPress={(e) => handleChange(e)}
                              onClick={CheckBoxFunc}
                              type="checkbox"
                              name="isAct"
                              className="checkbox CPBCheck"
                            />
                          )}
                          {partyObject.isAct === true && (
                            <input
                              style={{
                                borderRadius: "2px",
                                color: "#036",
                                width: "100%",
                              }}
                              defaultChecked
                              onKeyPress={(e) => handleChange(e)}
                              onClick={CheckBoxFunc}
                              type="checkbox"
                              name="isAct"
                              className="checkbox CPBCheck"
                            />
                          )}
                        </td>
                        <td>
                          <input
                            name="Description"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Description}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="NetCredit"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.NetCredit !== null
                                ? partyObject.NetCredit
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Status"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.Status}
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
                        </td>
                      </tr>
                      {fparties &&
                        fparties.map((x, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: "center" }}>{x.Id}</td>
                            <td style={{ textAlign: "center" }}>{x.SrNo}</td>
                            <td style={{ textAlign: "center" }}>
                              <ConvertedDate date={x.Date} />
                            </td>
                            <td style={{ textAlign: "left" }}>{x.PartyName}</td>
                            <td style={{ textAlign: "left" }}>{x.BankName}</td>
                            <td style={{ textAlign: "center" }}>{x.CPB}</td>
                            <td style={{ textAlign: "center" }}>{x.CHQNo}</td>
                            <td style={{ textAlign: "center" }}>
                              <ConvertedDate date={x.Dated} />
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {x.IssueToName}{" "}
                            </td>
                            <td style={{ textAlign: "left" }}>{x.isAct} </td>
                            <td style={{ textAlign: "left" }}>
                              {x.Description}{" "}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Currency value={x.NetCredit} />
                            </td>
                            <td style={{ textAlign: "center" }}>{x.Status}</td>
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
