import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import GetPartiesList from "../../../Comps/PartiesList";

export default function GPVTrans(props) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(-1)

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

  const SerialRef = useRef(null);
  const WidthRef = useRef(null);
  const GreyLotRef = useRef(null);
  const ThanRef = useRef(null);
  const GrossMtrRef = useRef(null);
  const LShortRef = useRef(null);
  const ShortRef = useRef(null);
  const RejRef = useRef(null);
  const ToPartyRef = useRef(null);
  const RateRef = useRef(null);
  const ComPerRef = useRef(null);
  const EnterRef = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    Serial: null,
    GreyLot: null,
    ProductId: null,
    ProdName: null,
    Width: null,
    Than: null,
    GrossMtr: null,
    LShort: null,
    Short: null,
    Rej: null,
    NetMtr: null,
    Rate: null,
    ComPer: null,
    ToPartyId: null,
    ToPartyName: null,
    isDeleted: 0,
  };

  const [partyObject, setPartyObject] = useState({ PartyId: null, PartyName: null })
  useEffect(() => {
    setChildobj({ ...childobj, ToPartyId: partyObject.PartyId, ToPartyName: partyObject.PartyName })
  }, [partyObject.PartyId])

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

  // handling focus on inputs
  function FocusNextInputChild(e) {
    if (e.key !== "Enter") return;

    switch (document.activeElement) {
      case WidthRef.current:
        ThanRef.current.focus()
        break;
      case GreyLotRef.current:
        ThanRef.current.focus()
        break;
      case ThanRef.current:
        GrossMtrRef.current.focus()
        break;
      case GrossMtrRef.current:
        LShortRef.current.focus()
        break;
      case LShortRef.current:
        ShortRef.current.focus()
        break;
      case ShortRef.current:
        RejRef.current.focus()
        break;
      case RejRef.current:
        ToPartyRef.current.focus()
        break;
      case RateRef.current:
        ComPerRef.current.focus()
        break;
      case ComPerRef.current:
        if (currentIndex === -1)
          AddSingle()
        else
          handleUpdate()
        break;
    }

  }

  // object validation before insert and update
  function HandleValidate() {
    if (childobj?.ProdName === "") {
      ProductRef.current && ProductRef.current.focus();
      setMsg({
        ...msg,
        err: "Product is required",
        color: "alert alert-warning",
      });
    }
    else if (childobj?.ToPartyId === null) {
      ToPartyRef.current && ToPartyRef.current.focus();
      setMsg({
        ...msg,
        err: "To Party is required",
        color: "alert alert-warning",
      });
    } else if (childobj?.GrossMtr === null || childobj?.GrossMtr === 0) {
      GrossMtrRef.current && GrossMtrRef.current.focus();
      setMsg({
        ...msg,
        err: "LShort Qty is required",
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
      setTransarray([...transarray, childobj]);
      ChildObjEmpty(); // child obj empty
      ProductRef.current && ProductRef.current.focus();
      setCurrentIndex(-1)
      setPartyObject({ PartyId: null, PartyName: null })
    }
  }
  // get selected object for updation
  function handleEdit(index) {
    setCurrentIndex(index)
    setChildobj(transarray[index]);
    setPartyObject({ PartyId: transarray[index].ToPartyId, PartyName: transarray[index].ToPartyName })
  }

  // update selected object from array
  function handleUpdate() {
    if (HandleValidate()) {
      // get data of current index
      // update with new data
      const transarrayToUpdate = [...transarray];
      transarrayToUpdate.splice(currentIndex, 1, childobj);
      setTransarray(transarrayToUpdate);
      setMsg({ ...msg, err: "", color: "" })
      setCurrentIndex(-1)
      ProductRef.current && ProductRef.current.focus();
      setChildobj(child_tmp_obj)

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
            GrossMtr: delObj.GrossMtr,
            PUnit: delObj.PUnit,
            LShort: delObj.LShort,
            Qty: delObj.Qty,
            Unit: delObj.Unit,
            Rate: delObj.Rate,
            ComPer: delObj.ComPer,
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
    navigate(`/gpv/0`);
  }

  useEffect(() => {
    setChildobj({ ...childobj, NetMtr: Number(childobj?.GrossMtr) - Number(childobj?.LShort) - Number(childobj?.Short) - Number(childobj?.Rej) });
  }, [childobj?.GrossMtr, childobj?.LShort, childobj?.Short, childobj?.Rej])

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
              <th className="bg-color col-xs-1 text-center">Serial</th>
              <th className="bg-color col-xs-1 text-center">Width</th>
              <th className="bg-color col-xs-1 text-center">GreyLot</th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Than
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                GrossMtr
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                LShort
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Short
              </th>
              <th style={{ textAlign: "left" }} className="bg-color col-xs-1">
                Rejection
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                NetMtr
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-2">
                ToPartyId
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Rate
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                ComPer
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
                <ProductsList
                  childobj={childobj}
                  setChildobj={setChildobj}
                  NextElemRef={WidthRef}
                  ProductRef={ProductRef}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={SerialRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  readOnly
                  value={childobj?.Serial !== null ? childobj?.Serial : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={WidthRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, Width: e.target.value })}
                  value={childobj?.Width !== null ? childobj?.Width : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={GreyLotRef}
                  type="text"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, GreyLot: e.target.value })}
                  value={childobj?.GreyLot !== null ? childobj?.GreyLot : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={ThanRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, Than: e.target.value })}
                  value={childobj?.Than !== null ? childobj?.Than : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={GrossMtrRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, GrossMtr: e.target.value })}
                  value={childobj?.GrossMtr !== null ? childobj?.GrossMtr : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={LShortRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, LShort: e.target.value })}
                  value={childobj?.LShort !== null ? childobj?.LShort : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={ShortRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, Short: e.target.value })}
                  value={childobj?.Short !== null ? childobj?.Short : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={RejRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, Rej: e.target.value })}
                  value={childobj?.Rej !== null ? childobj?.Rej : ""}
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
                  readOnly
                  tabIndex={-1}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  value={childobj?.NetMtr !== null ? childobj?.NetMtr : ""}
                />
              </td>
              <td>
                <GetPartiesList childobj={partyObject} setChildobj={setPartyObject} PartyRef={ToPartyRef} NextElemRef={RateRef} />
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
                  onChange={(e) => setChildobj({ ...childobj, Rate: e.target.value })}
                  value={childobj?.Rate !== null ? childobj?.Rate : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={ComPerRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, ComPer: e.target.value })}
                  value={childobj?.ComPer !== null ? childobj?.ComPer : ""}
                />
              </td>
              <td>
                {currentIndex === -1 ? (
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
                      <td>
                        <span style={{ color: "#036" }}>{data.Id}</span>
                      </td>
                      <td>
                        <span style={{ color: "#036" }}>{data.SrNo}</span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.ProdName}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Serial}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Width}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.GreyLot}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Than}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.GrossMtr}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.LShort}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Short}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Rej}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.NetMtr}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.ToPartyName}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>
                          <Currency value={data.Rate} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.ComPer}</span>
                      </td>
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
    </div>
  );
}
