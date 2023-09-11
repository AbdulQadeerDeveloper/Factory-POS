import React from "react";
import Currency from "../../../Shared_Components/Currency";
import "../../_shared/printmain.css";
import ReportGetNow from "../../_shared/ReportGetNow";
import DateHead from "../../_shared/DateHead";
import ReportHead from "../../_shared/ReportHead";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";

export default function PrintStkLevel(props) {
  const { componentRef, parentobj, tmparray } = props;

  let g1_pbal_qty = 0;
  let g1_bal_qty = 0;
  return (
    <div>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef} style={{fontSize: '12px'}}>
            <ReportGetNow />
            <table width="100%" cellPadding="1px" cellSpacing="0">
              <thead>
                <ReportHead title="Stock Level" colspan={12} />
                <DateHead parentobj={parentobj} colspan={12} />
                <tr className="dark-border center bg">
                  <td style={{ width: "10%" }}>Product Code</td>
                  <td colSpan="3" className="left" style={{ width: "41%" }}>
                    Product Name
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    P Balance
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    Balance
                  </td>
                </tr>
              </thead>
              {tmparray?.length > 0 ? (
                tmparray &&
                tmparray.map((data, i) => {
                  g1_pbal_qty += data.PBal || 0;
                  g1_bal_qty += data.Bal || 0;
                  return (
                    <tr key={i} className="light-border normal center">
                      <td>{data.ProductId}</td>
                      <td colSpan="3" className="left" style={{fontSize: '9px !important'}}>
                        {data.ProdName}
                      </td>
                      <td className="right">
                          <Currency value={data.PBal} />
                      </td>
                      <td className="right">
                        <Currency value={data.Bal} />
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
                <td className="border right" colSpan={4}>
                  Total:
                </td>
                <td className="border right">
                  <Currency value={g1_pbal_qty} />
                </td>
                <td className="border right">
                  <Currency value={g1_bal_qty} />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
