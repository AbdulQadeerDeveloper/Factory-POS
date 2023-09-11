import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function StkEvalTrans4Col(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g1_pbal = 0;
    let g1_bal = 0;
    let g1_bal_amt = 0;


    let grand_pbal = 0;
    let grand_bal = 0;
    let grand_bal_amt = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-1 text-center">Product Id</th>
                            <th className="bg-color col-xs-2 text-left">ProdName</th>
                            <th className="bg-color col-xs-1 text-center">Op Qty</th>
                            <th className="bg-color col-xs-1 text-center">Op Amt</th>
                            <th className="bg-color col-xs-1 text-right">Pur Qty</th>
                            <th className="bg-color col-xs-1 text-right">Pur Amt</th>
                            <th className="bg-color col-xs-1 text-right">Cost Qty</th>
                            <th className="bg-color col-xs-1 text-right">Cost Amt</th>
                            <th className="bg-color col-xs-1 text-right">Sale Amt</th>
                            <th className="bg-color col-xs-1 text-right">Cl Qty</th>
                            <th className="bg-color col-xs-1 text-right">Cl Amt</th>
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

    function HeaderRow({ index }) {
        if (isNewG1(index)) {
            g1_pbal = 0;
            g1_bal = 0;
            g1_bal_amt = 0;

            return (
                <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                        <div style={{ background: "lightgrey", color: "#000", width: "300px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "14px", fontWeight: "bold" }}>
                            {transarray[index].ProdType}({transarray[index].ProdTypeId})
                        </div>
                    </td>
                </tr>
            )
        }
    }

    function TD({textAlign, value}) {
        return (
            <td style={{ textAlign: textAlign }}>
                <span style={{ color: "#036" }}>
                    {value}
                </span>
            </td>
        )
    }

    function DataRow({ data }) {
        g1_pbal += data.PBal || 0;
        g1_bal += data.Bal || 0;
        g1_bal_amt += data.BalAmt || 0;

        grand_pbal += data.PBal || 0;
        grand_bal += data.Bal || 0;
        grand_bal_amt += data.BalAmt || 0;

        return (
            <tr className="entry_row statement_row" style={data.Cur > data.CrLimit ? { backgroundColor: "lavender" } : null}>
                <TD textAlign={"center"} value={data.ProductId} />
                <TD textAlign={"left"} value={data.ProdName} />
                <TD textAlign={"right"} value={data.OpQty} />
                <TD textAlign={"right"} value={data.OpAmt} />
                <TD textAlign={"right"} value={data.InQty} />
                <TD textAlign={"right"} value={data.InAmt} />
                <TD textAlign={"right"} value={data.OutQty} />
                <TD textAlign={"right"} value={data.OutAmt} />
                <TD textAlign={"right"} value={data.SalAmt} />
                <TD textAlign={"right"} value={data.ClQty} />
                <TD textAlign={"right"} value={data.ClAmt} />
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{ backgroundColor: "lightgrey" }}>
                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].ProdType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={g1_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal !== 0 ? g1_bal_amt / g1_bal : null} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_bal_amt} />
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
                        <Currency value={grand_pbal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal !== 0 ? grand_bal_amt / grand_bal : null} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_bal_amt} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].ProdTypeId !== transarray[index + 1].ProdTypeId

    }

    function isNewG1(index) {
        return index === 0 || transarray[index].ProdTypeId !== transarray[index - 1].ProdTypeId
    }
    //#endregion Utility Methods
}