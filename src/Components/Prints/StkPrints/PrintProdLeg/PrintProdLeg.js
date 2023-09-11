import React from "react";
import Currency from "../../../Shared_Components/Currency";
import "../../_shared/printmain.css";
import ReportGetNow from "../../_shared/ReportGetNow";
import DateHead from "../../_shared/DateHead";
import ReportHead from "../../_shared/ReportHead";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";

export default function PrintStkLevel(props) {
  const { componentRef, parentobj, opQty, opAmt, tmparray } = props;

  let runningBalQty = opQty;
  let runningBalAmt = opAmt;
  let inQtyTotal = 0, outQtyTotal = 0;
  let inAmtTotal = 0, outAmtTotal = 0;
  let svTotal;
  return (
    <div>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef} style={{fontSize: '12px'}}>
            <ReportGetNow />
            <table width="100%" cellPadding="1px" cellSpacing="0">
              <thead>
                <ReportHead title="Product Ledger" colspan={12} />
                <DateHead parentobj={parentobj} colspan={12} />
                <tr>
                  <td colSpan="2" className="bold">
                    Product Code:
                  </td>
                  <td colSpan="8" className="bold underline">
                    {parentobj.ProductId}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="bold">
                    Product Name:
                  </td>
                  <td colSpan="8" className="bold underline">
                    {parentobj.ProdName}
                  </td>
                </tr>
                <tr className="dark-border center bg">
                  <td style={{ width: "10%" }}>Date</td>
                  <td style={{ width: "7%" }}>T/VNo</td>
                  <td colSpan="3" className="left" style={{ width: "41%" }}>
                    Description
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    InQty
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    OutQty
                  </td>
                  <td className="right" style={{ width: "13%" }}>
                    BalQty
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    Rate
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    InAmt
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    OutAmt
                  </td>
                  <td className="right" style={{ width: "13%" }}>
                    BalAmt
                  </td>
                </tr>
              </thead>
              <tr className="light-border right">
                <td colSpan="5" className="border">
                  Opening:
                </td>
                <td colSpan="3">
                  {<Currency value={opQty} />}
                </td>
                <td colSpan="4">
                  {<Currency value={opAmt} />}
                </td>
              </tr>
              {tmparray?.length > 0 ? (
                tmparray &&
                tmparray.map((data, i) => {
                  runningBalQty += data.BalQty;
                  runningBalAmt += data.BalAmt;
                  data.InQty > 0
                    ? (inQtyTotal += data.InQty)
                    : (outQtyTotal += data.OutQty); // running inQtyTotal, outQtyTotal
                  data.InAmt > 0
                    ? (inAmtTotal += data.InAmt)
                    : (outAmtTotal += data.OutAmt); // running inQtyTotal, outQtyTotal
                  data.InQty > 0 &&
                    data.TType === "SV" &&
                    (svTotal += data.InQty);
                  data.OutQty > 0 &&
                    data.TType === "SRV" &&
                    (svTotal -= data.OutQty);
                  return (
                    <tr key={i} className="light-border normal center">
                      <td><ConvertedDate date={data.Date} /></td>
                      <td>{data.TType}/{data.VocNo}</td>
                      <td colSpan="3" className="left" style={{fontSize: '9px !important'}}>
                        {data.Description}
                      </td>
                      <td className="right">
                        {data.InQty !== null ? (
                          <Currency value={data.InQty} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        {data.OutQty !== null ? (
                          <Currency value={data.OutQty} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        <Currency value={runningBalQty} />
                      </td>
                      <td>{data.Rate >0 ? data.Rate : (data.CRate + '/' + data.SRate)}</td>
                      <td className="right">
                        {data.InAmt !== null ? (
                          <Currency value={data.InAmt} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        {data.OutAmt !== null ? (
                          <Currency value={data.OutAmt} />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="right">
                        <Currency value={runningBalAmt} />
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
                <td className="border right" colSpan={5}>
                  Total:
                </td>
                <td className="border right">
                  <Currency value={inQtyTotal} />
                </td>
                <td className="border right">
                  <Currency value={outQtyTotal} />
                </td>
                <td className="border right">
                  <Currency value={runningBalQty} />
                </td>
                <td>
                </td>
                <td className="border right">
                  <Currency value={inAmtTotal} />
                </td>
                <td className="border right">
                  <Currency value={outAmtTotal} />
                </td>
                <td className="border right">
                  <Currency value={runningBalAmt} />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
