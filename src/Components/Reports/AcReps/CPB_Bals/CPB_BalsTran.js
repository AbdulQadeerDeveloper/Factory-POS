import React from "react";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";

export default function CPB_BalsTran(props) {
  const { transarray } = props;

  //#region variables
  // g for group level
  let grand_ChqAmt = 0;
  let grand_RecAmt = 0;
  let grand_TransIss = 0;
  let grand_TransRec = 0;
  let grand_BalAmt = 0;
  //#endregion variables

  function NewWindowOpen(e) {
    let url = "cpbleg/" + e.target.innerHTML;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr className="report_cpb_bal_th" style={{ fontSize: "12px" }}>
              <th className="bg-color text-center col-xs-1 cpb_bal_th_cpbno">
                CPB
              </th>
              <th className="bg-color text-center col-xs-1 cpb_bal_th_date">
                Date
              </th>
              <th className="bg-color text-center col-xs-1 cpb_bal_th_date">
                ChqNo
              </th>
              <th className="bg-color text-center col-xs-1 cpb_bal_th_date">
                ChqDate
              </th>
              <th className="bg-color text-left col-xs-2 cpb_bal_th_partyname">
                Party Name
              </th>
              <th className="bg-color col-xs-1 text-left cpb_bal_th_bank">
                Bank
              </th>
              <th className="bg-color col-xs-1 text-right cpb_bal_th_amount">
                ChqAmt
              </th>
              <th className="bg-color col-xs-1 text-right cpb_bal_th_amount">
                RecAmt
              </th>
              <th className="bg-color col-xs-1 text-right cpb_bal_th_amount">
                TransIss
              </th>
              <th className="bg-color col-xs-1 text-right cpb_bal_th_amount">
                TransRec
              </th>
              <th className="bg-color col-xs-1 text-right cpb_bal_th_amount">
                Balance
              </th>
              <th className="bg-color col-xs-3 text-left cpb_bal_th_issueto">
                IssueTo
              </th>
            </tr>
          </thead>
          <tbody>
            {transarray?.length > 0 ? (
              transarray.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    {/* <HeaderRow index={i} /> */}
                    <DataRow data={data} />
                    {/* <FooterRow index={i} /> */}
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

  function DataRow({ data }) {
    grand_ChqAmt += data.ChqAmt || 0;
    grand_RecAmt += data.RecAmt || 0;
    grand_TransIss += data.TransIss || 0;
    grand_TransRec += data.TransRec || 0;
    grand_BalAmt += data.BalAmt || 0;

    return (
      <tr className="entry_row statement_row">
        <td style={{ textAlign: "center" }}>
          <span
            onClick={(e) => NewWindowOpen(e)}
            style={{
              borderRadius: "2px",
              textAlign: "right",
              color: "#036",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {data.CPB}
          </span>
        </td>
        <td style={{ textAlign: "center" }}>
          <span style={{ color: "#036" }}>
            <ConvertedDate date={data.Date} />
          </span>
        </td>
        <td style={{ textAlign: "center" }}>
          <span style={{ color: "#036", textTransform: "uppercase" }}>
            {data.ChqNo}
          </span>
        </td>
        <td style={{ textAlign: "center" }}>
          <span style={{ color: "#036" }}>
            <ConvertedDate date={data.ChqDate} />
          </span>
        </td>
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.PartyName}</span>
        </td>
        <td style={{ textAlign: "left" }}>
          <div style={{ color: "#036", fontWeight: "bold" }}>
            {data.BankName}
          </div>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ color: "#036" }}>
            <Currency value={data.ChqAmt} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.RecAmt} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.TransIss} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.TransRec} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.BalAmt} />
          </span>
        </td>
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.IssueName}</span>
        </td>
      </tr>
    );
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) {
      //Last Row
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
            Grand Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_ChqAmt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_RecAmt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_TransIss} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_TransRec} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_BalAmt} />
          </td>
        </tr>
      );
    }
  }

  //#endregion Sub-Components
}
