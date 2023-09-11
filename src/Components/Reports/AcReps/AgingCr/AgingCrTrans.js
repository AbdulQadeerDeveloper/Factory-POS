import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function AgingCrTrans(props) {
    const { transarray } = props;

    //#region variables
    // g for group level
    let g1_crLimitAmt = 0;
    let g1_curAmt = 0;
    let g1_oneAmt = 0;
    let g1_twoAmt = 0;
    let g1_threeAmt = 0;
    let g1_fourAmt = 0;
    let g1_fiveAmt = 0;

    
    let grand_crLimitAmt = 0;
    let grand_curAmt = 0;
    let grand_oneAmt = 0;
    let grand_twoAmt = 0;
    let grand_threeAmt = 0;
    let grand_fourAmt = 0;
    let grand_fiveAmt = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-1 text-center">A/C Code</th>
                            <th className="bg-color col-xs-3 text-left">A/C Title</th>
                            <th className="bg-color col-xs-1 text-center">Dr Days</th>
                            <th className="bg-color col-xs-1 text-right">Dr Limit</th>
                            <th className="bg-color col-xs-1 text-right">Balance</th>
                            <th className="bg-color col-xs-1 text-right">30 Days</th>
                            <th className="bg-color col-xs-1 text-right">45 Days</th>
                            <th className="bg-color col-xs-1 text-right">60 Days</th>
                            <th className="bg-color col-xs-1 text-right">90 Days</th>
                            <th className="bg-color col-xs-1 text-right">120 Days</th>
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
            g1_curAmt = 0;
            g1_oneAmt = 0;
            g1_twoAmt = 0;
            g1_threeAmt = 0;
            g1_fourAmt = 0;
            g1_fiveAmt = 0;
    
            return (
                <tr>
                    <td colSpan={10} style={{ textAlign: "center" }}>
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
        g1_curAmt += data.Cur || 0;
        g1_oneAmt += data.one || 0;
        g1_twoAmt += data.two || 0;
        g1_threeAmt += data.three || 0;
        g1_fourAmt += data.four || 0;
        g1_fiveAmt += data.five || 0;

        grand_crLimitAmt += data.CrLimit || 0;
        grand_curAmt += data.Cur || 0;
        grand_oneAmt += data.one || 0;
        grand_twoAmt += data.two || 0;
        grand_threeAmt += data.three || 0;
        grand_fourAmt += data.four || 0;
        grand_fiveAmt += data.five || 0;

        return (
            <tr className="entry_row statement_row" style={data.Cur > data.CrLimit ? {backgroundColor: "lavender"} : null}>
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
                <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.CrDays}
                    </span>
                </td>
                <td style={data.Cur > data.CrLimit ? {textAlign: "right", backgroundColor: "lavender"} : {textAlign: "right"}}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.CrLimit} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.Cur} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.one} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.two} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.three} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.four} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.five} />
                    </span>
                </td>
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) {
            return (
                <tr style={{backgroundColor: "lightgrey"}}>
                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                        {transarray[index].PartyType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_crLimitAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_curAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_oneAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_twoAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_threeAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_fourAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_fiveAmt} />
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
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_crLimitAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_curAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_oneAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_twoAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_threeAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_fourAmt} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_fiveAmt} />
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