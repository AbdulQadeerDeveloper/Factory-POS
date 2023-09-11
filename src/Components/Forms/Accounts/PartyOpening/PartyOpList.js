import React from 'react'
import ConvertedDate from '../../../Shared_Components/ConvertedDate'
import Currency from '../../../Shared_Components/Currency'

export default function PartyOpList({fdata, handleEdit, handleDelete}) {
    return (
        <>
            {fdata &&
                fdata.map((x, i) => (
                    <tr key={i}>
                        <td style={{ textAlign: "center" }}>{x.Id}</td>
                        <td style={{ textAlign: "center" }}>{x.SrNo}</td>
                        <td style={{ textAlign: "center" }}>
                            <ConvertedDate date={x.Date} />
                        </td>
                        <td style={{ textAlign: "center" }}>{x.PartyId}</td>
                        <td style={{ textAlign: "left" }}>{x.PartyName}</td>
                        <td style={{ textAlign: "left" }}>
                            {x.Description}
                        </td>
                        <td style={{ textAlign: "right" }}>
                            <Currency value={x.NetDebit} />
                        </td>
                        <td style={{ textAlign: "right" }}>
                            <Currency value={x.NetCredit} />
                        </td>
                        <td style={{ textAlign: "center" }}>{x.Status}</td>
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
        </>
    )
}
