import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import PartyTypes from "../../../Comps/PartyTypes";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import Header from "../../../Shared_Components/Header";
import { GlobalData } from "../../../GlobalData";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function PoOpening() {
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
  const [childobj, setChildobj] = useState({});
  let emptyObject = {
    Id: 0,
    SrNo: 0,
    Date: localStorage.getItem("sDate"),
    ProductId: null,
    ProdName: "",
    PQty: null,
    PUnit: null,
    Packing: null,
    Qty: null,
    Unit: null,
    Rate: null,
    GSTPer: null,
    AdvPer: null,
  };

  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/ledger/jv/0")
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

  //#region calculating qty
  useEffect(() => {
    if (partyObject.PQty !== null) {
      let calculate_qty = partyObject.PQty * partyObject.Packing;
      setPartyObject({ ...partyObject, Qty: calculate_qty });
    }
  }, [partyObject.PQty]);
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
    axios.post("api/ledger/opening", partyObject).then((res) => {
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
    setPartyObject(prod);
  }

  function handleDelete(productId) {
    console.log(productId);
    axios
      .delete(`/api/ledger/opening/${productId}`)
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
  //#endregion handle Methods

  //#region JSX
  return (
    <>
      <AnimatedPage>
        <div className="container-fluid main_container">
          <div className="main-div">
            {/* <div className='bg-info panel_heading'>
              PO Opening
            </div> */}
            <Header title="PO Opening" isLoading={isLoading} />
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
                        <th className="bg-color text-left col-xs-3">
                          Product Name
                        </th>
                        <th className="bg-color">PQty</th>
                        <th className="bg-color text-center">PUnit</th>
                        <th className="bg-color text-center">Packing</th>
                        <th className="bg-color text-center">Qty</th>
                        <th className="bg-color text-center">Unit</th>
                        <th className="bg-color text-center">Rate</th>
                        <th className="bg-color text-left">GstPer</th>
                        <th className="bg-color text-center">AdvPer</th>
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
                          <ProductsList
                            childobj={partyObject}
                            setChildobj={setPartyObject}
                          />
                        </td>
                        <td>
                          <input
                            name="PQty"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.PQty !== null ? partyObject.PQty : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PUnit"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.PUnit !== null
                                ? partyObject.PUnit
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Packing"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.Packing !== null
                                ? partyObject.Packing
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Qty"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={
                              partyObject.Qty !== null ? partyObject.Qty : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Unit"
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
                              partyObject.Unit !== null ? partyObject.Unit : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Rate"
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
                              partyObject.Rate !== null ? partyObject.Rate : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="GSTPer"
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
                              partyObject.GSTPer !== null
                                ? partyObject.GSTPer
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="AdvPer"
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
                              partyObject.AdvPer !== null
                                ? partyObject.AdvPer
                                : ""
                            }
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
                            <td style={{ textAlign: "center" }}>
                              {x.PartyName}
                            </td>
                            <td style={{ textAlign: "right" }}>{x.PQty}</td>
                            <td style={{ textAlign: "left" }}>{x.PUnit}</td>
                            <td style={{ textAlign: "right" }}>{x.Packing}</td>
                            <td style={{ textAlign: "right" }}>{x.Qty}</td>
                            <td style={{ textAlign: "left" }}>{x.Unit} </td>
                            <td style={{ textAlign: "right" }}>
                              <Currency value={x.Rate} />{" "}
                            </td>
                            <td style={{ textAlign: "right" }}>{x.GSTPer} </td>
                            <td style={{ textAlign: "right" }}>{x.AdvPer}</td>
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
