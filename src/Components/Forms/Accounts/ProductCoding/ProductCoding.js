import React, { useEffect, useRef, useState, useCallback } from "react";
import ProdTypes from "../../../Comps/ProdTypes";
import axios from "../../../AxiosInstance";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
// import CodingStyle from './coding.module.css';

export default function ProductCoding() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [fproducts, setFproducts] = useState([]);
  const [parentobj, setParentobj] = useState({});
  let emptyObject = {
    ProdTypeId: 0,
    ProductId: 0,
    ProdName: "",
    Packing: "",
    PUnit: "",
    Unit: "",
    Abbr: "",
  };
  const TypeIdRef = useRef(null);
  const ProdIdRef = useRef(null);
  const ProdNameRef = useRef(null);
  const PackingRef = useRef(null);
  const PUnitRef = useRef(null);
  const UnitRef = useRef(null);
  const AbbrRef = useRef(null);
  const [prodObject, setProdObject] = useState(emptyObject);
  //#endregion variables
  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/product")
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
            // setProdObject({
            //   ...prodObject,
            //   ProdTypeId: parentobj[j].ProdTypeId,
            // });
          }
        }
      }
    } else {
      setFproducts(products);
    }
  }, [products, parentobj]);
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
    axios
      .post("api/product", prodObject)
      .then((res) => {
        console.log(res);
        let index = fproducts.findIndex(
          (x) => x.ProductId === prodObject.ProductId
        );

        if (index >= 0) {
          fproducts[index] = prodObject;
          setProdObject(emptyObject);
        } else {
          setProducts([...products, res.data]);
          setProdObject(emptyObject);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
      });
  }

  function handleEdit(prod) {
    setProdObject(prod);
  }

  function handleDelete(productId) {
    console.log(productId);
    axios
      .delete(`/api/product/${productId}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fproducts.findIndex((x) => x.ProductId === productId);
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
              Product Coding
            </div> */}
            <Header title="Product Coding" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">PartyTypes</div>
              <div className="field_big">
                <ProdTypes parentobj={parentobj} setParentobj={setParentobj} />
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
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          ProdTypeId
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Product ID{" "}
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          Prod Name{" "}
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Packing
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          PUnit
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Unit
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Abbr
                        </th>
                        <th
                          style={{ textAlign: "left" }}
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
                            name="ProdTypeId"
                            type="text"
                            ref={TypeIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.ProdTypeId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="ProductId"
                            type="text"
                            ref={ProdIdRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.ProductId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="ProdName"
                            type="text"
                            ref={ProdNameRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.ProdName}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Packing"
                            type="text"
                            ref={PackingRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.Packing}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PUnit"
                            type="text"
                            ref={PUnitRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.PUnit}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="Unit"
                            type="text"
                            ref={UnitRef}
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.Unit}
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
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodObject.Abbr}
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
                      {fproducts &&
                        fproducts.map((x) => (
                          <tr key={x.ProductId}>
                            <td>{x.ProdTypeId}</td>
                            <td>{x.ProductId}</td>
                            <td>{x.ProdName}</td>
                            <td style={{ textAlign: "left" }}>{x.Packing}</td>
                            <td style={{ textAlign: "center" }}>{x.PUnit}</td>
                            <td style={{ textAlign: "center" }}>{x.Unit}</td>
                            <td style={{ textAlign: "center" }}>{x.Abbr}</td>
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
                                onClick={() => handleDelete(x.ProductId)}
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
