import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import Header from "../../../Shared_Components/Header";
import ProdTypes from "../../../Comps/ProdTypes";
import PartiesList from "../../../Comps/PartiesList";
import { GlobalData } from "../../../GlobalData";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function StockOpening() {
  const datacontext = useContext(GlobalData);

  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [fproducts, setFproducts] = useState([]);
  const [parentobj, setParentobj] = useState({}); //Product Type

  let emptyObject = {
    FirmId: 1,
    Id: 0,
    SrNo: 0,
    Date: localStorage.getItem("sDate"),
    PartyId: null,
    PartyName: "",
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

  const [prodObject, setProdObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/pur/opening")
      .then((res) => {
        console.log(res);
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  }, []);

  //#region Fetch All Products
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region Filter Product Array Based On ProdTypeId
  useEffect(() => {
    if (parentobj.length > 0) {
      setProdObject(emptyObject);
      setFproducts([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < products.length; k++) {
          if (products[k].ProdTypeId === parentobj[j].value) {
            setFproducts((p) => [...p, products[k]]);
            setProdObject({
              ...prodObject,
              ProdTypeId: parentobj[j].value,
            });
          }
        }
      }
    } else {
      setFproducts(products);
    }
  }, [products, parentobj]);
  //#endregion

  //#region calculating qty
  useEffect(() => {
    if (prodObject.PQty !== null) {
      let calculate_qty = prodObject.PQty * prodObject.Packing;
      setProdObject({ ...prodObject, Qty: calculate_qty });
    }
  }, [prodObject.PQty]);
  //#endregion

  //#region handle Methods
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setProdObject((p) => {
      return { ...p, [name]: value };
    });

    console.log(prodObject);
  }

  function handleAdd() {
    // console.log(prodObject);
    axios
      .post("api/pur/opening", prodObject)
      .then((res) => {
        console.log(res);
        let index = fproducts.findIndex((x) => x.Id === res.data.Id);

        if (index >= 0) {
          fproducts[index] = prodObject;
        } else {
          setProducts([...products, res.data]);
        }
        setProdObject({
          ...emptyObject,
          PartyId: prodObject.PartyId,
          PartyName: prodObject.PartyName,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function handleEdit(prod) {
    setProdObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/pur/opening/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fproducts.findIndex((x) => x.Id === id);
        fproducts.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.message, color: "alert alert-warning" });
      });
  }

  function handleClear() {
    setProdObject(emptyObject);
    // if (parentobj[0]?.ProdTypeId > 0) {
    //     setProdObject({ ProdTypeId: parentobj[0].ProdTypeId });
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
              Stock Opening
            </div> */}
            <Header title="Stock Opening" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">ProdTypes</div>
              <div className="field_big">
                <ProdTypes parentobj={parentobj} setParentobj={setParentobj} />
              </div>
              <div className="clearfix"></div>
              {msg.err !== "" && (
                <>
                  <div className="msg_div">
                    <div className={msg.color} role="alert">
                      <span className="alert-link">{msg.err}</span>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                </>
              )}
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
                        <th className="bg-color text-left col-xs-2">
                          Party Name
                        </th>
                        <th className="bg-color text-left col-xs-2">
                          Product Name
                        </th>
                        <th className="bg-color text-center">PQty</th>
                        {/* <th className="bg-color text-center">PUnit</th> */}
                        <th className="bg-color text-center">Packing</th>
                        <th className="bg-color text-center">Qty</th>
                        {/* <th className="bg-color text-center">Unit</th> */}
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
                            tabIndex={-1}
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.Id}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="SrNo"
                            tabIndex={-1}
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.SrNo}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Date"
                            type="date"
                            id="fld-1"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.Date}
                            required
                          />
                        </td>
                        <td>
                          <PartiesList
                            childobj={prodObject}
                            setChildobj={setProdObject}
                          />
                        </td>
                        <td>
                          <ProductsList
                            childobj={prodObject}
                            setChildobj={setProdObject}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
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
                              prodObject.PQty !== null ? prodObject.PQty : ""
                            }
                            required
                          />
                          {prodObject.PUnit !== null ? prodObject.PUnit : ""}
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
                              prodObject.Packing !== null
                                ? prodObject.Packing
                                : ""
                            }
                            required
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
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
                              prodObject.Qty !== null ? prodObject.Qty : ""
                            }
                            required
                          />
                          {prodObject.Unit !== null ? prodObject.Unit : ""}
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
                              prodObject.Rate !== null ? prodObject.Rate : ""
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
                              prodObject.GSTPer !== null
                                ? prodObject.GSTPer
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
                              prodObject.AdvPer !== null
                                ? prodObject.AdvPer
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
                      {fproducts &&
                        fproducts.map((x, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: "center" }}>{x.Id}</td>
                            <td style={{ textAlign: "center" }}>{x.SrNo}</td>
                            <td style={{ textAlign: "center" }}>
                              <ConvertedDate date={x.Date} />
                            </td>
                            <td style={{ textAlign: "left" }}>{x.PartyName}</td>
                            <td style={{ textAlign: "left" }}>{x.ProdName}</td>
                            <td style={{ textAlign: "right" }}>
                              {x.PQty} {x.PUnit}
                            </td>
                            {/* <td style={{ textAlign: "left" }}>{x.PUnit}</td> */}
                            <td style={{ textAlign: "right" }}>{x.Packing}</td>
                            <td style={{ textAlign: "right" }}>
                              {x.Qty} {x.Unit}
                            </td>
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
