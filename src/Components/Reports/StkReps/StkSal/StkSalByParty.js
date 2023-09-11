import React from 'react';
import Currency from '../../../Shared_Components/Currency';
import ConvertedDate from "../../../Shared_Components/ConvertedDate";

export default function StkSalByParty(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g1_pbal = 0;
    let g1_bal = 0;
    let g1_gst_amt = 0;
    let g1_net_amt = 0;

    let grand_pbal = 0;
    let grand_bal = 0;
    let grand_bal_amt = 0;
    let grand_net_amt = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-2 text-left">PartyName</th>
                            <th className="bg-color col-xs-1 text-center">VocNo</th>
                            <th className="bg-color col-xs-1 text-center">DA.No/Inv.No</th>
                            <th className="bg-color col-xs-1 text-center">DA/Inv.Date</th>
                            <th className="bg-color col-xs-2 text-right">Prod Name</th>
                            <th className="bg-color col-xs-1 text-right">PQty</th>
                            <th className="bg-color col-xs-1 text-right">Qty</th>
                            <th className="bg-color col-xs-1 text-right">Rate</th>
                            <th className="bg-color col-xs-1 text-right">GST</th>
                            <th className="bg-color col-xs-1 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transarray.length > 0 ? (
                                transarray.map((data, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <HeaderRow index={i} />
                                            <DataRow data={data} />
                                            <FooterRow index={i} />
                                            <GrandRow index={i} />
                                        </React.Fragment>
                                    )
                                })) : (
                                <tr style={{ background: "lightgrey", textAlign: "justify" }}>
                                    <td colSpan="14" style={{ textAlign: "center" }}>No Record Found!</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className='clearfix'></div>
        </div>
    );

    //#region Sub-Components

    function HeaderRow({ index }) {
        if (isNewG1(index)) {
            g1_pbal = 0;
            g1_bal = 0;
            g1_gst_amt = 0;
            g1_net_amt = 0;

            return (
                <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                        <div style={{ background: "lightgrey", color: "#000", width: "400px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold" }}>
                            {transarray[index].PartyName}({transarray[index].PartyId})
                        </div>
                    </td>
                </tr>
            )
        }
    }

    function DataRow({ data }) {
        g1_pbal += data.PQty || 0;
        g1_bal += data.Qty || 0;
        g1_gst_amt += data.GstAmt || 0;
        g1_net_amt += data.NetAmount || 0;

        grand_pbal += data.PQty || 0;
        grand_bal += data.Qty || 0;
        grand_bal_amt += data.GstAmt || 0;
        grand_net_amt += data.NetAmount || 0;

        return (
            <tr className="entry_row statement_row">
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.PartyName}
                    </span>
                </td>
                <td style={{ textAlign: "center", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.VocNo}
                    </span>
                </td>
                <td style={{ textAlign: "center", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.CNo}
                    </span>
                </td>
                <td style={{ textAlign: "left" }}>
                    <span style={{ borderRadius: "2px", textAlign: "right", color: "#036" }}>
                        <ConvertedDate date={data.Date} />
                    </span>
                </td>
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.ProdName}
                    </span>
                </td>
                <td style={{ textAlign: "right", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.PQty} {data.PUnit}
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.Qty} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Rate} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.GstAmt} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.NetAmount} />
                    </span>
                </td>
                {/* <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={"Ledger.Bal"} />
                    </span>
                </td> */}
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{ backgroundColor: "lightgrey" }}>
                    <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].PartyType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal !== 0 ? (g1_net_amt - g1_gst_amt) / g1_bal : null} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_gst_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_net_amt} />
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal !== 0 ? (grand_net_amt - g1_gst_amt) / grand_bal : null} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_net_amt} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].PartyName !== transarray[index + 1].PartyName

    }

    function isNewG1(index) {
        return index === 0 || transarray[index].PartyName !== transarray[index - 1].PartyName
    }
    //#endregion Utility Methods
}