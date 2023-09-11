import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function PayablesTrans(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g1_crLimitAmt = 0;
    let g1_opDr = 0;
    let g1_opCr = 0;
    let g1_curDr = 0;
    let g1_curCr = 0;
    let g1_clDr = 0;
    let g1_clCr = 0;

    
    let grand_crLimitAmt = 0;
    let grand_opDr = 0;
    let grand_opCr = 0;
    let grand_curDr = 0;
    let grand_curCr = 0;
    let grand_clDr = 0;
    let grand_clCr = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-1 text-center">A/C Code</th>
                            <th className="bg-color col-xs-3 text-left">A/C Title</th>
                            <th className="bg-color col-xs-1 text-center">Cr Limit</th>
                            <th className="bg-color col-xs-1 text-right">Op Dr</th>
                            <th className="bg-color col-xs-1 text-right">Op Cr</th>
                            <th className="bg-color col-xs-1 text-right">Cur Dr</th>
                            <th className="bg-color col-xs-1 text-right">Cur Cr</th>
                            <th className="bg-color col-xs-1 text-right">Cl Dr</th>
                            <th className="bg-color col-xs-1 text-right">Cl Cr</th>
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
            g1_crLimitAmt = 0;
            g1_opDr = 0;
            g1_opCr = 0;
            g1_curDr = 0;
            g1_curCr = 0;
            g1_clDr = 0;
            g1_clCr = 0;
    
            return (
                <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
                        <div style={{background: "lightgrey", color: "#000", width: "300px", padding:"5px 0", textTransform:"uppercase", margin: "0 auto", fontSize: "18px", fontWeight: "bold"}}>
                            {transarray[index].PartyType}({transarray[index].PartyTypeId})
                        </div>
                    </td>
                </tr>
            )
        }
    }    

    function DataRow({ data }) {
        g1_crLimitAmt += data.CrLimit || 0;
        g1_opDr += data.OpBalDr || 0;
        g1_opCr += data.OpBalCr || 0;
        g1_curDr += data.CurBalDr || 0;
        g1_curCr += data.CurBalCr || 0;
        g1_clDr += data.ClBalDr || 0;
        g1_clCr += data.ClBalCr || 0;

        grand_crLimitAmt += data.CrLimit || 0;
        grand_opDr += data.OpBalDr || 0;
        grand_opCr += data.OpBalCr || 0;
        grand_curDr += data.CurBalDr || 0;
        grand_curCr += data.CurBalCr || 0;
        grand_clDr += data.ClBalDr || 0;
        grand_clCr += data.ClBalCr || 0;

        return (
            <tr className="entry_row statement_row" style={data.ClBal > data.CrLimit ? {backgroundColor: "lavender"} : null}>
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036" }}>
                        {data.PartyId}
                    </span>
                </td>
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.PartyName}
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.CrLimit} />
                    </span>
                </td>
                <td>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.OpBalDr} />
                    </span>
                </td>
                <td>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.OpBalCr} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.CurBalDr} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.CurBalCr} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.ClBalDr} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.ClBalCr} />
                    </span>
                </td>
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{backgroundColor: "lightgrey"}}>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].PartyType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_crLimitAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_opDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_opCr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_curDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_curCr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_clDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_clCr} />
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        if (index === transarray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_crLimitAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_opDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_opCr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_curDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_curCr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_clDr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_clCr} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].PartyTypeId !== transarray[index + 1].PartyTypeId

    }

    function isNewG1(index) {
        return index === 0 || transarray[index].PartyTypeId !== transarray[index - 1].PartyTypeId
    }
    //#endregion Utility Methods
}