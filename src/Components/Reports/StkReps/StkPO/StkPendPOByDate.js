import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function StkPendPOByDate(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g1_po_pqty = 0;
    let g1_in_pqty = 0;
    let g1_pbal = 0;

    let grand_po_pqty = 0;
    let grand_in_pqty = 0;
    let grand_pbal = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-1 text-center">VocNo</th>
                            <th className="bg-color col-xs-1 text-center">FirmId</th>
                            <th className="bg-color col-xs-4 text-left">Prod Name</th>
                            <th className="bg-color col-xs-1 text-center">Rate</th>
                            <th className="bg-color col-xs-1 text-center">GSTRate</th>
                            <th className="bg-color col-xs-1 text-center">AdvRate</th>
                            <th className="bg-color col-xs-1 text-right">PO Qty</th>
                            <th className="bg-color col-xs-1 text-right">In Qty</th>
                            <th className="bg-color col-xs-1 text-right">P Bal</th>
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
            g1_po_pqty = 0;
            g1_in_pqty = 0;
            g1_pbal = 0;
        
            return (
                <tr>
                    <td colSpan={12} style={{ textAlign: "center" }}>
                        <div style={{ background: "lightgrey", color: "#000", width: "300px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold" }}>
                            {transarray[index]?.Date?.slice(0, 10)}
                        </div>
                    </td>
                </tr>
            )
        }
    }

    function DataRow({ data }) {
        g1_po_pqty += data.PO_PQTY || 0;
        g1_in_pqty += data.IN_PQTY || 0;
        g1_pbal += data.PBAL || 0;
    
        grand_po_pqty += data.PO_PQTY || 0;
        grand_in_pqty += data.IN_PQTY || 0;
        grand_pbal += data.PBAL || 0;
    
        return (
            <tr className="entry_row statement_row">
                <td style={{ textAlign: "center", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.Demand}
                    </span>
                </td>
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036" }}>
                        {data.FirmId}
                    </span>
                </td>
                <td style={{ textAlign: "left", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.Prod}
                    </span>
                </td>
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036" }}>
                        {data.Rate}
                    </span>
                </td>
                <td style={{ textAlign: "center", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.GSTPer}
                    </span>
                </td>
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.AdvPer} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.PO_PQTY} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.IN_PQTY} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.PBAL} />
                    </span>
                </td>
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{ backgroundColor: "lightgrey" }}>
                    <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_po_pqty} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_in_pqty} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_pbal} />
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_po_pqty} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_in_pqty} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_pbal} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].Date !== transarray[index + 1].Date

    }

    function isNewG1(index) {
        return index === 0 || transarray[index].Date !== transarray[index - 1].Date
    }
    //#endregion Utility Methods
}