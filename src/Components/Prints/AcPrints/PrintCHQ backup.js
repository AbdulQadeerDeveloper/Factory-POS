import React from "react";
import "../_shared/printmain.css";
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
            <table className="cheque_table table table-bordered">
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
                            fontWeight: "normal",
                            marginTop: "10px",
                            background: "",
                          }}
                        >
                          Report run at: {GetNow()}
                        </div>
                        <div className="cheque_left">
                          <div className="party_label table_labels">Party:</div>
                          <div className="party_name table_th">
                            {parentobj.PartyName}
                          </div>
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
                        <div className="cheque_voucher_heading table_th">
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
                <tr className="cheque_heading_row bold">
                  <th className="text-center cheque_srno" rowSpan={2}>
                    SrNo
                  </th>
                  <th className="text-center cheque_cpb" rowSpan={2}>
                    CPB#
                  </th>
                  <th className="text-center cheque_chqno" rowSpan={2}>
                    ChqNo
                  </th>
                  <th className="text-center cheque_bank" rowSpan={2}>
                    Bank
                  </th>
                  <th className="text-center cheque_dated" rowSpan={2}>
                    Dated
                  </th>
                  <th className="text-center issueto" rowSpan={2}>
                    Issue To
                  </th>
                  <th className="text-center cheque_amount">Amount</th>
                </tr>
                <tr className="cheque_heading_row">
                  <th className="text-center table_th">Rs.</th>
                </tr>
                {/* <div className='clearfix'></div> */}
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
                  <td colSpan={6} className="text-right table_th">
                    <b>Total Receipt: </b>&nbsp;{" "}
                  </td>
                  <td className="text-right table_th">
                    <b>
                      <Currency value={total2} />
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center table_th">PREPARED BY</th>
                  <th className="text-center table_th">CHECKED BY</th>
                  <th className="text-center table_th">APPROVED BY</th>
                  <th className="text-center table_th">RECEIVED BY</th>
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
