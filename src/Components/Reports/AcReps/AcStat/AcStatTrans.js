import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";

const AcStatTrans = (props) => {
  // destructuring
  const { tmparray, opening } = props;

  let runningTotal = opening;
  let drTotal = 0;
  let crTotal = 0;

  function getDrOrCr(val) {
    return val < 0 ? "Cr" : "Dr";
  }

  function NewWindowOpen(ttype, vNo) {
    let url = `${ttype.toLowerCase()}/${vNo}`;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr className="acstat_th_statement" style={{ fontSize: "12px" }}>
              <th
                colSpan={2}
                className="bg-color text-center col-xs-1"
                style={{ verticalAlign: "middle" }}
              >
                VocNo
              </th>
              <th className="bg-color text-center col-xs-1">Date</th>
              <th className="bg-color text-left col-xs-5">Description</th>
              <th className="bg-color col-xs-1 text-center">Debit</th>
              <th className="bg-color col-xs-1 text-center">Credit</th>
              <th className="bg-color col-xs-2 text-center">Balance</th>
            </tr>
          </thead>
          <tbody id="d">
            <tr style={{ backgroundColor: "#f8f8f8", height: "30px" }}>
              <td colSpan="4" style={{ textAlign: "right" }}>
                Opening Balance:
              </td>
              <td
                colSpan="3"
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {Math.abs(opening).toLocaleString()} {getDrOrCr(opening)} */}
                {<Currency value={Math.abs(opening)} />} {getDrOrCr(opening)}
              </td>
            </tr>
            {tmparray &&
              tmparray.map((data, i) => {
                runningTotal += data.BAL;

                data.NetDebit > 0
                  ? (drTotal += data.NetDebit)
                  : (crTotal += data.NetCredit); // running DrTotal, CrTotal

                return (
                  <tr key={i} className="entry_row statement_row">
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          borderRadius: "2px",
                          textAlign: "right",
                          color: "#036",
                        }}
                      >
                        {data.TType}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        onClick={(e) => NewWindowOpen(data.TType, data.VocNo)}
                        style={{
                          borderRadius: "2px",
                          textAlign: "right",
                          color: "#036",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {data.VocNo}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          borderRadius: "2px",
                          textAlign: "center",
                          color: "#036",
                        }}
                      >
                        <ConvertedDate date={data.Date} />
                      </span>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <span
                        style={{
                          borderRadius: "2px",
                          textAlign: "left",
                          color: "#036",
                        }}
                      >
                        {data.Description}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ borderRadius: "2px", color: "#036" }}>
                        {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                        <Currency value={data.NetDebit} />
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ borderRadius: "2px", color: "#036" }}>
                        {/* {data.NetCredit !== null ? data.NetCredit.toLocaleString() : ''} */}
                        <Currency value={data.NetCredit} />
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span>
                        {Math.abs(runningTotal).toLocaleString()}{" "}
                        {getDrOrCr(runningTotal)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            <tr
              style={{
                backgroundColor: "#f8f8f8",
                fontWeight: "bold",
                height: "30px",
              }}
            >
              <td colSpan="4" style={{ textAlign: "right" }}>
                {" "}
                Total:
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {drTotal.toLocaleString()} */}
                <Currency value={drTotal} />
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {crTotal.toLocaleString()} */}
                <Currency value={crTotal} />
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {Math.abs(runningTotal).toLocaleString() + ' ' + getDrOrCr(runningTotal)} */}
                <Currency value={Math.abs(runningTotal)} />{" "}
                {getDrOrCr(runningTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="clearfix"></div>
    </div>
  );
};

export default AcStatTrans;
