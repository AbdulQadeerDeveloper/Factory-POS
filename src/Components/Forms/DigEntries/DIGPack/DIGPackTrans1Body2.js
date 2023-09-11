import React from 'react'
import Currency from '../../../Shared_Components/Currency';

export default function DIGPackTrans1Body2({ ProductRef, msg, setMsg, parentobj, transarray1, setTransarray1, setCurrentIndex, setChildobj1 }) {


    // get selected object for updation
    function handleEdit(index) {
        setCurrentIndex(index);
        setChildobj1(transarray1[index]);
    }

    // remove object from array
    function RemSingle(index) {
        const val = [...transarray1];
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
        setTransarray1(val);
        setMsg({ ...msg, err: "", color: "" });
        ProductRef.current && ProductRef.current.focus();
    }

    return (
        <>
            {transarray1 &&
                transarray1.map(
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
        </>
    )
}
