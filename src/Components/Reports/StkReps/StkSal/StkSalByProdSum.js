import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function StkSalByPartySum(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g0_pbal = 0;
    let g0_bal = 0;
    let g0_gst_amt = 0;
    let g0_freight = 0;
    let g0_com_amt = 0;
    let g0_net_amt = 0;

    let g1_pbal = 0;
    let g1_bal = 0;
    let g1_gst_amt = 0;
    let g1_freight = 0;
    let g1_com_amt = 0;
    let g1_net_amt = 0;
    
    let g2_balance = 0;
    let g2_pbal = 0;
    let g2_bal = 0;
    let g2_gst_amt = 0;
    let g2_freight = 0;
    let g2_com_amt = 0;
    let g2_net_amt = 0;

    let grand_pbal = 0;
    let grand_bal = 0;
    let grand_gst_amt = 0;
    let grand_freight = 0;
    let grand_com_amt = 0;
    let grand_net_amt = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th colSpan={4} className="bg-color col-xs-3 text-left">ProdName</th>
                            <th className="bg-color col-xs-2 text-right">Party Name</th>
                            <th className="bg-color col-xs-1 text-center">PQty</th>
                            <th className="bg-color col-xs-1 text-right">Qty</th>
                            <th className="bg-color col-xs-1 text-right">Rate</th>
                            <th className="bg-color col-xs-1 text-right">GST</th>
                            <th className="bg-color col-xs-1 text-right">Freight</th>
                            <th className="bg-color col-xs-1 text-center">Com%</th>
                            <th className="bg-color col-xs-1 text-right">ComAmt</th>
                            <th className="bg-color col-xs-1 text-right">Amount</th>
                            <th className="bg-color col-xs-1 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transarray.length > 0 ? (
                                transarray.map((data, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <G0HeaderRow index={i} />
                                            <G1HeaderRow index={i} />
                                            <G2HeaderRow index={i} />
                                            <DataRow data={data} />
                                            <G2FooterRow index={i} />
                                            <G1FooterRow index={i} />
                                            <G0FooterRow index={i} />
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
    function G0HeaderRow({ index }) {
        if (isNewG0(index)) {
            g0_pbal = 0;
            g0_bal = 0;
            g0_gst_amt = 0;
            g0_freight = 0;
            g0_com_amt = 0;
            g0_net_amt = 0;

            return (
                <tr>
                    <td colSpan={14} style={{ textAlign: "center" }}>
                        <div style={{ background: "cyan", color: "#000", width: "400px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold" }}>
                            {transarray[index].ProdType}
                        </div>
                    </td>
                </tr>
            )
        }
    }

    function G1HeaderRow({ index }) {
        if (isNewG1(index)) {
            g1_pbal = 0;
            g1_bal = 0;
            g1_gst_amt = 0;
            g1_freight = 0;
            g1_com_amt = 0;
            g1_net_amt = 0;

            return (
                <tr>
                    <td colSpan={14} style={{ textAlign: "center" }}>
                        <div style={{ background: "lightgrey", color: "#000", width: "400px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold" }}>
                            {transarray[index].ProdName}({transarray[index].ProductId})
                        </div>
                    </td>
                </tr>
            )
        }
    }

    function G2HeaderRow({ index }) {
        if (isNewG2(index)) {
            g2_balance = 0;
            g2_pbal = 0;
            g2_bal = 0;
            g2_gst_amt = 0;
            g2_freight = 0;
            g2_com_amt = 0;
            g2_net_amt = 0;

            return (null)
        }
    }
    function DataRow({ data }) {

        g0_pbal += data.PQty || 0;
        g0_bal += data.Qty || 0;
        g0_gst_amt += data.GstAmt || 0;
        g0_freight += data.Freight || 0;
        g0_com_amt += data.ComAmt || 0;
        g0_net_amt += data.NetAmount || 0;

        g2_balance += data.Bal
        g1_pbal += data.PQty || 0;
        g1_bal += data.Qty || 0;
        g1_gst_amt += data.GstAmt || 0;
        g1_freight += data.Freight || 0;
        g1_com_amt += data.ComAmt || 0;
        g1_net_amt += data.NetAmount || 0;

        g2_pbal += data.PQty || 0;
        g2_bal += data.Qty || 0;
        g2_gst_amt += data.GstAmt || 0;
        g2_freight += data.Freight || 0;
        g2_com_amt += data.ComAmt || 0;
        g2_net_amt += data.NetAmount || 0;

        grand_pbal += data.PQty || 0;
        grand_bal += data.Qty || 0;
        grand_gst_amt += data.GstAmt || 0;
        grand_freight += data.Freight || 0;
        grand_com_amt += data.ComAmt || 0;
        grand_net_amt += data.NetAmount || 0;

        return (null)
    }

    function G0FooterRow({ index }) {
        if (isLastG0(index)) {
            return (
                <tr style={{ backgroundColor: "cyan" }}>
                    <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].ProdType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g0_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g0_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {((g0_net_amt - g0_gst_amt) / g0_bal).toFixed(2)}

                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g0_gst_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g0_freight} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g0_com_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g0_net_amt} />
                    </td>
                </tr>
            )
        }
    }

    function G1FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{ backgroundColor: "lightgrey" }}>
                    <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].ProdName} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g1_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {((g1_net_amt - g1_gst_amt) / g1_bal).toFixed(2)}
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_gst_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_freight} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_com_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_net_amt} />
                    </td>
                </tr>
            )
        }
    }

    function G2FooterRow({ index }) {
        if (isLastG2(index)) {
            return (
                <tr style={{ backgroundColor: "lightyellow" }}>
                    <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].PartyName} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g2_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {((g2_net_amt - g2_gst_amt) / g2_bal).toFixed(2)}
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_gst_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_freight} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_com_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_net_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_balance} />
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
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={grand_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {((grand_net_amt - grand_gst_amt) / grand_bal).toFixed(2)}
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_gst_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_freight} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_com_amt} />
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
    function isNewG0(index) {
        return index === 0 || transarray[index].ProdTypeId !== transarray[index - 1].ProdTypeId
    }

    function isNewG1(index) {
        return index === 0 || transarray[index].ProdName !== transarray[index - 1].ProdName
    }

    function isNewG2(index) {
        return index === 0 || transarray[index].ProdName !== transarray[index - 1].ProdName || transarray[index].PartyName !== transarray[index - 1].PartyName
    }

    function isLastG0(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].PartyTypeId !== transarray[index + 1].PartyTypeId
    }

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].ProdName !== transarray[index + 1].ProdName
    }

    function isLastG2(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].ProdName !== transarray[index + 1].ProdName || transarray[index].PartyName !== transarray[index + 1].PartyName
   }
    //#endregion Utility Methods
}