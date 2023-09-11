import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function StkPLByProdSum(props) {
    const { transarray } = props;

    //#region variables
    // g for group level

    let g1_pbal = 0;
    let g1_sal_amt = 0;
    let g1_cost_amt = 0;
    let g1_pl_amt = 0;

    let g2_pbal = 0;
    let g2_sal_amt = 0;
    let g2_cost_amt = 0;
    let g2_pl_amt = 0;

    let grand_pbal = 0;
    let grand_sal_amt = 0;
    let grand_cost_amt = 0;
    let grand_pl_amt = 0;

    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-2 text-left">PartyName</th>
                            <th className="bg-color col-xs-1 text-center">VocNo</th>
                            <th className="bg-color col-xs-1 text-center">Inv.Date</th>
                            <th className="bg-color col-xs-2 text-right">Prod Name</th>
                            <th className="bg-color col-xs-1 text-right">Sal.Qty</th>
                            <th className="bg-color col-xs-1 text-right">Sal.Amt</th>
                            <th className="bg-color col-xs-1 text-right">Cost.Amt</th>
                            <th className="bg-color col-xs-1 text-right">PL.Amt</th>
                            <th className="bg-color col-xs-1 text-right">PL/Unit</th>
                            <th className="bg-color col-xs-1 text-right">PL %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transarray.length > 0 ? (
                                transarray.map((data, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <G1HeaderRow index={i} />
                                            <G2HeaderRow index={i} />
                                            <DataRow data={data} />
                                            <G2FooterRow index={i} />
                                            <G1FooterRow index={i} />
                                            <GrandRow index={i} />
                                        </React.Fragment>
                                    )
                                })) : (
                                <tr style={{ background: "lightgrey", textAlign: "justify" }}>
                                    <td colSpan="12" style={{ textAlign: "center" }}>No Record Found!</td>
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

    function G1HeaderRow({ index }) {
        if (isNewG1(index)) {
            g1_pbal = 0;
            g1_sal_amt = 0;
            g1_cost_amt = 0;
            g1_pl_amt = 0;

            return (
                <tr>
                    <td colSpan={10} style={{ textAlign: "center" }}>
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
            g2_pbal = 0;
            g2_sal_amt = 0;
            g2_cost_amt = 0;
            g2_pl_amt = 0;

            return (null)
        }
    }
    function DataRow({ data }) {
        g1_pbal += data.PQty || 0;
        g1_sal_amt += data.SalAmt || 0;
        g1_cost_amt += data.CostAmt || 0;
        g1_pl_amt += data.PLAmt || 0;

        g2_pbal += data.PQty || 0;
        g2_sal_amt += data.SalAmt || 0;
        g2_cost_amt += data.CostAmt || 0;
        g2_pl_amt += data.PLAmt || 0;

        grand_pbal += data.PQty || 0;
        grand_sal_amt += data.SalAmt || 0;
        grand_cost_amt += data.CostAmt || 0;
        grand_pl_amt += data.PLAmt || 0;

        return (null)
    }

    function G1FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{ backgroundColor: "lightgrey" }}>
                    <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].ProdName} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g1_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_sal_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_cost_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_pl_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>

                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_cost_amt > 0 ? (g1_pl_amt / g1_cost_amt * 100).toFixed(2) : 0} />%
                    </td>
                </tr>
            )
        }
    }

    function G2FooterRow({ index }) {
        if (isLastG2(index)) {
            return (
                <tr className="entry_row statement_row">
                    <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].PartyName} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g2_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_sal_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_cost_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_pl_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>

                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g2_cost_amt > 0 ? (g2_pl_amt / g2_cost_amt * 100).toFixed(2) : 0} />%
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={grand_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_sal_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_cost_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_pl_amt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_cost_amt > 0 ? (grand_pl_amt / grand_cost_amt * 100).toFixed(2) : 0} />%
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

    function isNewG2(index) {
        return index === 0 || transarray[index].ProdName !== transarray[index - 1].ProdName
    }

    function isLastG2(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].ProdName !== transarray[index + 1].ProdName

    }
    //#endregion Utility Methods
}