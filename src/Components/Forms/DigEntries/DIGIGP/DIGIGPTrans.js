import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import GetPartiesList from "../../../Comps/PartiesList";
import CategList from '../../../Comps/CategList';

export default function DIGIGPTrans(props) {
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

  const CategRef = useRef(null);
  const DNoRef = useRef(null);
  const PUnitRef = useRef(null);
  const PQtyRef = useRef(null);
  const PackingRef = useRef(null);
  const QtyRef = useRef(null);
  const ToPartyRef = useRef(null);
  const RateRef = useRef(null);
  const RemarksRef = useRef(null);
  const EnterRef = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    ProductId: null,
    ProdName: null,
    CategId: null,
    CategName: null,
    DNo: null,
    PUnit: null,
    PQty: null,
    Packing: null,
    Unit: null,
    Qty: null,
    Rate: null,
    Remarks: null,
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
      case DNoRef.current:
        PUnitRef.current && PUnitRef.current.focus();
        break;
      case PUnitRef.current:
        PQtyRef.current && PQtyRef.current.focus();
        break;
      case PQtyRef.current:
        PackingRef.current && PackingRef.current.focus();
        break;
      case PackingRef.current:
        QtyRef.current && QtyRef.current.focus();
        break;
      case QtyRef.current:
        ToPartyRef.current && ToPartyRef.current.focus();
        break;
      case RateRef.current:
        RemarksRef.current && RemarksRef.current.focus();
        break;
      case RemarksRef.current:
        currentIndex === -1 ? AddSingle() : handleUpdate()
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
    } else if (childobj?.PQty === null || childobj?.PQty === 0) {
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
            PQty: delObj.PQty,
            PUnit: delObj.PUnit,
            Packing: delObj.Packing,
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
    navigate(`/digigp/0`);
  }

  useEffect(() => {
    setChildobj({ ...childobj, Qty: Number(childobj?.PQty) * Number(childobj?.Packing) })
  }, [childobj?.PQty, childobj?.Packing])

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
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Category
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                DNo
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PUnit
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                PQty
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Packing
              </th>
              <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
                Unit
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Qty
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-2">
                To Location
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Rate
              </th>
              <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
                Remarks
              </th>
              <th
                style={{ textAlign: "center" }}
                className="bg-color col-xs-1 action_without_print"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3}>
                <ProductsList
                  childobj={childobj}
                  setChildobj={setChildobj}
                  NextElemRef={CategRef}
                  ProductRef={ProductRef}
                />
              </td>
              <td>
                <CategList
                  parentobj={childobj}
                  setParentobj={setChildobj}
                  NextElemRef={DNoRef}
                  CategRef={CategRef}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "center",
                    color: "#036",
                  }}
                  type="text"
                  ref={DNoRef}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e)=> setChildobj({ ...childobj, DNo: e.target.value })} 
                  value={childobj?.DNo !== null ? childobj?.DNo : ""}
                />
              </td>
              <td>
                <select onKeyDown={(e) => FocusNextInputChild(e)} className="form-control input-xs" ref={PUnitRef} value={childobj?.PUnit !== null ? childobj?.PUnit : ""} onChange={(e)=> setChildobj({...childobj, PUnit: e.target.value})}>
                  <option value='SET'>Set</option>
                  <option value='SET'>Than</option>
                </select>
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
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, PQty: e.target.value })}
                  value={childobj?.PQty !== null ? childobj?.PQty : ""}
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
                  onChange={(e) => setChildobj({ ...childobj, Packing: e.target.value })}
                  value={childobj?.Packing !== null ? childobj?.Packing : ""}
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
                  tabIndex={-1}
                  readOnly
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  value={childobj?.Unit !== null ? childobj?.Unit : ""}
                />
              </td>
              <td>
                <input
                  style={{
                    borderRadius: "2px",
                    textAlign: "right",
                    color: "#036",
                  }}
                  ref={QtyRef}
                  type="number"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  onChange={(e) => setChildobj({ ...childobj, Qty: e.target.value })}
                  value={childobj?.Qty !== null ? childobj?.Qty : ""}
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
                  ref={RemarksRef}
                  type="text"
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  className="form-control IGPOthers"
                  autoComplete="off"
                  // readOnly
                  onChange={(e) => setChildobj({ ...childobj, Remarks: e.target.value })}
                  value={childobj?.Remarks !== null ? childobj?.Remarks : ""}
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
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.CategName}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.DNo}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.PUnit}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.PQty}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Packing}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Unit}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Qty}</span>
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
                        <span style={{ color: "#036" }}>{data.Remarks}</span>
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
