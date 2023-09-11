import React from "react";
import Currency from "../../../Shared_Components/Currency";

export default function RecablesTrans(props) {
  const { transarray } = props;

  //#region variables
  // g for group level
  let g1_crLimitAmt = 0;
  let g1_opBal = 0;
  let g1_curDr = 0;
  let g1_curCr = 0;
  let g1_clDr = 0;
  let g1_clCr = 0;
  let g1_clCPB = 0;
  let g1_opCPB = 0;

  let grand_crLimitAmt = 0;
  let grand_opBal = 0;
  let grand_curDr = 0;
  let grand_curCr = 0;
  let grand_clDr = 0;
  let grand_clCr = 0;
  let grand_clCPB = 0;
  let grand_opCPB = 0;
  //#endregion variables

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "12px" }}>
              <th className="bg-color col-xs-1 text-center">A/C Code</th>
              <th className="bg-color col-xs-3 text-left">A/C Title</th>
              <th className="bg-color col-xs-1 text-center">Cr Limit</th>
              <th className="bg-color col-xs-1 text-right">Op CPB</th>
              <th className="bg-color col-xs-1 text-right">Opening</th>
              <th className="bg-color col-xs-1 text-right">Cur Dr</th>
              <th className="bg-color col-xs-1 text-right">Cur Cr</th>
              <th className="bg-color col-xs-1 text-right">Closing</th>
              <th className="bg-color col-xs-1 text-right">Cl CPB</th>
              <th className="bg-color col-xs-1 text-right">Closing+CPB</th>
            </tr>
          </thead>
          <tbody>
            {transarray.length > 0 ? (
              transarray.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <HeaderRow index={i} />
                    <DataRow data={data} />
                    <FooterRow index={i} />
                    <GrandRow index={i} />
                  </React.Fragment>
                );
              })
            ) : (
              <tr style={{ background: "lightgrey", textAlign: "justify" }}>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No Record Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="clearfix"></div>
    </div>
  );

  //#region Sub-Components

  function HeaderRow({ index }) {
    if (isNewG1(index)) {
      g1_crLimitAmt = 0;
      g1_opBal = 0;
      g1_curDr = 0;
      g1_curCr = 0;
      g1_clDr = 0;
      g1_clCr = 0;
      g1_clCPB = 0;
      g1_opCPB = 0;

      return (
        <tr>
          <td colSpan={11} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "lightgrey",
                color: "#000",
                width: "300px",
                padding: "5px 0",
                textTransform: "uppercase",
                margin: "0 auto",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {transarray[index].PartyType}({transarray[index].PartyTypeId})
            </div>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_crLimitAmt += data.CrLimit || 0;
    g1_opBal += data.OpBal || 0;
    g1_curDr += data.CurDr || 0;
    g1_curCr += data.CurCr || 0;
    g1_clDr += data.ClDr || 0;
    g1_clCr += data.ClCr || 0;
    g1_clCPB += data.ClCPB || 0;
    g1_opCPB += data.OpCPB || 0;

    grand_crLimitAmt += data.CrLimit || 0;
    grand_opBal += data.OpBal || 0;
    grand_curDr += data.CurDr || 0;
    grand_curCr += data.CurCr || 0;
    grand_clDr += data.ClDr || 0;
    grand_clCr += data.ClCr || 0;
    grand_clCPB += data.ClCPB || 0;
    grand_opCPB += data.OpCPB || 0;

    return (
      <tr
        className="entry_row statement_row"
        style={
          data.ClBalDr > data.CrLimit ? { backgroundColor: "lavender" } : null
        }
      >
        <td style={{ textAlign: "center" }}>
          <span style={{ color: "#036" }}>{data.PartyId}</span>
        </td>
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.PartyName}</span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ color: "#036" }}>
            <Currency value={data.CrLimit} />
          </span>
        </td>
        <td>
          <span style={{ color: "#036" }}>
            <Currency value={data.OpCPB} />
          </span>
        </td>
        <td>
          <span style={{ color: "#036" }}>
            <Currency value={data.OpBal} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ color: "#036" }}>
            <Currency value={data.CurDr} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.CurCr} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.ClBal} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.ClCPB} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.ClCPB + data.ClBal} />
          </span>
        </td>
      </tr>
    );
  }

  function FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr style={{ backgroundColor: "lightgrey" }}>
          <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
            {transarray[index].PartyType} Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_crLimitAmt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_opCPB} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_clDr - g1_clCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_clCPB} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_clDr - g1_clCr + g1_clCPB} />
          </td>
        </tr>
      );
    }
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) {
      //Last Row
      return (
        <tr>
          <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
            Grand Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_crLimitAmt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_opCPB} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_clDr - grand_clCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_clCPB} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_clDr - grand_clCr + grand_clCPB} />
          </td>
        </tr>
      );
    }
  }

  //#endregion Sub-Components

  //#region Utility Methods

  function isLastG1(index) {
    const lastIndex = transarray.length - 1;
    return (
      index === lastIndex ||
      transarray[index].PartyTypeId !== transarray[index + 1].PartyTypeId
    );
  }

  function isNewG1(index) {
    return (
      index === 0 ||
      transarray[index].PartyTypeId !== transarray[index - 1].PartyTypeId
    );
  }
  //#endregion Utility Methods
}
