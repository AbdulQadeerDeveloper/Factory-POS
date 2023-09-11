import React, { useEffect, useRef, useState, useContext } from "react";
import { useReactToPrint } from "react-to-print";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "./ProductsList";
import { useNavigate } from "react-router-dom";
import axios from "../../../AxiosInstance";
import PrintSV from "../../../Prints/StkPrints/PrintSV";
import OutwardGatePass from "../../../Prints/StkPrints/OGP/OutwardGatePass";
import { GlobalData } from "../../../GlobalData";

export default function SVTrans(props) {
  const contextdata = useContext(GlobalData);

  const navigate = useNavigate();
  const [showPrevBal, setShowPrevBal] = useState(false);
  let userName =
    JSON.parse(window.localStorage.getItem("user"))?.UserName || "";
  const [allowRate, setAllowRate] = useState(0);

  const {
    currentIndex,
    setCurrentIndex,
    isLoading,
    ProductRef,
    DateRef,
    transarray,
    setTransarray,
    setMsg,
    msg,
    SubmitVoucher,
    DelConfirmation,
    ParentObjEmpty,
    parentobj,
    ProdList,
  } = props;

  // const CurBalRef = useRef(null);
  const ProDescRef = useRef(null);
  const PrevReadRef = useRef(null);
  const NewReadRef = useRef(null);
  const PQtyRef = useRef(null);
  const PackingRef = useRef(null);
  const RateRef = useRef(null);
  const GstRef = useRef(null);
  const AdvRef = useRef(null);
  const ComRef = useRef(null);
  const EnterRef = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    CurBal: null,
    ProductId: null,
    ProdName: null,
    Description: "",
    ProDesc: "",
    PrevRead: null,
    NewRead: null,
    PQty: null,
    PUnit: null,
    Packing: null,
    Qty: null,
    Unit: null,
    Rate: null,
    GSTPer: null,
    AdvPer: null,
    ComPer: null,
    isDeleted: 0,
    EntryUser: userName,
  };
  const [childobj, setChildobj] = useState(child_tmp_obj);
  function ChildObjEmpty() {
    setChildobj(child_tmp_obj);
  }

  useEffect(()=> {
    ChildObjEmpty()
  },[parentobj?.VocNo])

  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();
  const ChallanRef = useRef();
  const InvRef = useRef();
  const GatePassRef = useRef();

  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  const ChallanPrint = useReactToPrint({
    content: () => ChallanRef.current,
    documentTitle: "Delivery_Challan_Document",
    pageStyle: pageStyle,
  });
  const ComInvPrint = useReactToPrint({
    content: () => InvRef.current,
    documentTitle: "Commercial_Invoice_Document",
    pageStyle: pageStyle,
  });
  const GatePassPrint = useReactToPrint({
    content: () => GatePassRef.current,
    documentTitle: "Outward_Gate_Pass_Document",
    pageStyle: pageStyle,
  });

  useEffect(() => {
    if (childobj.PQty !== null && childobj.ProductId !== null) {
      let quantity = childobj.PQty * childobj.Packing;
      setChildobj({ ...childobj, Qty: quantity });
    }
  }, [childobj.PQty, childobj.ProductId]);

  function isPetrol() {
    return contextdata?.acSettings[0]?.CompType === "PETROL"
  }
  // handling focus on inputs
  function FocusNextInputChild(e) {
    if (e.key !== "Enter") return;

    switch (document.activeElement) {
      case ProDescRef.current:
        if (isPetrol())
          PrevReadRef.current && PrevReadRef.current.focus();
        else
          PQtyRef.current && PQtyRef.current.focus();
        break;
      case PrevReadRef.current:
        NewReadRef.current && NewReadRef.current.focus();
        break;
      case NewReadRef.current:
        RateRef.current && RateRef.current.focus();
        break;
      case PQtyRef.current:
        RateRef.current && RateRef.current.focus();
        break;
      case RateRef.current:
        GstRef.current && GstRef.current.focus();
        break;
      case GstRef.current:
        if (!isPetrol()) {
          AdvRef.current && AdvRef.current.focus();
        }
        else {
          if (currentIndex >= 0) {
            handleUpdate();
          } else {
            AddSingle();
          }

        }
        break;
      case AdvRef.current:
        ComRef.current && ComRef.current.focus();
        break;
      case ComRef.current:
        if (currentIndex >= 0) {
          handleUpdate();
        } else {
          AddSingle();
        }
        ProductRef.current && ProductRef.current.focus();
        break;
      default:
      // code block
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
    } else if (childobj.Rate === null || childobj.Rate === 0) {
      RateRef.current && RateRef.current.focus();
      setMsg({ ...msg, err: "Rate is required", color: "alert alert-warning" });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      return true;
    }
  }

  function IsRateNotOk() {
    if (allowRate === 0) {
      setMsg({
        ...msg,
        err: "Type Rate Again Then Continue",
        color: "alert alert-warning",
      });
      return true;
    }
    let curRt = (childobj?.Rate * childobj?.GSTPer) / 100;
    let curRate = childobj?.Rate + curRt;
    if (curRate < allowRate) {
      setMsg({
        ...msg,
        err: `Rate Not Allowed: current Rate:${curRate} AllowRate=${allowRate}`,
        color: "alert alert-warning",
      });
      RateRef.current.focus()
      return true;
    }
    return false;
  }

  // insert objects into array
  function AddSingle() {
    if (IsRateNotOk()) return;
    setAllowRate(0);
    if (HandleValidate()) {
      // console.log(childobj);
      if (childobj.PQty <= childobj.CurBal) {
        const val = [...transarray];
        let lngth = val.length;
        val.push({ ...childobj, SrNo: lngth + 1 });
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
  function handleEdit(index) {
    setCurrentIndex(index)
    setChildobj(transarray[index]);
  }

  // update selected object from array
  function handleUpdate() {
    GetAllowRate();
    if (IsRateNotOk()) return;

    if (HandleValidate()) {
      if (childobj.PQty <= childobj.CurBal) {
        const transarrayToUpdate = [...transarray];
        transarrayToUpdate.splice(currentIndex, 1, childobj);
        setTransarray(transarrayToUpdate);
        setMsg({ ...msg, err: "", color: "" })
        setCurrentIndex(-1)
        ProductRef.current && ProductRef.current.focus();
        setChildobj(child_tmp_obj)
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
            ComPer: delObj.ComPer,
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
    navigate(`/sv/0`);
  }

  function PQtyFun(e) {
    let pquantity = parseFloat(e.target.value);
    if (isNaN(pquantity)) {
      setChildobj({ ...childobj, PQty: null });
    } else {
      setChildobj({ ...childobj, PQty: pquantity });
    }
  }
  function PackingFun(e) {
    let packing = parseFloat(e.target.value);
    if (isNaN(packing)) {
      setChildobj({ ...childobj, Packing: null });
    } else {
      setChildobj({ ...childobj, Packing: packing });
    }
  }
  function RateFun(e) {
    let amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      setChildobj({ ...childobj, Rate: null });
    } else {
      setChildobj({ ...childobj, Rate: amount });
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
  function ComFun(e) {
    let adv = parseFloat(e.target.value);
    if (isNaN(adv)) {
      setChildobj({ ...childobj, ComPer: null });
    } else {
      setChildobj({ ...childobj, ComPer: adv });
    }
  }

  function GetAllowRate() {
    axios
      .get(
        `api/sal/getallowrate?productid=${childobj.ProductId}&username=${userName}`
      )
      .then((res) => {
        setAllowRate(res.data);
      })
      .catch((err) => alert("Error GetAllowRate"));
  }
  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  useEffect(() => {
    // setChildobj({ ...childobj, ComPer: 2 });
    if (parentobj.SaleManId > 0 && childobj.ProductId > 0)
      axios
        .get(
          `api/salecom/getcomper?salemanid=${parentobj.SaleManId}&productid=${childobj.ProductId}&partyid=${parentobj.PartyId}`
        )
        .then((res) => {
          setChildobj({ ...childobj, ComPer: res.data });
        });
  }, [childobj.ProductId]);

  useEffect(() => {
    if (childobj.PrevRead > 0 && childobj.NewRead > 0) {
      let val = (Number(childobj.NewRead) - Number(childobj.PrevRead)) || 0
      setChildobj({ ...childobj, PQty: val, Qty: val })
    }
  }, [childobj.PrevRead, childobj.NewRead])

  //JSX
  return (
    <div>
      <div ref={componentRef}>
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
              <th className="bg-color col-xs-1 text-center igpproduct">
                ProDesc
              </th>
              <th className="bg-color col-xs-1 text-right">CurBal</th>
              {isPetrol() && <>
                <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                  PrevRead
                </th>
                <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                  NextRead
                </th></>
              }
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PQty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Packing
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Qty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Unit
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Rate
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                GSTPer
              </th>
              {!isPetrol() && <>
                <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                  AdvPer
                </th>
                <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                  ComPer
                </th></>
              }
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
                  NextElemRef={!isPetrol() ? PQtyRef : PrevReadRef}
                  ProductRef={ProductRef}
                  ProdList={ProdList}
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
                  ref={ProDescRef}
                  onKeyPress={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  tabIndex={-1}
                  onChange={(e) =>
                    setChildobj({ ...childobj, ProDesc: e.target.value })
                  }
                  value={childobj.ProDesc !== null ? childobj.ProDesc : ""}
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
                  onKeyPress={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  tabIndex={-1}
                  value={childobj.CurBal !== null ? childobj.CurBal : ""}
                />
              </td>
              {isPetrol() && <>
                <td>
                  <input
                    style={{
                      borderRadius: "2px",
                      textAlign: "right",
                      color: "#036",
                    }}
                    ref={PrevReadRef}
                    type="number"
                    onKeyPress={(e) => FocusNextInputChild(e)}
                    className="form-control IGPOthers"
                    autoComplete="off"
                    onChange={(e) => setChildobj({ ...childobj, PrevRead: e.target.value })}
                    value={childobj.PrevRead !== null ? childobj.PrevRead : ""}
                  />
                </td>
                <td>
                  <input
                    style={{
                      borderRadius: "2px",
                      textAlign: "right",
                      color: "#036",
                    }}
                    ref={NewReadRef}
                    type="number"
                    onKeyPress={(e) => FocusNextInputChild(e)}
                    className="form-control IGPOthers"
                    autoComplete="off"
                    onChange={(e) => setChildobj({ ...childobj, NewRead: e.target.value })}
                    value={childobj.NewRead !== null ? childobj.NewRead : ""}
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
                  readOnly={isPetrol()}
                  onKeyPress={(e) => FocusNextInputChild(e)}
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
                  ref={PackingRef}
                  type="number"
                  onKeyPress={(e) => FocusNextInputChild(e)}
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
                  onKeyPress={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => RateFun(e)}
                  onBlur={GetAllowRate}
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
                  onKeyPress={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => GSTFun(e)}
                  value={childobj.GSTPer !== null ? childobj.GSTPer : ""}
                />
              </td>
              {!isPetrol() && <>
                <td>
                  <input
                    style={{
                      borderRadius: "2px",
                      textAlign: "right",
                      color: "#036",
                    }}
                    ref={AdvRef}
                    type="number"
                    onKeyPress={(e) => FocusNextInputChild(e)}
                    className="form-control IGPOthers"
                    autoComplete="off"
                    onChange={(e) => AdvFun(e)}
                    value={childobj.AdvPer !== null ? childobj.AdvPer : ""}
                  />
                </td>
                <td>
                  <input
                    style={{
                      borderRadius: "2px",
                      textAlign: "right",
                      color: "#036",
                    }}
                    ref={ComRef}
                    type="number"
                    onKeyPress={(e) => FocusNextInputChild(e)}
                    className="form-control IGPOthers"
                    autoComplete="off"
                    tabIndex={-1}
                    onChange={(e) => ComFun(e)}
                    value={childobj.ComPer !== null ? childobj.ComPer : ""}
                  />
                </td>
              </>}
              <td>
                {currentIndex === -1 ? (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onKeyPress={(e) => FocusNextInputChild(e)}
                    onClick={AddSingle}
                    className="btn btn-info cdr_btn btn-block"
                    value="Enter"
                  />
                ) : (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onClick={handleUpdate}
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
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Id}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.SrNo}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.ProdName}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.ProDesc}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.CurBal}</span>
                      </td>
                      {isPetrol() &&
                        <>
                          <td style={{ textAlign: "center" }}>
                            <span style={{ color: "#036" }}>{data.PrevRead}</span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span style={{ color: "#036" }}>{data.NewRead}</span>
                          </td>
                        </>
                      }
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.PQty}</span>
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
                      {!isPetrol() && <>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: "#036" }}>{data.AdvPer}</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: "#036" }}>{data.ComPer}</span>
                        </td>
                      </>}
                      <td className="action_without_print">
                        <span
                          onClick={() => handleEdit(i)}
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
          className="btn btn-danger button mr-10"
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
        <button
          onClick={SubmitVoucher}
          disabled={isLoading}
          className="btn btn-info"
        >
          {parentobj.VocNo > 0 ? "Update" : "Post"}
        </button>
      </div>
      <div className="clearfix"></div>
      {parentobj.Status > 0 && parentobj.VocNo > 0 && (
        <div className="voc_btn_bottom">
          <button onClick={ChallanPrint} className="btn btn-info">
            Delivery Challan
          </button>
          <label class="form-check-label">
            <input
              type="checkbox"
              class="form-check-input"
              checked={showPrevBal}
              onChange={(e) => setShowPrevBal(e.target.checked)}
            />
            Show Prev Bal?
          </label>
          <button onClick={ComInvPrint} className="btn btn-info">
            Commercial Inv
          </button>
          <button onClick={GatePassPrint} className="btn btn-info">
            GatePass
          </button>
        </div>
      )}
      <div>
        <OutwardGatePass
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          GatePassRef={ChallanRef}
          docTitle={"Delivery Challan"}
        />
        <PrintSV
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          InvRef={InvRef}
          showPrevBal={showPrevBal}
        />
        <OutwardGatePass
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          GatePassRef={GatePassRef}
          docTitle={"Outward Gate Pass"}
        />
      </div>
    </div>
  );
}
