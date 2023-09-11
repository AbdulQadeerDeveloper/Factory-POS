import React from "react";
// import '../_shared/printmain.css'
import "../_shared/printmain.css";
import "../_shared/ReportGetNow";
import Currency from "../../Shared_Components/Currency";
import ConvertedDate from "../../Shared_Components/ConvertedDate";
import ReportGetNow from "../_shared/ReportGetNow";
import ReportHead from "../_shared/ReportHead";
import DateHead from "../_shared/DateHead";

export default function PrintRecables({ parentobj, componentRef, transarray }) {
  //#region variables
  // g for group level
  let g1_op_bal = 0;
  let g1_op_cpb = 0;
  let g1_cur_dr = 0;
  let g1_cur_cr = 0;
  let g1_cl_bal = 0;
  let g1_cl_cpb = 0;

  let grand_op_bal = 0;
  let grand_op_cpb = 0;
  let grand_cur_dr = 0;
  let grand_cur_cr = 0;
  let grand_cl_bal = 0;
  let grand_cl_cpb = 0;

  //#endregion variables

  return (
    <div className="container newprint">
      <div ref={componentRef} style={{ width: "100%" }}>
        <ReportGetNow />
        <table cellSpacing="0" style={{ fontSize: "11px" }}>
          <thead>
            <ReportHead colspan={11} title="Receivables" />
            <DateHead colspan={11} parentobj={parentobj} />
            <tr className="dark-border bold">
              <th style={{ width: "8%" }} className="center">
                A/C Code
              </th>
              <th style={{ width: "25%" }} className="left">
                A/C Title
              </th>
              <th style={{ width: "10%" }} className="right">
                CrLimit
              </th>
              <th style={{ width: "10%" }} className="right">
                Op.Bal+CPB
              </th>
              <th style={{ width: "10%" }} className="right">
                L.Bill
              </th>
              <th style={{ width: "15%" }} className="right">
                Cur Dr
              </th>
              <th style={{ width: "10%" }} className="right">
                L.Pay
              </th>
              <th style={{ width: "15%" }} className="right">
                Cur Cr
              </th>
              <th style={{ width: "15%" }} className="right">
                Cl.Bal+CPB
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
      g1_op_bal = 0;
      g1_op_cpb = 0;
      g1_cur_dr = 0;
      g1_cur_cr = 0;
      g1_cl_bal = 0;
      g1_cl_cpb = 0;

      return (
        <tr>
          <td colSpan={11} className="center bold">
            <span className="bg head"> {transarray[index].PartyType}</span>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_op_bal += data.OpBal || 0;
    g1_op_cpb += data.OpCPB || 0;
    g1_cur_dr += data.CurDr || 0;
    g1_cur_cr += data.CurCr || 0;
    g1_cl_bal += data.ClBal || 0;
    g1_cl_cpb += data.ClCPB || 0;

    grand_op_bal += data.OpBal || 0;
    grand_op_cpb += data.OpCPB || 0;
    grand_cur_dr += data.CurDr || 0;
    grand_cur_cr += data.CurCr || 0;
    grand_cl_bal += data.ClBal || 0;
    grand_cl_cpb += data.ClCPB || 0;

    return (
      <tr className="light-border normal">
        <td className="center">{data.PartyId}</td>
        <td className="left">{data.PartyName}</td>
        <td className="right">
          <Currency value={data.CrLimit} />
        </td>
        <td className="right">
          <Currency value={data.OpBal} />
          <br />
          +<Currency value={data.OpCPB || 0} />
          <br />
          =<Currency value={data.OpBal + data.OpCPB} />
        </td>
        <td className="right time">
          <ConvertedDate date={data.LastBillDt} />
          <br />
          <Currency value={data.LastBillAmt} />
        </td>
        <td>
          <Currency value={data.CurDr} />
        </td>
        <td className="right time">
          <ConvertedDate date={data.LastPayDt} />
          <br />
          <Currency value={data.LastPayAmt} />
        </td>
        <td>
          <Currency value={data.CurCr} />
        </td>
        <td className="right">
          <Currency value={data.ClBal} />
          <br />
          +<Currency value={data.ClCPB || 0} />
          <br />
          =<Currency value={data.ClBal + data.ClCPB} />
        </td>
      </tr>
    );
  }

  function FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr className="dark-border bold">
          <td colSpan={3} className="right">
            {transarray[index].PartyType} Total:
          </td>
          <td colSpan={1} className="right">
            <Currency value={g1_op_bal} />
            <br />
            +<Currency value={g1_op_cpb} />
            <br />
            =<Currency value={g1_op_bal + g1_op_cpb} />
          </td>
          <td></td>
          <td className="right">
            <Currency value={g1_cur_dr} />
          </td>
          <td></td>
          <td className="right">
            <Currency value={g1_cur_cr} />
          </td>
          <td className="right">
            <Currency value={g1_cl_bal} />
            <br />
            +<Currency value={g1_cl_cpb} />
            <br />
            =<Currency value={g1_cl_bal + g1_cl_cpb} />
          </td>
        </tr>
      );
    }
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) {
      //Last Row
      return (
        <tr className="dark-border bold">
          <td colSpan={3} className="right">
            Grand Total:
          </td>
          <td colSpan={1} className="right">
            <Currency value={grand_op_bal} />
            <br />
            +<Currency value={grand_op_cpb} />
            <br />
            =<Currency value={grand_op_bal + grand_op_cpb} />
          </td>
          <td></td>
          <td colSpan={1} className="right">
            <Currency value={grand_cur_dr} />
          </td>
          <td></td>
          <td colSpan={1} className="right">
            <Currency value={grand_cur_cr} />
          </td>
          <td colSpan={1} className="right">
            <Currency value={grand_cl_bal} />
            <br />
            +<Currency value={grand_cl_cpb} />
            <br />
            =<Currency value={grand_cl_bal + grand_cl_cpb} />
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
    return index === 0 || transarray[index].PartyTypeId !== transarray[index - 1].PartyTypeId;
  }
  //#endregion Utility Methods
}
