import React from "react";
import Currency from "../../Shared_Components/Currency";
import GetNow from "../../Shared_Components/GetNow";
import GetFormatedDate from "../../Shared_Components/GetFormatedDate";
import StatusField from "../../Forms/_Shared/StatusField";
// import { useReactToPrint } from 'react-to-print';

export default function LegPrint(props) {
  const { componentRef, parentobj, transarray } = props;
  let drTotal2 = 0;
  let crTotal2 = 0;

  return (
    <div>
      <style>{`
            /* journal voucher */
            table.journal_table{
              margin-top: 50px !important;
            }
            div.journal_table div.print_date{
              font-weight: 400 !important;
            }
            div.account_head_main{
              width: 100% !important;
            }
            td.srno{
              width: 5% !important;
              text-align: center;
            }
            td.acccode{
              width: 30% !important;
              text-align: center;
            }
            div.account_head_main div.party{
              width: 98% !important;
              margin: 0 auto !important;
              /* background: red !important; */
              text-align: justify !important;
              font-weight: bold !important;
            }
            div.account_head_main div.desc{
              width: 94% !important;
              margin: 0 auto !important;
              /* background: orange !important; */
              text-align: justify !important;
            }
            th.cheque_accode{
              width: 80px !important;
              text-align: center;
            }
            th.cheque_debit, th.cheque_credit{
              width: 138px !important;
            }
            th.cheque_cpbno{
              width: 60px !important;
            }
            tr.cheque_transaction_row td.debit_credit{
              text-align: right !important;
            }
            /* journal voucher */
            `}</style>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <table className="journal_table table table-bordered">
              <thead>
                <tr className="heading_row">
                  <th
                    className="text-center cheque_main_th"
                    colSpan={7}
                    rowSpan={3}
                    style={{ verticalAlign: "top" }}
                  >
                    <div className="top_main_class">
                      <div className="cheque_main">
                        <div
                          className="print_date"
                          style={{
                            textAlign: "left",
                            fontWeight: "normal",
                            marginTop: "10px",
                            background: "",
                          }}
                        >
                          Report run at: {GetNow()}
                        </div>
                        <div className="cheque_left">
                          <div className="party_label"></div>
                          <div className="party_name"></div>
                        </div>
                        <div className="cheque_right">
                          <StatusField Status={parentobj.Status} />
                        </div>
                        <div className="clearfix"></div>
                      </div>
                      {/* right side */}
                      <div className="cheque_info">
                        <div className="cheque_voucher_heading table_th">
                          {parentobj.TType.toUpperCase()} Voucher
                        </div>
                        <div className="cheque_voucher_date table_labels">
                          Date: {GetFormatedDate(parentobj.Date)}
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
                <tr className="cheque_heading_row">
                  <th
                    className="text-center cheque_accode table_th"
                    rowSpan={2}
                  >
                    Sr#
                  </th>
                  <th
                    className="text-center cheque_accode table_th"
                    rowSpan={2}
                  >
                    Code
                  </th>
                  <th
                    className="text-center cheque_heading_row table_th"
                    rowSpan={2}
                  >
                    Head Of A/C
                  </th>
                  <th className="text-center cheque_cpbno table_th" rowSpan={2}>
                    CPB
                  </th>
                  <th className="headFont text-center cheque_debit table_th">
                    Debit
                  </th>
                  <th className="text-center cheque_credit table_th">Credit</th>
                </tr>
                <tr className="cheque_heading_row">
                  <th className="text-center cheque_debit table_th">Rs.</th>
                  <th className="text-center cheque_credit table_th">Rs.</th>
                </tr>
                {/* <div className='clearfix'></div> */}
                {transarray &&
                  transarray.map((data, index) => {
                    data.IsDeleted === 0 && data.NetDebit > 0
                      ? (drTotal2 += data.NetDebit)
                      : (crTotal2 += data.NetCredit); // running DrTotal, CrTotal
                    return (
                      data.IsDeleted === 0 && (
                        <tr key={index} className="account_head_main">
                          <td className="srno table_td">{data.SrNo}</td>
                          <td className="srno table_td">{data.PartyId}</td>
                          <td>
                            <div className="account_head_main">
                              <div className="party table_td">
                                {data.PartyName}
                              </div>
                              <div className="desc table_td">
                                {data.Description}
                              </div>
                            </div>
                          </td>
                          <td>{data.CPB}</td>
                          <td className="debit_credit table_td">
                            {data.NetDebit !== null ? (
                              <Currency value={data.NetDebit} />
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="debit_credit table_td">
                            {data.NetCredit !== null ? (
                              <Currency value={data.NetCredit} />
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      )
                    );
                  })}
                <tr className="cheque_total_row">
                  <td colSpan={4} className="text-right table_th">
                    <b>Total: </b>&nbsp;{" "}
                  </td>
                  <td className="text-right table_td">
                    <b>
                      <Currency value={drTotal2} />
                    </b>
                  </td>
                  <td className="text-right table_td">
                    <b>
                      <Currency value={crTotal2} />
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <table className="table table-bordered cheque_heading_row">
              <thead>
                <tr>
                  <th className="text-center">Prepared By</th>
                  <th className="text-center">Checked By</th>
                  <th className="text-center">Approved By</th>
                  <th className="text-center">Received By</th>
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
