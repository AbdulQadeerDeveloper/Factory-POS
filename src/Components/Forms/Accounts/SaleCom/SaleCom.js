import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import Parties from "../../../Comps/Parties";
import ProductsList from "../../../Comps/ProductsList";
import SaleManList from "../../../Comps/SalemanList";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function SaleCom() {
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
    SaleManId: null,
    PartyId: null,
    PartyName: "",
    ProductId: null,
    ProdName: "",
    CompPer: null,
    Status: 0,
  };

  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/salecom")
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
    if (parentobj.SaleManId > 0) {
      setPartyObject(emptyObject);
      setFparties([]);
      for (let k = 0; k < parties.length; k++) {
        if (parties[k].SaleManId === parentobj.SaleManId) {
          setFparties((p) => [...p, parties[k]]);
          setPartyObject({
            ...partyObject,
            SaleManId: parentobj.SaleManId,
          });
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
    axios.post("api/salecom", partyObject).then((res) => {
      console.log(res);
      let index = fparties.findIndex((x) => x.Id === partyObject.Id);

      if (index >= 0) {
        fparties[index] = partyObject;
        index = parties.findIndex((x) => x.Id === partyObject.Id);
        parties[index] = partyObject;
        setPartyObject(emptyObject);
      } else {
        setParties([...parties, res.data]);
        setPartyObject(emptyObject);
      }
    });
  }

  function handleEdit(prod) {
    setPartyObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/salecom/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fparties.findIndex((x) => x.Id === id);
        fparties.splice(index, 1);
        index = parties.findIndex((x) => x.Id === id);
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
              Sale Commission
            </div> */}
            <Header title="Sale Commission" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">PartyTypes</div>
              <div className="field_big">
                <SaleManList
                  parentobj={parentobj}
                  setParentobj={setParentobj}
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
                          Id
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          SaleManId
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Party Id
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-4"
                        >
                          PartyName
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Product Id
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          ProdName
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          ComPer
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          Status
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
                            name="SaleManId"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.SaleManId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyId"
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
                              partyObject.PartyId !== null
                                ? partyObject.PartyId
                                : ""
                            }
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
                          <input
                            name="ProductId"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.ProductId}
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
                            name="ComPer"
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
                              partyObject.ComPer !== null
                                ? partyObject.ComPer
                                : ""
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Status"
                            type="text"
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
                        fparties.map((x, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: "center" }}>{x.Id}</td>
                            <td style={{ textAlign: "center" }}>
                              {x.SaleManId}
                            </td>
                            <td style={{ textAlign: "center" }}>{x.PartyId}</td>
                            <td style={{ textAlign: "left" }}>{x.PartyName}</td>
                            <td style={{ textAlign: "center" }}>
                              {x.ProductId}
                            </td>
                            <td style={{ textAlign: "left" }}>{x.ProdName}</td>
                            <td style={{ textAlign: "center" }}>{x.ComPer}</td>
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
      </AnimatedPage>
    </>
  );
  //#endregion handle Methods
}
