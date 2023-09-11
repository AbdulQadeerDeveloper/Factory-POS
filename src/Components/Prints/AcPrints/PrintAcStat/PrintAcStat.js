import React from "react";
import Currency from "../../../Shared_Components/Currency";
import "../../_shared/printmain.css";
import ReportGetNow from "../../_shared/ReportGetNow";
import DateHead from "../../_shared/DateHead";
import ReportHead from "../../_shared/ReportHead";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";

export default function PrintAcStat(props) {
  const { componentRef, parentobj, opening, tmparray, cpb_array } = props;

  let runningTotal = opening;
  let drTotal = 0,
    crTotal = 0;
  let svTotal = 0;
  let chqAmt = 0,
    recAmt = 0,
    balAmt = 0;

  function getDrOrCr(val) {
    return val < 0 ? "Cr" : "Dr";
  }

  return (
    <div>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <ReportGetNow />
            <table width="100%" cellPadding="1px" cellSpacing="0">
              <thead>
                <ReportHead title="Account Statement" colspan={9} />
                <DateHead parentobj={parentobj} colspan={9} />
                <tr>
                  <td colSpan="1" className="bold">
                    A/C Code:
                  </td>
                  <td colSpan="8" className="bold underline">
                    {parentobj.PartyId}
                  </td>
                </tr>
                <tr>
                  <td colSpan="1" className="bold">
                    A/C Title:
                  </td>
                  <td colSpan="8" className="bold underline">
                    {parentobj.PartyName}
                  </td>
                </tr>
                <tr className="dark-border center bg">
                  <td style={{ width: "10%" }}>Date</td>
                  <td style={{ width: "7%" }}>V.No</td>
                  <td style={{ width: "7%" }}>Type</td>
                  <td colSpan="3" className="left" style={{ width: "41%" }}>
                    Description
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    Debit
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    Credit
                  </td>
                  <td className="right" style={{ width: "13%" }}>
                    Balance
                  </td>
                </tr>
              </thead>
              <tr className="light-border right">
                <td colSpan="6" className="border">
                  Opening:
                </td>
                <td colSpan="3">
                  {<Currency value={Math.abs(opening)} />} {getDrOrCr(opening)}
                </td>
              </tr>
              {tmparray?.length > 0 ? (
                tmparray &&
                tmparray.map((data, i) => {
                  runningTotal += data.BAL;
                  data.NetDebit > 0
                    ? (drTotal += data.NetDebit)
                    : (crTotal += data.NetCredit); // running DrTotal, CrTotal
                  data.NetDebit > 0 &&
                    data.TType === "SV" &&
                    (svTotal += data.NetDebit);
                  data.NetCredit > 0 &&
                    data.TType === "SRV" &&
                    (svTotal -= data.NetCredit);
                  return (
                    <tr key={i} className="light-border normal center">
                      <td><ConvertedDate date={data.Date} /></td>
                      <td>{data.VocNo}</td>
                      <td>{data.TType}</td>
                      <td colSpan="3" className="left">
                        {data.Description}
                      </td>
                      <td className="right">
                        {data.NetDebit !== null ? (
                          <Currency value={data.NetDebit} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        {data.NetCredit !== null ? (
                          <Currency value={data.NetCredit} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        {Math.abs(runningTotal).toLocaleString()}{" "}
                        {getDrOrCr(runningTotal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="center" colSpan={9}>
                    Record Not Found
                  </td>
                </tr>
              )}
              <tr className="dark-border center bg">
                <td colSpan={3} className="left">
                  Sales-Return:{" "}
                  <span className="detail_field">
                    <Currency value={svTotal} />
                  </span>
                </td>
                <td className="border right" colSpan={3}>
                  Total:
                </td>
                <td className="border right">
                  <Currency value={drTotal} />
                </td>
                <td className="border right">
                  <Currency value={crTotal} />
                </td>
                <td className="border right">
                  <Currency value={Math.abs(runningTotal)} /> {getDrOrCr(runningTotal)}
                </td>
              </tr>
            </table>
            {cpb_array?.length > 0 && (
              <React.Fragment>
                <table cellPadding="2px" cellSpacing="0">
                  <tr>
                    <td colSpan="8" className="bold center underline">
                      Post Dated Cheques Detail
                    </td>
                  </tr>
                  <tr
                    className="dark-border center bg bold"
                    style={{ width: "70%" }}
                  >
                    <td className="center" style={{ width: "10%" }}>
                      CPB
                    </td>
                    <td className="center" style={{ width: "10%" }}>
                      ChqNo
                    </td>
                    <td className="center" style={{ width: "10%" }}>
                      ChqDate
                    </td>
                    <td className="center" style={{ width: "15%" }}>
                      Bank
                    </td>
                    <td className="right" style={{ width: "10%" }}>
                      Chq Amt
                    </td>
                    <td className="right" style={{ width: "10%" }}>
                      Rec Amt
                    </td>
                    <td className="right" style={{ width: "10%" }}>
                      Balance
                    </td>
                  </tr>
                  {cpb_array?.length > 0 ? (
                    cpb_array &&
                    cpb_array.map((data, i) => {
                      chqAmt += data.chqAmt || 0;
                      recAmt += data.recAmt || 0;
                      balAmt += data.BalAmt || 0;
                      return (
                        <tr key={i} className="light-border normal center">
                          <td className="center">{data.CPB}</td>
                          <td className="center">{data.ChqNo}</td>
                          <td className="center">
                            {ConvertedDate(data.ChqDate, false)}
                          </td>
                          <td className="center">{data.BankName}</td>
                          <td className="right">
                            <Currency value={data.ChqAmt} />
                          </td>
                          <td className="right">
                            <Currency value={data.RecAmt} />
                          </td>
                          <td className="right">
                            <Currency value={data.BalAmt} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="dark-border center bold">
                      <td colSpan={7}>Record Not Found</td>
                    </tr>
                  )}
                  <tr className="dark-border center bg bold">
                    <td colSpan="4" className="border bold right">
                      G.Total:
                    </td>
                    <td className="border bold right">
                      <Currency value={chqAmt} />
                    </td>
                    <td className="border bold right">
                      <Currency value={recAmt} />
                    </td>
                    <td className="border bold right">
                      <Currency value={balAmt} />
                    </td>
                  </tr>
                  <tr className="dark-border bold right">
                    <td colSpan={6}>
                      Total Balance Including Post Dated Cheque(s)/Parchi(s):
                    </td>
                    <td>
                      <Currency value={balAmt + runningTotal} />
                    </td>
                  </tr>
                </table>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
