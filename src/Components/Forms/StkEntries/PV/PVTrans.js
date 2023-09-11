import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Currency from "../../../Shared_Components/Currency";
import POProductsList from "./POProductsList";
import ProductsList from "../../../Comps/ProductsList";
import PrintIGP from "../../../Prints/StkPrints/PrintIGP";
import { GlobalData } from "../../../GlobalData";
import PrintGRN from "../../../Prints/StkPrints/PrintGRN";

export default function PVTrans(props) {
  const contextdata = useContext(GlobalData);
  const navigate = useNavigate();

  const {
    isLoading,
    ProductRef,
    DateRef,
    transarray,
    setTransarray,
    setMsg,
    msg,
    parentobj,
    ParentObjEmpty,
    SubmitVoucher,
    DelConfirmation,
  } = props;

  const DemandRef = useRef(null);
  // const CurBalRef = useRef(null);
  const PQtyRef = useRef(null);
  const PackingRef = useRef(null);
  const RateRef = useRef(null);
  const GstRef = useRef(null);
  const AdvRef = useRef(null);
  const EnterRef = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    Demand: null,
    CurBal: null,
    ProductId: null,
    ProdName: null,
    Description: "",
    PQty: null,
    PUnit: null,
    Packing: null,
    Qty: null,
    Unit: null,
    Rate: null,
    GSTPer: null,
    AdvPer: null,
    isDeleted: 0,
  };
  const [childobj, setChildobj] = useState(child_tmp_obj);
  function ChildObjEmpty() {
    setChildobj(child_tmp_obj);
  }

  const pageStyle = `@page {size: portrait}`;
  const igpRef = useRef();
  const grnRef = useRef();
  const handleIgpRef = useReactToPrint({
    content: () => igpRef.current,
    documentTitle: "IGP",
    pageStyle: pageStyle,
  });
  const handleGrnRef = useReactToPrint({
    content: () => grnRef.current,
    documentTitle: "Purchase",
    pageStyle: pageStyle,
  });

  useEffect(() => {
    if (childobj.PQty !== null && childobj.ProductId !== null) {
      let quantity = childobj.PQty * childobj.Packing;
      setChildobj({ ...childobj, Qty: quantity });
    }
  }, [childobj.PQty, childobj.ProductId]);

  // handling focus on inputs
  function FocusNextInputChild(e) {
    if (e.key !== "Enter") return;
    if (PQtyRef.current === document.activeElement) {
      RateRef.current && RateRef.current.focus();
    } else if (RateRef.current === document.activeElement) {
      if (localStorage.getItem("upd-pur")) {
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
      ProductRef.current && ProductRef.current.focus();
      setMsg({
        ...msg,
        err: "Product is required",
        color: "alert alert-warning",
      });
    } else if (childobj.PQty === null || childobj.PQty === 0) {
      PQtyRef.current && PQtyRef.current.focus();
      setMsg({
        ...msg,
        err: "Packing Qty is required",
        color: "alert alert-warning",
      });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      return true;
    }
  }

  // insert objects into array
  function AddSingle() {
    if (HandleValidate()) {
      // console.log(childobj);
      if (contextdata?.acSettings[0]?.PurThroughPO === false || childobj.PQty <= childobj.CurBal) {
        const val = [...transarray];
        let lngth = val.length;
        val.push({
          ...childobj,
          Id: childobj.Id,
          SrNo: lngth + 1,
          ProductId: childobj.ProductId,
          ProdName: childobj.ProdName,
          PQty: childobj.PQty,
          PUnit: childobj.PUnit,
          Packing: childobj.Packing,
          Qty: childobj.Qty,
          Unit: childobj.Unit,
          Rate: childobj.Rate,
          GSTPer: childobj.GSTPer,
          AdvPer: childobj.AdvPer,
          isDeleted: 0,
        });
        // val.splice(0, 0, childobj);
        setTransarray(val);
        ChildObjEmpty(); // child obj empty
        ProductRef.current && ProductRef.current.focus();
      } else {
        PQtyRef.current && PQtyRef.current.focus();
        setMsg({
          ...msg,
          err: "Packing Qty Should Be Less Than CurBal",
          color: "alert alert-warning",
        });
      }
    }
  }

  // get selected object for updation
  function UpdSingle(index) {
    const val = [...transarray];
    let myObj = val.find((obj, i) => i === index);
    setChildobj({
      ...childobj,
      Id: myObj.Id,
      SrNo: 1,
      Demand: myObj.Demand,
      CurBal: myObj.CurBal,
      ProductId: myObj.ProductId,
      ProdName: myObj.ProdName,
      PQty: myObj.PQty,
      PUnit: myObj.PUnit,
      Packing: myObj.Packing,
      Qty: myObj.Qty,
      Unit: myObj.Unit,
      Rate: myObj.Rate,
      GSTPer: myObj.GSTPer,
      AdvPer: myObj.AdvPer,
      isDeleted: 0,
    });
    let localarr = [];
    localarr.push({ index }, myObj);
    localStorage.setItem("upd-pur", JSON.stringify(localarr));
    setMsg({ ...msg, err: "", color: "" });
    PQtyRef.current && PQtyRef.current.focus();
  }

  // update selected object from array
  function UpdatedSingle() {
    if (HandleValidate()) {
      if (childobj.PQty <= childobj.CurBal) {
        let data = JSON.parse(localStorage.getItem("upd-pur"));
        const val = [...transarray];
        val.splice(data[0].index, 1, childobj);
        // console.log(val);
        localStorage.removeItem("upd-pur");
        ChildObjEmpty(); // child obj empty
        setTransarray(val);
        setMsg({ ...msg, err: "", color: "" });
        ProductRef.current && ProductRef.current.focus();
      } else {
        PQtyRef.current && PQtyRef.current.focus();
        setMsg({
          ...msg,
          err: "Packing Qty Should Be Less Than CurBal",
          color: "alert alert-warning",
        });
      }
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
            Rate: delObj.Rate,
            GSTPer: delObj.GSTPer,
            AdvPer: delObj.AdvPer,
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

  // New Voucher clean every state
  function NewVoucher() {
    setMsg({ ...msg, err: "", color: "" });
    DateRef.current && DateRef.current.focus();
    ParentObjEmpty(); // empty parent obj
    ChildObjEmpty(); // empty child obj
    setTransarray([]);
    navigate(`/pv/0`);
  }

  function PQtyFun(e) {
    let pquantity = parseInt(e.target.value, 10);
    if (isNaN(pquantity)) {
      setChildobj({ ...childobj, PQty: null });
    } else {
      setChildobj({ ...childobj, PQty: pquantity });
    }
  }
  function PackingFun(e) {
    let packing = parseInt(e.target.value, 10);
    if (isNaN(packing)) {
      setChildobj({ ...childobj, Packing: null });
    } else {
      setChildobj({ ...childobj, Packing: packing });
    }
  }
  function RateFun(e) {
    let rt = parseFloat(e.target.value);
    if (isNaN(rt)) {
      setChildobj({ ...childobj, Rate: null });
    } else {
      setChildobj({ ...childobj, Rate: rt });
    }
  }
  function GSTFun(e) {
    let gst = parseFloat(e.target.value);
    if (isNaN(gst)) {
      setChildobj({ ...childobj, GSTPer: null });
    } else {
      setChildobj({ ...childobj, GSTPer: gst });
    }
  }
  function AdvFun(e) {
    let adv = parseFloat(e.target.value);
    if (isNaN(adv)) {
      setChildobj({ ...childobj, AdvPer: null });
    } else {
      setChildobj({ ...childobj, AdvPer: adv });
    }
  }
  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  //JSX
  return (
    <div>
      <div>
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%", margin: "0" }}
        >
          <thead>
            <tr>
              <th className="bg-color text-left">Id</th>
              <th className="bg-color text-left">SrNo</th>
              <th className="bg-color col-xs-2 text-center igpproduct">
                Product
              </th>
              {contextdata?.acSettings[0]?.PurThroughPO && <>
                <th className="bg-color col-xs-1 text-center">Demand</th>
                <th className="bg-color col-xs-1 text-center">CurBal</th>
              </>
              }
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PQty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PUnit
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Packing
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Qty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Unit
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Rate
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                GSTPer
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                AdvPer
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
              <td colSpan={3}>
                {contextdata?.acSettings[0]?.PurThroughPO ?
                  <POProductsList
                    parentobj={parentobj}
                    childobj={childobj}
                    setChildobj={setChildobj}
                    NextElemRef={PQtyRef}
                    ProductRef={ProductRef}
                  />
                  :
                  <ProductsList
                    childobj={childobj}
                    setChildobj={setChildobj}
                    NextElemRef={PQtyRef}
                    ProductRef={ProductRef}
                  />
                }
              </td>
              {contextdata?.acSettings[0]?.PurThroughPO &&
                <>
                  <td>
                    <input
                      style={{
                        borderRadius: "2px",
                        textAlign: "right",
                        color: "#036",
                      }}
                      ref={DemandRef}
                      type="number"
                      onKeyDown={(e) => FocusNextInputChild(e)}
                      className="form-control IGPOthers"
                      autoComplete="off"
                      readOnly
                      tabIndex={-1}
                      value={childobj.Demand !== null ? childobj.Demand : ""}
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        borderRadius: "2px",
                        textAlign: "right",
                        color: "#036",
                      }}
                      type="number"
                      onKeyDown={(e) => FocusNextInputChild(e)}
                      className="form-control IGPOthers"
                      autoComplete="off"
                      readOnly
                      tabIndex={-1}
                      value={childobj.CurBal !== null ? childobj.CurBal : ""}
                    />
                  </td>
                </>
              }
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
                  className="form-control IGPOthers"
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
                  type="text"
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
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
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
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
                  type="text"
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
                  value={childobj.Qty !== null ? childobj.Qty : ""}
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
                  className="form-control IGPOthers"
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
                  ref={RateRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  // readOnly
                  tabIndex={-1}
                  onChange={(e) => RateFun(e)}
                  value={childobj.Rate !== null ? childobj.Rate : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={GstRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
                  onChange={(e) => GSTFun(e)}
                  value={childobj.GSTPer !== null ? childobj.GSTPer : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={AdvRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
                  onChange={(e) => AdvFun(e)}
                  value={childobj.AdvPer !== null ? childobj.AdvPer : ""}
                />
              </td>
              <td>
                {!localStorage.getItem("upd-pur") ? (
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
            {transarray &&
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
                      {contextdata?.acSettings[0]?.PurThroughPO && <>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: "#036" }}>{data.Demand}</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: "#036" }}>{data.CurBal}</span>
                        </td>
                      </>
                      }

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
                          <Currency value={data.Rate} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.GSTPer}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.AdvPer}</span>
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
              )}
            {/* <tr className="transactions" style={{ display: "none" }}></tr>
                        <tr style={{ backgroundColor: "#f8f8f8", fontWeight: "bold", height: "30px" }}>
                            <td colSpan="9" style={{ textAlign: "right" }}>Total Balance</td>
                            <td colSpan="2" className="drCrDiffer" style={{ textAlign: "right", color: "#042377" }} title="Diffrence">
                                Total Amount
                            </td>
                            <td></td>
                        </tr> */}
          </tbody>
        </table>
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

      <div className="voc_btn_bottom">
        <input
          type="button"
          onClick={() => DelConfirmation(parentobj.VocNo)}
          disabled={parentobj.VocNo === 0 ? true : false}
          className="btn btn-danger"
          value="Delete Voc"
        />
        <input
          type="button"
          onClick={NewVoucher}
          className="btn btn-info"
          value="New Voc"
        />
        {parentobj.Status === 0 && parentobj.VocNo > 0 && (
          <input
            type="button"
            onClick={PostEntry}
            className="btn btn-info"
            value="Post Entry"
          />
        )}
        <button onClick={handleIgpRef} className="btn btn-info">
          IGP Print
        </button>
        <button onClick={handleGrnRef} className="btn btn-info">
          GRN Print
        </button>
        <button
          onClick={SubmitVoucher}
          disabled={isLoading}
          className="btn btn-info"
        >
          {parentobj.VocNo > 0 ? "Update" : "Post"}
        </button>
      </div>
      <div className="clearfix"></div>
      <div>
        <PrintIGP
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          componentRef={igpRef}
          docTitle={"IGP"}
        />
      </div>
      <div>
        <PrintGRN
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          componentRef={grnRef}
          docTitle={"GRN"}
        />
      </div>
    </div>
  );
}
