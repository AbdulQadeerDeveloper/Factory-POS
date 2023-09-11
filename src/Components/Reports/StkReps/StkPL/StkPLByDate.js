import React from "react";
import Currency from "../../../Shared_Components/Currency";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import { Link } from "react-router-dom";

export default function StkPLByDate(props) {
  const { transarray } = props;

  //#region variables
  // g for group level
  let g1_pbal = 0;
  let g1_sal_amt = 0;
  let g1_cost_amt = 0;
  let g1_pl_amt = 0;

  let grand_pbal = 0;
  let grand_sal_amt = 0;
  let grand_cost_amt = 0;
  let grand_pl_amt = 0;
  //#endregion variables

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "12px" }}>
              <th className="bg-color col-xs-3 text-left">PartyName</th>
              <th className="bg-color col-xs-1 text-center">VocNo</th>
              <th className="bg-color col-xs-1 text-center">Inv.Date</th>
              <th className="bg-color col-xs-2 text-left">Prod Name</th>
              <th className="bg-color col-xs-1 text-center">Sal.Qty</th>
              <th className="bg-color col-xs-1 text-right">Sal.Amt</th>
              <th className="bg-color col-xs-1 text-right">Cost.Amt</th>
              <th className="bg-color col-xs-1 text-right">PL.Amt</th>
              <th className="bg-color col-xs-1 text-right">Cost.Rate</th>
              <th className="bg-color col-xs-1 text-right">PL %</th>
            </tr>
          </thead>
          <tbody>
            {transarray.length > 0 ? (
              transarray.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <HeaderRow index={i} />
                    <DataRow data={data} />
                    <FooterRow index={i} />
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

  function HeaderRow({ index }) {
    if (isNewG1(index)) {
      g1_pbal = 0;
      g1_sal_amt = 0;
      g1_cost_amt = 0;
      g1_pl_amt = 0;

      return (
        <tr>
          <td colSpan={12} style={{ textAlign: "center" }}>
            <div
              style={{
                background: "lightgrey",
                color: "#000",
                width: "300px",
                padding: "5px 0",
                textTransform: "uppercase",
                margin: "0 auto",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {transarray[index].Date.slice(0, 10)}
            </div>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_pbal += data.PQty || 0;
    g1_sal_amt += data.SalAmt || 0;
    g1_cost_amt += data.CostAmt || 0;
    g1_pl_amt += data.PLAmt || 0;

    grand_pbal += data.PQty || 0;
    grand_sal_amt += data.SalAmt || 0;
    grand_cost_amt += data.CostAmt || 0;
    grand_pl_amt += data.PLAmt || 0;

    return (
      <tr className="entry_row statement_row">
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.PartyName}</span>
        </td>
        <td style={{ textAlign: "center", maxWidth: "30" }}>
          <span style={{ color: "#036", textTransform: "uppercase" }}>
            {data.TType === 2 ? (
              <Link to={`/sv/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === 4 ? (
              <Link to={`/prv/${data.VocNo}`}>PR-{data.VocNo}</Link>
            ) : (
              ""
            )}
          </span>
        </td>
        <td style={{ textAlign: "center " }}>
          <span
            style={{ borderRadius: "2px", textAlign: "right", color: "#036" }}
          >
            <ConvertedDate date={data.Date} />
          </span>
        </td>
        <td style={{ textAlign: "left" }}>
          <span style={{ color: "#036" }}>{data.ProdName}</span>
        </td>
        <td style={{ textAlign: "center", maxWidth: "30" }}>
          <span style={{ color: "#036", textTransform: "uppercase" }}>
            {data.PQty} {data.PUnit}
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ color: "#036" }}>
            <Currency value={data.SalAmt} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.CostAmt} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.PLAmt} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency value={data.InRate} />/<Currency value={data.OutRate} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span style={{ borderRadius: "2px", color: "#036" }}>
            <Currency
              value={
                data.CostAmt > 0
                  ? ((data.PLAmt / data.CostAmt) * 100).toFixed(2)
                  : 0
              }
            />
            %
          </span>
        </td>
      </tr>
    );
  }

  function FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr style={{ backgroundColor: "lightgrey" }}>
          <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
            {transarray[index].Date.slice(0, 10)} Total:
          </td>
          <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            <Currency value={g1_pbal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_sal_amt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_cost_amt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_pl_amt} />
          </td>
          <td
            colSpan={1}
            style={{ textAlign: "right", fontWeight: "bold" }}
          ></td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency
              value={
                g1_cost_amt > 0
                  ? ((g1_pl_amt / g1_cost_amt) * 100).toFixed(2)
                  : 0
              }
            />
            %
          </td>
        </tr>
      );
    }
  }

  function GrandRow({ index }) {
    if (index === transarray.length - 1) {
      //Last Row
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
            Grand Total:
          </td>
          <td colSpan={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            <Currency value={grand_pbal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_sal_amt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_cost_amt} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_pl_amt} />
          </td>
          <td
            colSpan={1}
            style={{ textAlign: "right", fontWeight: "bold" }}
          ></td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency
              value={
                grand_cost_amt > 0
                  ? ((grand_pl_amt / grand_cost_amt) * 100).toFixed(2)
                  : 0
              }
            />
            %
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
      transarray[index].Date !== transarray[index + 1].Date
    );
  }

  function isNewG1(index) {
    return index === 0 || transarray[index].Date !== transarray[index - 1].Date;
  }
  //#endregion Utility Methods
}
