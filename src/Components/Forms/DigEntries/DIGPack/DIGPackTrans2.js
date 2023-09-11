import React, { useEffect, useRef, useState } from "react";
import Currency from "../../../Shared_Components/Currency";
import ProductsList from "../../../Comps/ProductsList";
import GetPartiesList from "../../../Comps/PartiesList";
import CategList from '../../../Comps/CategList';

export default function DIGIGPTrans(props) {
  const [currentIndex, setCurrentIndex] = useState(-1)

  const {
    ChildObjEmpty2,
    childobj2,
    setChildobj2,
    ProductRef,
    transarray2,
    setTransarray2,
    setMsg2,
    msg2,
    parentobj,
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

  const [partyObject, setPartyObject] = useState({ PartyId: null, PartyName: null })
  useEffect(() => {
    setChildobj2({ ...childobj2, ToPartyId: partyObject.PartyId, ToPartyName: partyObject.PartyName })
  }, [partyObject.PartyId])

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
      default:
        break;
    }

  }

  // object validation before insert and update
  function HandleValidate() {
    if (childobj2?.ProdName === "") {
      ProductRef.current && ProductRef.current.focus();
      setMsg2({
        ...msg2,
        err: "Product is required",
        color: "alert alert-warning",
      });
    }
    else if (childobj2?.ToPartyId === null) {
      ToPartyRef.current && ToPartyRef.current.focus();
      setMsg2({
        ...msg2,
        err: "To Party is required",
        color: "alert alert-warning",
      });
    } else if (childobj2?.PQty === null || childobj2?.PQty === 0) {
      PQtyRef.current && PQtyRef.current.focus();
      setMsg2({
        ...msg2,
        err: "Packing Qty is required",
        color: "alert alert-warning",
      });
    } else {
      setMsg2({ ...msg2, err: "", color: "" });
      return true;
    }
  }

  // insert objects into array
  function AddSingle() {
    if (HandleValidate()) {
      setTransarray2([...transarray2, childobj2]);
      ChildObjEmpty2(); // child obj empty
      ProductRef.current && ProductRef.current.focus();
      setCurrentIndex(-1)
      setPartyObject({ PartyId: null, PartyName: null })
    }
  }
  // get selected object for updation
  function handleEdit(index) {
    setCurrentIndex(index)
    setChildobj2(transarray2[index]);
    setPartyObject({ PartyId: transarray2[index].ToPartyId, PartyName: transarray2[index].ToPartyName })
  }

  // update selected object from array
  function handleUpdate() {
    if (HandleValidate()) {
      // get data of current index
      // update with new data
      const transarray2ToUpdate = [...transarray2];
      transarray2ToUpdate.splice(currentIndex, 1, childobj2);
      setTransarray2(transarray2ToUpdate);
      setMsg2({ ...msg2, err: "", color: "" })
      setCurrentIndex(-1)
      ProductRef.current && ProductRef.current.focus();
      ChildObjEmpty2()
    }

  }

  // remove object from array
  function RemSingle(index) {
    const val = [...transarray2];
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
    setTransarray2(val);
    setMsg2({ ...msg2, err: "", color: "" });
    ProductRef.current && ProductRef.current.focus();
  }

  useEffect(() => {
    setChildobj2({ ...childobj2, Qty: Number(childobj2?.PQty) * Number(childobj2?.Packing) })
  }, [childobj2?.PQty, childobj2?.Packing])

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
                  childobj={childobj2}
                  setChildobj={setChildobj2}
                  NextElemRef={CategRef}
                  ProductRef={ProductRef}
                />
              </td>
              <td>
                <CategList
                  parentobj={childobj2}
                  setParentobj={setChildobj2}
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
                  onChange={(e)=> setChildobj2({ ...childobj2, DNo: e.target.value })} 
                  value={childobj2?.DNo !== null ? childobj2?.DNo : ""}
                />
              </td>
              <td>
                <select onKeyDown={(e) => FocusNextInputChild(e)} className="form-control input-xs" ref={PUnitRef} value={childobj2?.PUnit !== null ? childobj2?.PUnit : ""} onChange={(e)=> setChildobj2({...childobj2, PUnit: e.target.value})}>
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
                  onChange={(e) => setChildobj2({ ...childobj2, PQty: e.target.value })}
                  value={childobj2?.PQty !== null ? childobj2?.PQty : ""}
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
                  onChange={(e) => setChildobj2({ ...childobj2, Packing: e.target.value })}
                  value={childobj2?.Packing !== null ? childobj2?.Packing : ""}
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
                  value={childobj2?.Unit !== null ? childobj2?.Unit : ""}
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
                  onChange={(e) => setChildobj2({ ...childobj2, Qty: e.target.value })}
                  value={childobj2?.Qty !== null ? childobj2?.Qty : ""}
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
                  onChange={(e) => setChildobj2({ ...childobj2, Rate: e.target.value })}
                  value={childobj2?.Rate !== null ? childobj2?.Rate : ""}
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
                  onChange={(e) => setChildobj2({ ...childobj2, Remarks: e.target.value })}
                  value={childobj2?.Remarks !== null ? childobj2?.Remarks : ""}
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
            {transarray2 &&
              transarray2.map(
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
      {msg2.err !== "" && (
        <>
          <div className="msg2_div">
            <div className={msg2.color} role="alert">
              <span className="alert-link">{msg2.err}</span>
            </div>
          </div>
          <div className="clearfix"></div>
        </>
      )}
    </div>
  );
}
