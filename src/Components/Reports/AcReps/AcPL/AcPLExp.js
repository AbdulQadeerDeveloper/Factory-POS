import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function AcPLExp(props) {
    const { transarray, gross } = props;

    //#region variables
    // g for group level
    let grand_expAmt = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-1 text-center">Particulars</th>
                            <th className="bg-color col-xs-1 text-right">Amount</th>
                            <th className="bg-color col-xs-1 text-left"></th>
                            <th className="bg-color col-xs-1 text-center">Particulars</th>
                            <th className="bg-color col-xs-1 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Opening:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.OpAmt} /></td>
                            <td>   </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Purchase:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.PurAmt} /></td>
                            <td>   </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Sale:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.SalAmt} /></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Sales Return:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.SRetAmt} /></td>
                            <td>   </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Purchase Return:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.PRetAmt} /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>   </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Closing:</td>
                            <td style={{ textAlign: 'right' }}><Currency value={gross?.ClAmt} /></td>
                        </tr>
                        <tr>
                            <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                                Gross Profit:
                            </td>
                            <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                                <Currency value={gross?.GrossCr} />
                            </td>
                            <td>    </td>
                            <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                                Gross Loss:
                            </td>
                            <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                                <Currency value={gross?.GrossDr} />
                            </td>
                        </tr>

                    </tbody>
                </table>

                <br />
                <br />

                <table className="table table-bordered" cellSpacing="0" style={{ width: "50%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-2 text-center">Exp Type Id</th>
                            <th className="bg-color col-xs-7 text-left">Exp Type</th>
                            <th className="bg-color col-xs-3 text-right">Exp Amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transarray?.length > 0 ? (
                                transarray?.map((data, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <DataRow data={data} />
                                            <GrandRow index={i} />
                                        </React.Fragment>
                                    )
                                })) : (
                                <tr style={{ background: "lightgrey", textAlign: "justify" }}>
                                    <td colSpan="12" style={{ textAlign: "center" }}>No Expense Found!</td>
                                </tr>
                            )
                        }
                        <NetPLRow />
                    </tbody>
                </table>
            </div>
            <div className='clearfix'></div>
        </div>
    );

    //#region Sub-Components

    function DataRow({ data }) {
        grand_expAmt += data.ExpAmt || 0;

        return (
            <tr className="entry_row statement_row" style={data.ClBalDr > data.CrLimit ? { backgroundColor: "lavender" } : null}>
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036" }}>
                        {data.PartyTypeId}
                    </span>
                </td>
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.PartyType}
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.ExpAmt} />
                    </span>
                </td>
            </tr>
        )
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_expAmt} />
                    </td>
                </tr>
            )
        }
    }

    function NetPLRow() {
            return (
                <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Net {gross?.Gross + grand_expAmt <= 0 ? "Profit" : "Loss"} :
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold", background: 'lightgrey' }}>
                        <Currency value={Math.abs(gross?.Gross + grand_expAmt)} />
                    </td>
                </tr>
            )
    }

    //#endregion Sub-Components

}