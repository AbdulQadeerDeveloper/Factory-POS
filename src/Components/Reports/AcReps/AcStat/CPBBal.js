import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";

const CPBBal = (props) => {
  // destructuring
  const { cpb_array } = props;

  let chqAmt = 0,
    recAmt = 0,
    balAmt = 0;

  function NewWindowOpen(e) {
    let url = "cpbleg/" + e.target.innerHTML;
    window.open(url, "_blank");
  }
  function NewCPBOpen(e) {
    let url = "chq/" + e.target.innerHTML;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div
        className="col-md-12"
        style={{ textAlign: "center", margin: "0px 0 0 0" }}
      >
        <div className="bg-info" style={{ fontSize: "17px", padding: "7px 0" }}>
          <b>Pending CPBs</b>
        </div>
      </div>
      <div className="panel panel-default transactions_section">
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr className="acstat_th_cpb" style={{ fontSize: "12px" }}>
              <th className="bg-color text-center col-xs-1">VocNo</th>
              <th
                className="bg-color text-center col-xs-1"
                style={{ verticalAlign: "middle" }}
              >
                CPB
              </th>
              <th className="bg-color text-center col-xs-1">ChqNo</th>
              <th className="bg-color text-center col-xs-1">Rec Date</th>
              <th className="bg-color text-center col-xs-1">Chq Date</th>
              <th className="bg-color text-left col-xs-4">Bank Name</th>
              <th className="bg-color col-xs-1 text-center">Chq Amt</th>
              <th className="bg-color col-xs-1 text-center">Rec Amt</th>
              <th className="bg-color col-xs-2 text-center">Bal Amt</th>
            </tr>
          </thead>
          <tbody id="d">
            {cpb_array &&
              cpb_array.map((data, i) => {
                chqAmt += data.chqAmt || 0;
                recAmt += data.recAmt || 0;
                balAmt += data.BalAmt || 0;

                return (
                  <tr
                    key={i}
                    className="entry_row statement_row"
                    style={{ fontSize: "" }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <span
                        onClick={(e) => NewCPBOpen(e)}
                        style={{
                          borderRadius: "2px",
                          textAlign: "center",
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
                        onClick={(e) => NewWindowOpen(e)}
                        style={{
                          borderRadius: "2px",
                          textAlign: "center",
                          color: "#036",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {data.CPB}
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
                        {data.ChqNo}
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
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          borderRadius: "2px",
                          textAlign: "center",
                          color: "#036",
                        }}
                      >
                        <ConvertedDate date={data.ChqDate} />
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
                        {data.BankName}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.ChqAmt} />
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.RecAmt} />
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ borderRadius: "2px", color: "#036" }}>
                        <Currency value={data.BalAmt} />
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
              <td colSpan="6" style={{ textAlign: "right" }}>
                {" "}
                CPB(s) Total:
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {drTotal.toLocaleString()} */}
                <Currency value={chqAmt} />
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {crTotal.toLocaleString()} */}
                <Currency value={recAmt} />
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="amount"
              >
                {/* {Math.abs(runningTotal).toLocaleString() + ' ' + getDrOrCr(runningTotal)} */}
                <Currency value={balAmt} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="clearfix"></div>
    </div>
  );
};

export default CPBBal;
