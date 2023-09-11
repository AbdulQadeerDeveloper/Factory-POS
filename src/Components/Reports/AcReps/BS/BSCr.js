import React from "react";
import Currency from "../../../Shared_Components/Currency";

export default function BSCr(props) {
  const { crArray, setGrandCr, isSum } = props;

  //#region variables
  // g for group level
  let g1_credit = 0;

  let grand_credit = 0;
  //#endregion variables

  return (
    <div>
      <div className="panel panel-default">
        <table
          className="table table-bordered table-responsive"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "12px" }}>
              <th className="bg-color col-xs-3 text-center">A/C Code</th>
              <th className="bg-color col-xs-6 text-left">A/C Title</th>
              <th className="bg-color col-xs-3 text-center">Credit</th>
            </tr>
          </thead>
          <tbody>
            {crArray.length > 0 ? (
              crArray.map((data, i) => {
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
      g1_credit = 0;
      if (isSum) return;
      return (
        <tr>
          <td colSpan={3} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "lightgrey",
                color: "#000",
                width: "300px",
                padding: "5px 0",
                textTransform: "uppercase",
                margin: "0 auto",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {crArray[index].PartyType}({crArray[index].PartyTypeId})
            </div>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_credit += data.Credit || 0;

    grand_credit += data.Credit || 0;

    if (isSum) return;

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
            <Currency value={data.Credit} />
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
            {crArray[index].PartyType} Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_credit} />
          </td>
        </tr>
      );
    }
  }

  function GrandRow({ index }) {
    setGrandCr(grand_credit);
    if (index === crArray.length - 1) {
      //Last Row
      return (
        <tr>
          <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
            Grand Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_credit} />
          </td>
        </tr>
      );
    }
  }

  //#endregion Sub-Components

  //#region Utility Methods

  function isLastG1(index) {
    const lastIndex = crArray.length - 1;
    return (
      index === lastIndex ||
      crArray[index].PartyTypeId !== crArray[index + 1].PartyTypeId
    );
  }

  function isNewG1(index) {
    return (
      index === 0 ||
      crArray[index].PartyTypeId !== crArray[index - 1].PartyTypeId
    );
  }
  //#endregion Utility Methods
}
