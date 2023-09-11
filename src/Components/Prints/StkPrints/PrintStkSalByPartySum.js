import React from "react";
// import '../_shared/printmain.css'
import "../_shared/printmain.css";
import "../_shared/ReportGetNow";
import Currency from "../../Shared_Components/Currency";
import ReportGetNow from "../_shared/ReportGetNow";
import ReportHead from "../_shared/ReportHead";
import DateHead from "../_shared/DateHead";
import ConvertedDate from "../../Shared_Components/ConvertedDate";

export default function PrintStkSalByPartySum({
  parentobj,
  componentRef,
  transarray,
  isSum = false
}) {

  //#region variables
  // g for group level
  let g0_pbal = 0;
  let g0_bal = 0;
  let g0_gst_amt = 0;
  let g0_freight = 0;
  let g0_com_amt = 0;
  let g0_net_amt = 0;

  let g1_balance = 0;
  let g1_pbal = 0;
  let g1_bal = 0;
  let g1_gst_amt = 0;
  let g1_freight = 0;
  let g1_com_amt = 0;
  let g1_net_amt = 0;

  let g2_pbal = 0;
  let g2_bal = 0;
  let g2_gst_amt = 0;
  let g2_freight = 0;
  let g2_com_amt = 0;
  let g2_net_amt = 0;

  let grand_pbal = 0;
  let grand_bal = 0;
  let grand_gst_amt = 0;
  let grand_freight = 0;
  let grand_com_amt = 0;
  let grand_net_amt = 0;
  //#endregion variables

  return (
    <div className="container newprint">
      <div ref={componentRef}>
        <ReportGetNow />
        <table cellSpacing="0" style={{ fontSize: "10px" }}>
          <thead>
          <ReportHead colspan={10} title={`Sales By Party ${isSum ? "Summary" : ""} `} />
            <DateHead colspan={10} parentobj={parentobj} />
            <tr className="dark-border bold">
              <th style={{ width: "15%" }} className="left">
                {isSum ? "Party Name" : "VocNo (Date)"}
              </th>
              <th style={{ width: "15%" }} className="center">
                Prod Name
              </th>
              <th style={{ width: "6%" }} className="center">
                PQty
              </th>
              <th style={{ width: "6%" }} className="right">
                Qty
              </th>
              <th style={{ width: "7%" }} className="right">
                Rate
              </th>
              <th style={{ width: "8%" }} className="right">
                GST
              </th>
              <th style={{ width: "6%" }} className="center">
                Freight
              </th>
              <th style={{ width: "7%" }} className="center">
                ComAmt
              </th>
              <th style={{ width: "8%" }} className="right">
                Amount
              </th>
              <th style={{ width: "8%" }} className="right">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transarray?.length > 0 &&
              transarray.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <G0HeaderRow index={i} />
                    <G1HeaderRow index={i} />
                    <G2HeaderRow index={i} />
                    <DataRow data={data} />
                    <G2FooterRow index={i} />
                    <G1FooterRow index={i} />
                    <G0FooterRow index={i} />
                    <GrandRow index={i} />
                  </React.Fragment>
                );
              })}
            {transarray?.length === 0 && (
              <tr className="bg center">
                <td colSpan="12">No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  //#region Sub-Components
  function G0HeaderRow({ index }) {
    if (isNewG0(index)) {
      g0_pbal = 0;
      g0_bal = 0;
      g0_gst_amt = 0;
      g0_freight = 0;
      g0_com_amt = 0;
      g0_net_amt = 0;

      return (
        <tr>
          <td colSpan={10} className="bg center">
              {transarray[index].PartyType}
          </td>
        </tr>
      )
    }
  }

  function G1HeaderRow({ index }) {
    if (isNewG1(index)) {
      g1_balance = 0;
      g1_pbal = 0;
      g1_bal = 0;
      g1_gst_amt = 0;
      g1_freight = 0;
      g1_com_amt = 0;
      g1_net_amt = 0;

      return (
        <tr>
          <td className="left bold" colspan={4}>
            <div className="bg">
              {transarray[index].PartyName}
            </div>
          </td>
        </tr>
      )
    }
  }

  function G2HeaderRow({ index }) {
    if (isNewG2(index)) {
      g2_pbal = 0;
      g2_bal = 0;
      g2_gst_amt = 0;
      g2_freight = 0;
      g2_com_amt = 0;
      g2_net_amt = 0;

      return (null)
    }
  }
  function DataRow({ data }) {

    g0_pbal += data.PQty || 0;
    g0_bal += data.Qty || 0;
    g0_gst_amt += data.GstAmt || 0;
    g0_freight += data.Freight || 0;
    g0_com_amt += data.ComAmt || 0;
    g0_net_amt += data.NetAmount || 0;

    g1_balance += data.Bal
    g1_pbal += data.PQty || 0;
    g1_bal += data.Qty || 0;
    g1_gst_amt += data.GstAmt || 0;
    g1_freight += data.Freight || 0;
    g1_com_amt += data.ComAmt || 0;
    g1_net_amt += data.NetAmount || 0;

    g2_pbal += data.PQty || 0;
    g2_bal += data.Qty || 0;
    g2_gst_amt += data.GstAmt || 0;
    g2_freight += data.Freight || 0;
    g2_com_amt += data.ComAmt || 0;
    g2_net_amt += data.NetAmount || 0;

    grand_pbal += data.PQty || 0;
    grand_bal += data.Qty || 0;
    grand_gst_amt += data.GstAmt || 0;
    grand_freight += data.Freight || 0;
    grand_com_amt += data.ComAmt || 0;
    grand_net_amt += data.NetAmount || 0;

    if (isSum) return null;

    return (
      <tr className="right normal">
        <td className="left">
          {data.VocNo} (<ConvertedDate date={data.Date} />)
        </td>
        <td>
          {data?.PartyName?.substring(0, 15)}...
        </td>
        <td className="center">
          <Currency value={g1_pbal} />
        </td>
        <td>
          <Currency value={g1_bal} />
        </td>
        <td>
          {((g1_net_amt - g1_gst_amt) / g1_bal).toFixed(2)}
        </td>
        <td>
          <Currency value={g1_gst_amt} />
        </td>
        <td>
          <Currency value={g1_freight} />
        </td>
        <td>
          <Currency value={g1_com_amt} />
        </td>
        <td>
          <Currency value={g1_net_amt} />
        </td>
        <td></td>
      </tr>
    )


  }

  function G0FooterRow({ index }) {
    if (isLastG0(index)) {
      return (
        <tr className="right bold" style={{borderBottom: "1px solid #000" }}>
          <td colSpan={2}>
            {transarray[index].PartyType} Total:
          </td>
          <td className="center">
            <Currency value={g0_pbal} />
          </td>
          <td>
            <Currency value={g0_bal} />
          </td>
          <td>
            {((g0_net_amt - g0_gst_amt) / g0_bal).toFixed(2)}

          </td>
          <td>
            <Currency value={g0_gst_amt} />
          </td>
          <td>
            <Currency value={g0_freight} />
          </td>
          <td>
            <Currency value={g0_com_amt} />
          </td>
          <td>
            <Currency value={g0_net_amt} />
          </td>
          <td>

          </td>
        </tr>
      )
    }
  }

  function G1FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr className="right bold" style={{ borderBottom: "1px solid #000" }}>
          <td colSpan={2} style={{ fontSize: "8px"}}>
            <span>{transarray[index].PartyName.substring(0, 30)} Total:</span>
          </td>
          <td className="center">
            <Currency value={g1_pbal} />
          </td>
          <td>
            <Currency value={g1_bal} />
          </td>
          <td>
            {((g1_net_amt - g1_gst_amt) / g1_bal).toFixed(2)}
          </td>
          <td>
            <Currency value={g1_gst_amt} />
          </td>
          <td>
            <Currency value={g1_freight} />
          </td>
          <td>
            <Currency value={g1_com_amt} />
          </td>
          <td>
            <Currency value={g1_net_amt} />
          </td>
          <td className="time right">
            <Currency value={g1_balance} />
          </td>
        </tr>
      )
    }
  }

  function G2FooterRow({ index }) {
    if (isLastG2(index)) {
      return (
        <tr className={`right ${isSum ? 'normal' :  'bold'}`}>
          <td colSpan={2}>
            {transarray[index].ProdName} Total:
          </td>
          <td className="center">
            <Currency value={g2_pbal} />
          </td>
          <td>
            <Currency value={g2_bal} />
          </td>
          <td>
            {((g2_net_amt - g2_gst_amt) / g2_bal).toFixed(2)}
          </td>
          <td>
            <Currency value={g2_gst_amt} />
          </td>
          <td>
            <Currency value={g2_freight} />
          </td>
          <td>
            <Currency value={g2_com_amt} />
          </td>
          <td>
            <Currency value={g2_net_amt} />
          </td>
          <td></td>
        </tr>
      )
    }
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) { //Last Row
      return (
        <tr className="right bold" style={{ borderBottom: "1px solid #000" }}>
          <td colSpan={2}>
            Grand Total:
          </td>
          <td className="center">
            <Currency value={grand_pbal} />
          </td>
          <td>
            <Currency value={grand_bal} />
          </td>
          <td>
            {((grand_net_amt - grand_gst_amt) / grand_bal).toFixed(2)}
          </td>
          <td>
            <Currency value={grand_gst_amt} />
          </td>
          <td>
            <Currency value={grand_freight} />
          </td>
          <td>
            <Currency value={grand_com_amt} />
          </td>
          <td>
            <Currency value={grand_net_amt} />
          </td>
          <td></td>
        </tr>
      )
    }
  }

  //#endregion Sub-Components

  //#region Utility Methods


  //#region Utility Methods
  function isNewG0(index) {
    return index === 0 || transarray[index].PartyTypeId !== transarray[index - 1].PartyTypeId
  }

  function isNewG1(index) {
    return index === 0 || transarray[index].PartyName !== transarray[index - 1].PartyName
  }

  function isNewG2(index) {
    return index === 0 || transarray[index].ProdName !== transarray[index - 1].ProdName || transarray[index].PartyName !== transarray[index - 1].PartyName
  }

  function isLastG0(index) {
    const lastIndex = transarray.length - 1;
    return index === lastIndex || transarray[index].PartyTypeId !== transarray[index + 1].PartyTypeId
  }

  function isLastG1(index) {
    const lastIndex = transarray.length - 1;
    return index === lastIndex || transarray[index].PartyName !== transarray[index + 1].PartyName
  }

  function isLastG2(index) {
    const lastIndex = transarray.length - 1;
    return index === lastIndex || transarray[index].ProdName !== transarray[index + 1].ProdName || transarray[index].PartyName !== transarray[index + 1].PartyName
  }
  //#endregion Utility Methods
}
