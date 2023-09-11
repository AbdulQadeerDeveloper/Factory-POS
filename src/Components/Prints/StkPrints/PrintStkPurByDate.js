import React from "react";
// import '../_shared/printmain.css'
import "../_shared/printmain.css";
import "../_shared/ReportGetNow";
import Currency from "../../Shared_Components/Currency";
import ConvertedDate from "../../Shared_Components/ConvertedDate";
import ReportGetNow from "../_shared/ReportGetNow";
import ReportHead from "../_shared/ReportHead";
import DateHead from "../_shared/DateHead";

export default function PrintStkPurByDate({
  parentobj,
  componentRef,
  transarray,
}) {
  //#region variables
  // g for group level
  let g1_pbal = 0;
  let g1_bal = 0;
  let g1_bal_amt = 0;
  let g1_net_amt = 0;

  let grand_pbal = 0;
  let grand_bal = 0;
  let grand_bal_amt = 0;
  let grand_net_amt = 0;
  //#endregion variables

  return (
    <div className="container newprint">
      <div ref={componentRef}>
        <ReportGetNow />
        <table cellSpacing="0">
          <thead>
            <ReportHead colspan={11} title="Purchase By Date" />
            <DateHead colspan={11} parentobj={parentobj} />
            <tr className="dark-border">
              <th style={{ width: "16%" }} className="bold left">
                PartyName
              </th>
              <th style={{ width: "5%" }} className="bold center">
                VocNo
              </th>
              <th style={{ width: "5%" }} className="bold center">
                DA.No/Inv.NO
              </th>
              <th style={{ width: "10%" }} className="bold center">
                Date
              </th>
              <th style={{ width: "17%" }} className="bold left">
                Prod Name
              </th>
              <th style={{ width: "8%" }} className="bold center">
                PQty
              </th>
              <th style={{ width: "6%" }} className="bold right">
                Qty
              </th>
              <th style={{ width: "7%" }} className="bold right">
                Rate
              </th>
              <th style={{ width: "8%" }} className="bold right">
                GST
              </th>
              <th style={{ width: "8%" }} className="bold right">
                Amount
              </th>
              <th style={{ width: "8%" }} className="bold right">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transarray?.length > 0 &&
              transarray.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <HeaderRow index={i} />
                    <DataRow data={data} />
                    <FooterRow index={i} />
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

  function HeaderRow({ index }) {
    if (isNewG1(index)) {
      g1_pbal = 0;
      g1_bal = 0;
      g1_bal_amt = 0;
      g1_net_amt = 0;

      return (
        <tr>
          <td colSpan={11} className="left">
            <span className="bg">
              {" "}
              <ConvertedDate date={transarray[index].Date} />{" "}
            </span>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_pbal += data.PQty || 0;
    g1_bal += data.Qty || 0;
    g1_bal_amt += data.GstAmt || 0;
    g1_net_amt += data.NetAmount || 0;

    grand_pbal += data.PQty || 0;
    grand_bal += data.Qty || 0;
    grand_bal_amt += data.GstAmt || 0;
    grand_net_amt += data.NetAmount || 0;

    return (
      <tr className="light-border normal">
        <td className="left">{data.PartyName}</td>
        <td className="center">{data.VocNo}</td>
        <td className="center">{data.BNo}</td>
        <td className="center">
          <ConvertedDate date={data.Date} />
        </td>
        <td className="left">{data.ProdName}</td>
        <td className="center">
          {data.PQty} {data.PUnit}
        </td>
        <td className="right">
          <Currency value={data.Qty} />
        </td>
        <td className="right">
          <Currency value={data.Rate} />
        </td>
        <td className="right">
          <Currency value={data.GstAmt} />
        </td>
        <td className="right">
          <Currency value={data.NetAmount} />
        </td>
        <td className="right time">
          <Currency value={data.Bal} />
        </td>
      </tr>
    );
  }

  function FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr className="dark-border">
          <td colSpan={5} className="right">
            <ConvertedDate date={transarray[index].Date} /> Total:
          </td>
          <td colSpan={1} className="center">
            <Currency value={g1_pbal} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={g1_bal} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={g1_bal !== 0 ? g1_net_amt / g1_bal : null} />
          </td>
          <td className="right">
            <Currency value={g1_bal_amt} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={g1_net_amt} />
          </td>
          <td></td>
        </tr>
      );
    }
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) {
      //Last Row
      return (
        <tr className="dark-border">
          <td colSpan={5} className="right">
            Grand Total:
          </td>
          <td colSpan={1} className="center">
            <Currency value={grand_pbal} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={grand_bal} />
          </td>
          <td colSpan={1} className="right">
            <Currency
              value={grand_bal !== 0 ? grand_net_amt / grand_bal : null}
            />
          </td>
          <td colSpan={1} className="right">
            <Currency value={grand_bal_amt} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={grand_net_amt} />
          </td>
          <td colSpan={1} className="right"></td>
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
      transarray[index].Date !== transarray[index + 1].Date
    );
  }

  function isNewG1(index) {
    return index === 0 || transarray[index].Date !== transarray[index - 1].Date;
  }
  //#endregion Utility Methods
}
