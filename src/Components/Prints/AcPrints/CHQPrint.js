import React from "react";
import "../_shared/printmain.css";
import "../_shared/screenmain.css";
import GetNow from "../../Shared_Components/GetNow";
import ConvertedDate from "../../Shared_Components/ConvertedDate";
import Currency from "../../Shared_Components/Currency";
import StatusField from "../../Forms/_Shared/StatusField";

export default function CHQPrint(props) {
  const { componentRef, parentobj, transarray } = props;
  let total2 = 0;
  let tmptotal2 = 0;

  return (
    <div>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <table className="table dark-border">
              <thead>
                <tr className="heading_row">
                  <th
                    className="center"
                    colSpan={7}
                    rowSpan={3}
                    style={{ verticalAlign: "top" }}
                  >
                    <div className="top_main_class">
                      <div className="cheque_main">
                        <div className="time">
                          Report run at: {GetNow()}
                        </div>
                        <div className="left bold">
                            Party: <div className="normal underline">{parentobj.PartyName}</div>
                        </div>
                        <div className="cheque_right">
                          <div className="status_main">
                            <StatusField Status={parentobj.Status} />
                            <div className="clearfix"></div>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                      {/* right side */}
                      <div className="cheque_info">
                        <div className="cheque_voucher_heading bold">
                          Cheque Voucher
                        </div>
                        <div className="cheque_voucher_date table_labels">
                          Date: <ConvertedDate value={parentobj.Date} />
                        </div>
                        <div className="cheque_voucher_no table_labels">
                          Voucher: {parentobj.VocNo}
                        </div>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bold">
                  <th className="center" style={{width: "5%"}}>
                    SrNo
                  </th>
                  <th className="center cheque_cpb">
                    CPB#
                  </th>
                  <th className="center cheque_chqno">
                    ChqNo
                  </th>
                  <th className="center cheque_bank">
                    Bank
                  </th>
                  <th className="center cheque_dated">
                    Dated
                  </th>
                  <th className="center issueto">
                    Issue To
                  </th>
                  <th className="right" style={{width: "15%"}}>Amount</th>
                </tr>
                {transarray &&
                  transarray.map((data, index) => {
                    data.isDeleted === 0 && data.NetCredit > 0
                      ? (total2 += data.NetCredit)
                      : (tmptotal2 += data.NetCredit); // running Total
                    return (
                      data.isDeleted === 0 && (
                        <tr key={index} className="cheque_transaction_row">
                          <td className="table_td">{data.SrNo}</td>
                          <td className="table_td">{data.CPB}</td>
                          <td className="table_td">{data.CHQNo}</td>
                          <td className="table_td">{data.BankName}</td>
                          <td className="table_td">
                            {ConvertedDate(data.Dated, false)}
                          </td>
                          <td className="table_td">{data.IssueToName}</td>
                          <td className="table_td">
                            <Currency value={data.NetCredit} />
                          </td>
                        </tr>
                      )
                    );
                  })}
                <tr className="cheque_total_row">
                  <td colSpan={6} className="text-right bold">
                    <b>Total Receipt: </b>&nbsp;{" "}
                  </td>
                  <td className="text-right bold">
                    <b>
                      <Currency value={total2} />
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="table dark-border">
              <thead>
                <tr>
                  <th className="center bold">Prepared By</th>
                  <th className="center bold">Checked By</th>
                  <th className="center bold">Approved By</th>
                  <th className="center bold">Received By</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bottom_rows">
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div style={{width: "80%", margin: "0 auto"}}>
                <button onClick={handlePrint}>Print</button>
            </div> */}
    </div>
  );
}
