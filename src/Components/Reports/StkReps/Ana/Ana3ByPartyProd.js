import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function Ana2ByProdParty(props) {
    const { transarray } = props;

    //#region variables
    // g for group level

    let g1_jan = 0;
    let g1_feb = 0;
    let g1_mar = 0;
    let g1_apr = 0;
    let g1_may = 0;
    let g1_jun = 0;
    let g1_jul = 0;
    let g1_aug = 0;
    let g1_sep = 0;
    let g1_oct = 0;
    let g1_nov = 0;
    let g1_dec = 0;

    let grand_jan = 0;
    let grand_feb = 0;
    let grand_mar = 0;
    let grand_apr = 0;
    let grand_may = 0;
    let grand_jun = 0;
    let grand_jul = 0;
    let grand_aug = 0;
    let grand_sep = 0;
    let grand_oct = 0;
    let grand_nov = 0;
    let grand_dec = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-3 text-left">Party/Product</th>
                            <th className="bg-color col-xs-1 text-center">Year</th>
                            <th className="bg-color col-xs-1 text-right">Jan</th>
                            <th className="bg-color col-xs-1 text-right">Feb</th>
                            <th className="bg-color col-xs-1 text-right">Mar</th>
                            <th className="bg-color col-xs-1 text-right">Apr</th>
                            <th className="bg-color col-xs-1 text-right">May</th>
                            <th className="bg-color col-xs-1 text-right">Jun</th>
                            <th className="bg-color col-xs-1 text-right">Jul</th>
                            <th className="bg-color col-xs-1 text-right">Aug</th>
                            <th className="bg-color col-xs-1 text-right">Sep</th>
                            <th className="bg-color col-xs-1 text-right">Oct</th>
                            <th className="bg-color col-xs-1 text-right">Nov</th>
                            <th className="bg-color col-xs-1 text-right">Dec</th>
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

            g1_jan = 0;
            g1_feb = 0;
            g1_mar = 0;
            g1_apr = 0;
            g1_may = 0;
            g1_jun = 0;
            g1_jul = 0;
            g1_aug = 0;
            g1_sep = 0;
            g1_oct = 0;
            g1_nov = 0;
            g1_dec = 0;


            return (
                <tr>
                    <td colSpan={14} style={{ textAlign: "center" }}>
                        <div style={{ background: "lightgrey", color: "#000", width: "600px", padding: "5px 0", textTransform: "uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold" }}>
                            {transarray[index].PartyName}
                        </div>
                    </td>
                </tr>
            )
        }
    }
    function DataRow({ data }) {

        g1_jan += data.Jan || 0;
        g1_feb += data.Feb || 0;
        g1_mar += data.Mar || 0;
        g1_apr += data.Apr || 0;
        g1_may += data.May || 0;
        g1_jun += data.Jun || 0;
        g1_jul += data.Jul || 0;
        g1_aug += data.Aug || 0;
        g1_sep += data.Sep || 0;
        g1_oct += data.Oct || 0;
        g1_nov += data.Nov || 0;
        g1_dec += data.Dec || 0;

        grand_jan += data.Jan || 0;
        grand_feb += data.Feb || 0;
        grand_mar += data.Mar || 0;
        grand_apr += data.Apr || 0;
        grand_may += data.May || 0;
        grand_jun += data.Jun || 0;
        grand_jul += data.Jul || 0;
        grand_aug += data.Aug || 0;
        grand_sep += data.Sep || 0;
        grand_oct += data.Oct || 0;
        grand_nov += data.Nov || 0;
        grand_dec += data.Dec || 0;
        return (
            <tr className="entry_row statement_row">
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.ProdName}
                    </span>
                </td>
                <td style={{ textAlign: "center", maxWidth: "30" }}>
                    <span style={{ color: "#036", textTransform: "uppercase" }}>
                        {data.Year}
                    </span>
                </td>
                <td style={{ textAlign: "right", maxWidth: "30" }}>
                    <span style={{ color: "#036" }}>
                        {data.Jan}
                    </span>
                </td>
                <td style={{ textAlign: "left" }}>
                    <span style={{ color: "#036" }}>
                        {data.Feb}
                    </span>
                </td>
                <td style={{ textAlign: "right", maxWidth: "30" }}>
                    <span style={{ color: "#036" }}>
                        {data.Mar}
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.Apr} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#036" }}>
                        <Currency value={data.May} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Jun} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Jul} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Aug} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Sep} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Oct} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Nov} />
                    </span>
                </td>
                <td style={{ textAlign: "right" }}>
                    <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.Dec} />
                    </span>
                </td>
            </tr>
        )
    }

    function FooterRow({ index }) {
        if (isLastG1(index)) { //Last Row
            return (
                <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_jan} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_feb} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_mar} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_apr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_may} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_jun} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_jul} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_aug} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_sep} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_oct} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_nov} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_dec} />
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
                        <Currency value={grand_jan} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_feb} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_mar} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_apr} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_may} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_jun} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_jul} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_aug} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_sep} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_oct} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_nov} />
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_dec} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = transarray.length - 1;
        return index === lastIndex || transarray[index].PartyId !== transarray[index + 1].PartyId

    }

    function isNewG1(index) {
        return index === 0 || transarray[index].PartyId !== transarray[index - 1].PartyId
    }
    //#endregion Utility Methods
}