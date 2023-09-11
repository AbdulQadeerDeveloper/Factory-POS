import React from "react";
import Currency from "../../../Shared_Components/Currency";

export default function Trial2Trans4Col(props) {
  const { transarray } = props;

  //#region variables
  // g for group level
  let g1_opBal = 0;
  let g1_curDr = 0;
  let g1_curCr = 0;
  let g1_clBal = 0;

  let grand_opBal = 0;
  let grand_curDr = 0;
  let grand_curCr = 0;
  let grand_clBal = 0;
  //#endregion variables

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered table-hover"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "12px" }}>
              <th className="bg-color col-xs-1 text-center">A/C Code</th>
              <th className="bg-color col-xs-6 text-left">A/C Title</th>
              <th className="bg-color col-xs-1 text-right">Opening</th>
              <th className="bg-color col-xs-1 text-right">Cur Dr</th>
              <th className="bg-color col-xs-1 text-right">Cur Cr</th>
              <th className="bg-color col-xs-1 text-right">Closing</th>
            </tr>
          </thead>
          <tbody>
            {transarray?.length > 0 ? (
              transarray?.map((data, i) => {
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
                <td colSpan="6" style={{ textAlign: "center" }}>
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
      g1_opBal = 0;
      g1_curDr = 0;
      g1_curCr = 0;
      g1_clBal = 0;

      return (
        <tr>
          <td colSpan={7} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "lightgrey",
                color: "#000",
                width: "300px",
                padding: "5px 0",
                textTransform: "uppercase",
                margin: "0 auto",
                fontSize: "14px",
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

  function NewWindowOpen(partyId,partyName) {
    let url = `acstat?partyid=${partyId}&partyname=${partyName}`;
    window.open(url, "_blank");
  }

  function DataRow({ data }) {
    g1_opBal += data.OpBal || 0;
    g1_curDr += data.CurDr || 0;
    g1_curCr += data.CurCr || 0;
    g1_clBal += data.ClBal || 0;

    grand_opBal += data.OpBal || 0;
    grand_curDr += data.CurDr || 0;
    grand_curCr += data.CurCr || 0;
    grand_clBal += data.ClBal || 0;

    return (
      <tr
        className="entry_row statement_row"
        style={
          data.ClBalDr > data.CrLimit ? { backgroundColor: "lavender" } : null
        }
      >
        <td style={{ textAlign: "center" }}>
          <span
            onClick={(e) => NewWindowOpen(data.PartyId, data.PartyName)}
            style={{
              borderRadius: "2px",
              textAlign: "right",
              color: "#036",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {data.PartyId}
          </span>
        </td>
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.PartyName}</span>
        </td>
        <td style={{ textAlign: "right" }}>
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
            <Currency value={g1_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_clBal} />
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
            <Currency value={grand_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_clBal} />
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
