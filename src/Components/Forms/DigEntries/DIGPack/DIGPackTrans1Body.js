import React from 'react'
import { useRef } from 'react'
import TextField from './Comp/TextField';

export default function DIGPackTrans1Body({ msg, setMsg, NextElementRef, childobj1, setChildobj1, PQtyRef, currentIndex, setCurrentIndex, transarray1, setTransarray1, ChildObjEmpty1 }) {

    const ProductRef = useRef(null)
    const QtyRef = useRef(null)
    const RemarksRef = useRef(null);
    const EnterRef = useRef(null);

    // insert objects into array
    function AddSingle() {
        if (HandleValidate()) {
            setTransarray1([...transarray1, childobj1]);
            ChildObjEmpty1(); // child obj empty
            NextElementRef?.current && NextElementRef.current.focus();
            setCurrentIndex(-1);
        }
    }

    // update selected object from array
    function handleUpdate() {
        if (HandleValidate()) {
            // get data of current index
            // update with new data
            const transarray1ToUpdate = [...transarray1];
            transarray1ToUpdate.splice(currentIndex, 1, childobj1);
            setTransarray1(transarray1ToUpdate);
            setMsg({ ...msg, err: "", color: "" });
            setCurrentIndex(-1);
            NextElementRef?.current && NextElementRef.current.focus();
            ChildObjEmpty1();
        }
    }

    // object validation before insert and update
    function HandleValidate() {
        if (childobj1?.ProdName === "") {
            ProductRef.current && ProductRef.current.focus();
            setMsg({
                ...msg,
                err: "Product is required",
                color: "alert alert-warning",
            });
        } else if (childobj1?.PQty === null || childobj1?.PQty === 0) {
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

    function FocusNextInputChild(e) {
        if (e.key !== "Enter") return;
        switch (document.activeElement) {
            case PQtyRef.current:
                RemarksRef.current && RemarksRef.current.focus();
                break;
            case RemarksRef.current:
                currentIndex === -1 ? AddSingle() : handleUpdate();
                break;
            default:
                break;
        }
    }

    return (
        <tr>
            <td colSpan={3}>
                <input
                    style={{
                        borderRadius: "2px",
                        textAlign: "center",
                        color: "#036",
                    }}
                    className="form-control IGPOthers"
                    type="text"
                    value={childobj1?.ProdName !== null ? childobj1?.ProdName : ""}
                    readOnly
                />
            </td>
            <td>
                <input
                    style={{
                        borderRadius: "2px",
                        textAlign: "center",
                        color: "#036",
                    }}
                    className="form-control IGPOthers"
                    type="text"
                    value={childobj1?.CategName !== null ? childobj1?.CategName : ""}
                    readOnly
                />
            </td>
            <td>
                <TextField dataField={childobj1?.DNo} readOnly />
            </td>
            <td>
                <input
                    style={{
                        borderRadius: "2px",
                        textAlign: "center",
                        color: "#036",
                    }}
                    type="text"
                    className="form-control IGPOthers"
                    autoComplete="off"
                    value={childobj1?.PUnit !== null ? childobj1?.PUnit : ""}
                    readOnly
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
                    className="form-control IGPOthers"
                    autoComplete="off"
                    onChange={(e) =>
                        setChildobj1({ ...childobj1, PQty: e.target.value })
                    }
                    value={childobj1?.PQty !== null ? childobj1?.PQty : ""}
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
                    className="form-control IGPOthers"
                    autoComplete="off"
                    value={childobj1?.Packing !== null ? childobj1?.Packing : ""}
                    readOnly
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
                    value={childobj1?.Unit !== null ? childobj1?.Unit : ""}
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
                    onChange={(e) =>
                        setChildobj1({ ...childobj1, Qty: e.target.value })
                    }
                    value={childobj1?.Qty !== null ? childobj1?.Qty : ""}
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
                    className="form-control IGPOthers"
                    autoComplete="off"
                    // readOnly
                    value={childobj1?.Rate !== null ? childobj1?.Rate : ""}
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
                    onChange={(e) =>
                        setChildobj1({ ...childobj1, Remarks: e.target.value })
                    }
                    value={childobj1?.Remarks !== null ? childobj1?.Remarks : ""}
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
    )
}
