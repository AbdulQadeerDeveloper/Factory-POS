import React from "react";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";
import { Link } from "react-router-dom";

export default function DailyRegTran(props) {
  const { transarray } = props;

  //#region variables
  // g for group level
  let g1_Dr = 0;
  let g1_Cr = 0;
  let grand_Dr = 0;
  let grand_Cr = 0;
  //#endregion variables

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <div className="reports_prints_headers">
          <div className="timesroman">Report Run At: 21-Nov-22 4:15 PM</div>
          <div>
            <div className="reports_heading_left">
              <span className="reports_title">Daily Transactions</span>
            </div>
            <div className="reports_heading_right">
              <span className="reports_from_to_date">
                From: 20-11-22 To: 20-11-22
              </span>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="bg-color text-center col-xs-1 table_th">Type</th>
              <th className="bg-color text-center col-xs-1 table_th">VocNo</th>
              <th className="bg-color text-center col-xs-1 table_th">Date</th>
              <th className="bg-color text-center col-xs-1 table_th">Code</th>
              <th className="bg-color text-left col-xs-6 table_th">
                Description
              </th>
              <th className="bg-color col-xs-1 text-right table_th">Debit</th>
              <th className="bg-color col-xs-1 text-right table_th">Credit</th>
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
                <td colSpan="8" style={{ textAlign: "center" }}>
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
    if (isNewTType(index)) {
      g1_Dr = 0;
      g1_Cr = 0;

      return (
        <tr>
          <td colSpan={7} style={{ textAlign: "center" }}>
            <div className="reports_top_heading">{transarray[index].TType}</div>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_Dr += data.NetDebit || 0;
    g1_Cr += data.NetCredit || 0;
    grand_Dr += data.NetDebit || 0;
    grand_Cr += data.NetCredit || 0;

    return (
      <tr className="entry_row statement_row">
        <td style={{ textAlign: "center" }}>
          <span className="table_td">{data.TType}</span>
        </td>
        <td className="table_td" style={{ textAlign: "center" }}>
          <span className="table_td">
            {data.TType === "CHQ" ? (
              <Link to={`/cpb/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === "SV" ? (
              <Link to={`/sv/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === "PV" ? (
              <Link to={`/pv/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === "SRV" ? (
              <Link to={`/srv/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === "PRV" ? (
              <Link to={`/prv/${data.VocNo}`}>{data.VocNo}</Link>
            ) : (
              ""
            )}
            {data.TType === "JV" ||
            data.TType === "BR" ||
            data.TType === "BP" ||
            data.TType === "CR" ||
            data.TType === "CP" ? (
              <Link to={`/${data.TType.toLowerCase()}/${data.VocNo}`}>
                {data.VocNo}
              </Link>
            ) : (
              ""
            )}
          </span>
        </td>
        <td style={{ textAlign: "center" }}>
          <span className="table_td">
            <ConvertedDate date={data.Date} />
          </span>
        </td>
        <td style={{ textAlign: "center" }}>
          <span className="table_td">{data.PartyID}</span>
        </td>
        <td style={{ textAlign: "left" }}>
          <div className="table_labels">{data.PartyName}</div>
          <div className="table_td">{data.Description}</div>
        </td>
        <td style={{ textAlign: "right" }}>
          <span className="table_td">
            <Currency value={data.NetDebit} />
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          <span className="table_td">
            <Currency value={data.NetCredit} />
          </span>
        </td>
      </tr>
    );
  }
  function FooterRow({ index }) {
    if (isLastTType(index)) {
      return (
        <tr>
          <td
            colSpan={5}
            className="table_labels"
            style={{ textAlign: "right", fontWeight: "bold" }}
          >
            Total:
          </td>
          <td
            colSpan={1}
            className="table_labels"
            style={{ textAlign: "right" }}
          >
            <Currency value={g1_Dr} />
          </td>
          <td
            colSpan={1}
            className="table_labels"
            style={{ textAlign: "right" }}
          >
            <Currency value={g1_Cr} />
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
          <td
            colSpan={5}
            className="table_labels"
            style={{ textAlign: "right" }}
          >
            Grand Total:
          </td>
          <td
            colSpan={1}
            className="table_labels"
            style={{ textAlign: "right" }}
          >
            <Currency value={grand_Dr} />
          </td>
          <td
            colSpan={1}
            className="table_labels"
            style={{ textAlign: "right" }}
          >
            <Currency value={grand_Cr} />
          </td>
        </tr>
      );
    }
  }

  //#endregion Sub-Components

  //#region Utility Methods

  function isLastTType(index) {
    const lastIndex = transarray.length - 1;
    return (
      index === lastIndex ||
      transarray[index].TType !== transarray[index + 1].TType
    );
  }

  function isNewTType(index) {
    return (
      index === 0 || transarray[index].TType !== transarray[index - 1].TType
    );
  }
  //#endregion Utility Methods
}
