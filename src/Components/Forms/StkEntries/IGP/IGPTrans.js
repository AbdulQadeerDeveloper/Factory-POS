import React, { useState, useEffect, useRef } from "react";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import ProDescList from "./ProDescList";
import axios from "../../../AxiosInstance";

export default function IGPTrans(props) {
  const {
    ChildObjEmpty,
    childobj,
    setChildobj,
    ProductRef,
    parentobj,
    transarray,
    setTransarray,
    setMsg,
    msg,
  } = props;

  const PQtyRef = useRef(null);
  const PUnitRef = useRef(null);
  const PackingRef = useRef(null);
  const QtyRef = useRef(null);
  const DescRef2 = useRef(null);
  const ProDescRef = useRef(null);
  const EnterRef = useRef(null);
  const DescRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (childobj.ProductId === null) return;

    setChildOptions([])
    // setSelectParentOptions(e)
    setIsLoading(true)
    axios.get(`api/product/prodesclist?cri=productid=${childobj.ProductId}`)
    .then(res=> {
        setChildOptions(res.data)
        DescRef.current.focus()
        setChildMenuIsOpen(true)
    })
    .catch(err=> {
        alert(err.message)
    })
    .finally(()=> setIsLoading(false))

  }, [childobj.ProductId]);

  // handling FocusNextInputChild
  function FocusNextInputChild(e) {
    if (e.key !== "Enter") return;
    if (PQtyRef.current === document.activeElement) {
      PUnitRef.current && PUnitRef.current.focus();
    } else if (DescRef2.current === document.activeElement) {
      PQtyRef.current && PQtyRef.current.focus();
    } else if (PUnitRef.current === document.activeElement) {
      PackingRef.current && PackingRef.current.focus();
    } else if (PackingRef.current === document.activeElement && PackingRef.current.value > 0) {
      ProDescRef.current && ProDescRef.current.focus();
    } else if (PackingRef.current === document.activeElement) {
      QtyRef.current && QtyRef.current.focus();
    } else if (QtyRef.current === document.activeElement) {
      ProDescRef.current && ProDescRef.current.focus();
    } else if (ProDescRef.current === document.activeElement) {
      if (localStorage.getItem("upd-igp")) {
        UpdatedSingle();
      } else {
        AddSingle();
      }
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // object validation before insert and update
  function HandleValidate() {
    if (childobj.ProdName === "") {
      setMsg({ ...msg, err: "Product is required", color: "alert alert-warning" });
    // } else if (childobj.Rate === null) {
    //   setMsg({ ...msg, err: "Rate is required", color: "alert alert-warning" });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      return true;
    }
  }

  // insert objects into array
  function AddSingle() {
    if (HandleValidate()) {
      // console.log(childobj);
      const val = [...transarray];
      let lngth = val.length;
      val.push({
        ...childobj,
        Id: childobj.Id,
        SrNo: lngth + 1,
        ProductId: childobj.ProductId,
        ProdName: childobj.ProdName,
        Description: DescRef2.current.value.length>0 ? DescRef2.current.value : childobj.Description,
        PQty: childobj.PQty,
        PUnit: childobj.PUnit,
        Packing: childobj.Packing,
        Qty: childobj.Qty,
        Unit: childobj.Unit,
        ProDesc: ProDescRef.current.value.length>0 ? ProDescRef.current.value : childobj.ProDesc,
        isDeleted: 0,
      });
      // val.splice(0, 0, childobj);
      setTransarray(val);
      ChildObjEmpty(); //empty child obj
      DescRef2.current.value = null;
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // get selected object for updation
  function UpdSingle(index) {
    const val = [...transarray];
    let myObj = val.find((obj, i) => i === index);
    // console.log(myObj);
    // setChildobj(myObj);
    setChildobj({
      ...childobj,
      Id: myObj.Id,
      SrNo: 1,
      ProductId: myObj.ProductId,
      ProdName: myObj.ProdName,
      Description: myObj.Description,
      PQty: myObj.PQty,
      PUnit: myObj.PUnit,
      Packing: myObj.Packing,
      Qty: myObj.Qty,
      Unit: myObj.Unit,
      ProDesc: myObj.ProDesc,
      isDeleted: 0,
    });
    let localarr = [];
    localarr.push({ index }, myObj);
    localStorage.setItem("upd-igp", JSON.stringify(localarr));
    setMsg({ ...msg, err: "", color: "" });
  }

  // update selected object from array
  function UpdatedSingle() {
    if (HandleValidate()) {
      let data = JSON.parse(localStorage.getItem("upd-igp"));
      const val = [...transarray];
      val.splice(data[0].index, 1, childobj);
      // console.log(val);
      localStorage.removeItem("upd-igp");
      ChildObjEmpty(); //empty child obj
      setTransarray(val);
      setMsg({ ...msg, err: "", color: "" });
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // remove object from array
  function RemSingle(index) {
    const val = [...transarray];
    if (parentobj.VocNo === 0) {
      val.splice(index, 1);
    }
    if (parentobj.VocNo !== 0) {
      if (val.length > 0) {
        let delObj = val.find((obj, i) => i === index);
        if (delObj.Id === 0) {
          val.splice(index, 1);
        } else {
          delObj = {
            Id: delObj.Id,
            SrNo: delObj.SrNo,
            ProductId: delObj.ProductId,
            ProdName: delObj.ProdName,
            PQty: delObj.PQty,
            PUnit: delObj.PUnit,
            Packing: delObj.Packing,
            Qty: delObj.Qty,
            Unit: delObj.Unit,
            ProDesc: delObj.ProDesc,
            isDeleted: 1,
          };
          val.splice(index, 1, delObj);
        }
      }
    }
    setTransarray(val);
    setMsg({ ...msg, err: "", color: "" });
    ProductRef.current && ProductRef.current.focus();
  }

  function PQtyFun(e) {
    let pquantity = parseInt(e.target.value, 10);
    if (isNaN(pquantity)) {
      setChildobj({ ...childobj, PQty: null });
    } else {
      setChildobj({ ...childobj, PQty: pquantity, Qty: pquantity * childobj.Packing });
    }
    // QtyFun(e)
  }
  function PUnitFun(e) {
    let punit = e.target.value;
    setChildobj({...childobj, PUnit: punit})
  }
  function PackingFun(e) {
    let packing = parseInt(e.target.value, 10);
    if (isNaN(packing)) {
      setChildobj({ ...childobj, Packing: null });
    } else {
      setChildobj({ ...childobj, Packing: packing, Qty: childobj.PQty * packing});
    }
    // QtyFun(e)
  }

  function QtyFun(e) {
    let qty = parseFloat(e.target.value);
    if (isNaN(qty)) {
      setChildobj({ ...childobj, Qty: null });
    } else {
      setChildobj({ ...childobj, Qty: qty });
    }
  }

  
  const [childOptions,setChildOptions] = useState([]);
  const [childMenuIsOpen, setChildMenuIsOpen] = useState(false)
  const HandleChildChange = (e) => {
    setChildobj({ ...childobj, Description: e.label });
    setChildMenuIsOpen(false)
    PQtyRef.current.focus()
  }

  //JSX
  return (
    <div>
      <div>
        <table
          className="table table-bordered"
          style={{ width: "100%", margin: "0" }}
        >
          <thead>
            <tr>
              <th className="bg-color text-left">Id</th>
              <th className="bg-color text-left">SrNo</th>
              <th className="bg-color col-xs-3 text-center poproduct">
                PRODUCT
              </th>
              <th colSpan={3} className="bg-color col-xs-3 text-center poproduct">
                Description
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                PQty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PUnit
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Packing
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Qty
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Unit
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Remarks
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
              <td colSpan={3}>
                <ProductsList
                  childobj={childobj}
                  setChildobj={setChildobj}
                  NextElemRef={DescRef}
                  ProductRef={ProductRef}
                />
              </td>
              <td colSpan={3}>
                <ProDescList childobj={childobj} childRef={DescRef} isLoading={isLoading} childOptions={childOptions}
                childMenuIsOpen={childMenuIsOpen} setChildMenuIsOpen={setChildMenuIsOpen} HandleChildChange={HandleChildChange} />

                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={DescRef2}
                  type="text"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control POOthers"
                />

              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={PQtyRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control POOthers"
                  autoComplete="off"
                  onChange={(e) => PQtyFun(e)}
                  value={childobj.PQty !== null ? childobj.PQty : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={PUnitRef}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  type="text"
                  className="form-control POOthers"
                  autoComplete="off"
                  onChange={(e) => PUnitFun(e) }
                  value={childobj.PUnit !== null ? childobj.PUnit : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={PackingRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control POOthers"
                  autoComplete="off"
                  onChange={(e) => PackingFun(e)}
                  value={childobj.Packing !== null ? childobj.Packing : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  onChange={(e) => QtyFun(e)}
                  ref={QtyRef}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  type="number"
                  className="form-control POOthers"
                  autoComplete="off"
                  value={childobj.Qty === null ? "" : childobj.Qty}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  type="text"
                  className="form-control POOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
                  value={childobj.Unit !== null ? childobj.Unit : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={ProDescRef}
                  type="text"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control POOthers"
                  autoComplete="off"
                  onChange={(e) => {console.log(e); setChildobj({...childobj, ProDesc: e.target.value}) }}
                  value={childobj.ProDesc !== null ? childobj.ProDesc : ""}
                />
              </td>
              <td>
                {!localStorage.getItem("upd-igp") ? (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onKeyDown={(e) => FocusNextInputChild(e)}
                    onClick={AddSingle}
                    className="btn btn-info cdr_btn btn-block"
                    value="Enter"
                  />
                ) : (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onClick={UpdatedSingle}
                    className="btn btn-info cdr_btn btn-block"
                    value="Update"
                  />
                )}
              </td>
            </tr>
            {transarray.length > 0 ? (
              transarray &&
              transarray.map(
                (data, i) =>
                  data.isDeleted === 0 && (
                    <tr key={i} className="entry_row">
                      <td>
                        <span style={{ color: "#036" }}>{data.Id}</span>
                      </td>
                      <td>
                        <span style={{ color: "#036" }}>{data.SrNo}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.ProdName}</span>
                      </td>
                      <td colSpan={3} style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.Description}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.PQty}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.PUnit}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Packing}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Qty}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Unit}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>
                          <Currency value={data.ProDesc} />
                        </span>
                      </td>
                      <td className="action_without_print">
                        <span
                          onClick={() => UpdSingle(i)}
                          className="btn btn-info btn-xs"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-pencil"></i>
                        </span>{" "}
                        &nbsp;
                        <span
                          onClick={() => RemSingle(i)}
                          className="btn btn-danger btn-xs"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-times"></i>
                        </span>
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr style={{ background: "lightgrey", textAlign: "center" }}>
                <td colSpan={12}>Record Not Found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="clearfix"></div>
      </div>
    </div>
  );
}