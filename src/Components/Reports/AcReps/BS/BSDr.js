import React from 'react';
import Currency from '../../../Shared_Components/Currency';

export default function BSDr(props) {
    const { drArray, setGrandDr, isSum } = props;

    //#region variables
    // g for group level
    let g1_debit = 0;

    
    let grand_debit = 0;
    //#endregion variables

    return (
        <div>
            <div className="panel panel-default">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ fontSize: "12px" }}>
                            <th className="bg-color col-xs-3 text-center">A/C Code</th>
                            <th className="bg-color col-xs-6 text-left">A/C Title</th>
                            <th className="bg-color col-xs-3 text-center">Debit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            drArray.length > 0 ? (
                                drArray.map((data, i) => {
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
            g1_debit = 0;
            if (isSum) return;

    
            return (
                <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                        <div style={{background: "lightgrey", color: "#000", width: "300px", padding:"5px 0", textTransform:"uppercase", margin: "0 auto", fontSize: "12px", fontWeight: "bold"}}>
                            {drArray[index].PartyType}({drArray[index].PartyTypeId})
                        </div>
                    </td>
                </tr>
            )
        }
    }    

    function DataRow({ data }) {
        g1_debit += data.Debit || 0;

        grand_debit += data.Debit || 0;

        if (isSum) return;


        return (
            <tr className="entry_row statement_row" style={data.ClBalDr > data.CrLimit ? {backgroundColor: "lavender"} : null}>
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
                        <Currency value={data.Debit} />
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
                        {drArray[index].PartyType} Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={g1_debit} />
                    </td>
                </tr>
            )
        }
    }

    function GrandRow({ index }) {
        setGrandDr(grand_debit)
        if (index === drArray.length - 1) { //Last Row
            return (
                <tr>
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
                        Grand Total:
                    </td>
                    <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
                        <Currency value={grand_debit} />
                    </td>
                </tr>
            )
        }
    }

    //#endregion Sub-Components

    //#region Utility Methods

    function isLastG1(index) {
        const lastIndex = drArray.length - 1;
        return index === lastIndex || drArray[index].PartyTypeId !== drArray[index + 1].PartyTypeId

    }

    function isNewG1(index) {
        return index === 0 || drArray[index].PartyTypeId !== drArray[index - 1].PartyTypeId
    }
    //#endregion Utility Methods
}