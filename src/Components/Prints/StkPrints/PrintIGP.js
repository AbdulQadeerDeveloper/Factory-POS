import React from "react";
import ConvertDateInput from "../../Shared_Components/ConvertDateInput";
import GetNow from "../../Shared_Components/GetNow";
import "../_shared/printmain.css";

export default function PrintIGP(props) {
  const { parentobj, transarray, componentRef, contextdata, docTitle } = props;
  let QtyT = 0;
  let PQtyT = 0;

  return (
    <div>
      <div className="container-fluid newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <table className="no-border">
              <thead>
                <tr>
                  <th colSpan="5">
                    <table border="0" className="no-border">
                      <thead></thead>
                      <tbody>
                        <tr>
                          <th colSpan="4">
                            <table
                              border="0"
                              className="dd"
                              cellPadding={0}
                              cellSpacing={0}
                            >
                              <thead>
                                <tr>
                                  <td className="time">
                                    Report run at: {GetNow()}
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="firmname">
                                      {contextdata?.firm?.length > 0 &&
                                        contextdata?.firm[0].label}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="address">
                                    {contextdata?.firm[0]?.Address}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </th>
                        </tr>

                        <tr>
                          <td colSpan="4" className="firmname">
                            {docTitle || ""}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="bold"
                            style={{ width: "10%" }}
                          >
                            <b>IGP#:</b>
                          </td>
                          <td>
                            <div
                              className="normal left underline"
                              style={{ width: "40%" }}
                            >
                              {parentobj?.VocNo}
                            </div>
                          </td>
                          <td
                            className="bold"
                            style={{ width: "10%" }}
                          >
                            <b>DA#:</b>
                          </td>
                          <td>
                            <div
                              className="normal left underline"
                              style={{ width: "40%" }}
                            >
                              {parentobj?.BNo}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="bold">
                            <b>Date:</b>
                          </td>
                          <td>
                            <div className="normal left underline">
                              {ConvertDateInput(parentobj?.Date, false)}
                            </div>
                          </td>
                          <td className="bold">
                            <b>Da.Date:</b>
                          </td>
                          <td>
                            <div className="normal left underline">
                              {ConvertDateInput(parentobj?.BDate)}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="bold">
                            <b>Party:</b>
                          </td>
                          <td colSpan={3}>
                            <div className="normal left underline">
                              {parentobj?.PartyName}
                            </div>
                          </td>
                        </tr>
                        <tr className="left">
                          <td className="bold">
                            <b>Remarks:</b>
                          </td>
                          <td>
                            <div className="normal underline">
                              {parentobj?.Remarks}
                            </div>
                          </td>
                          <td className="bold">
                            <b>Bilti#:</b>
                          </td>
                          <td>
                            <div className="normal underline left">
                              {parentobj?.CNo}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bold dark-border">
                  <td className="center" style={{ width: "5%" }}>
                    Sr#
                  </td>
                  <td className="left" style={{ width: "50%" }}>
                    Product
                  </td>
                  <td
                    className="center"
                    style={{ width: "20%" }}
                  >
                    Packing
                  </td>
                  <td className="right" style={{ width: "15%" }}>
                    Qty
                  </td>
                  <td
                    className="center"
                    style={{ width: "10%" }}
                  >
                    Unit
                  </td>
                </tr>
                {transarray &&
                  transarray.map((data, i) => {
                    PQtyT += data?.PQty;
                    QtyT += data?.Qty;
                    return (
                      data?.isDeleted === 0 && (
                        <tr key={i} className="light-border normal">
                          <td className="center">{data?.SrNo}</td>
                          <td className="left">
                              {data?.ProdName}
                          </td>
                          <td className="center">
                            {data?.PQty} {data?.PUnit} × {data?.Packing}
                          </td>
                          <td className="right">{data?.Qty}</td>
                          <td className="center">{data?.Unit}</td>
                        </tr>
                      )
                    );
                  })}
                <tr className="bold dark-border">
                  <td colSpan="2"></td>
                  <td className="center">{PQtyT}</td>
                  <td className="right">{QtyT}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <table
                      border="0px"
                      className="print_table"
                      style={{ marginTop: "15px" }}
                    >
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td
                            className="bold right"
                            style={{ width: "10%" }}
                          >
                            Out Time:
                          </td>
                          <td
                            className="normal left"
                            style={{ width: "15%" }}
                          >
                            {parentobj?.IOTime !== null
                              ? new Date(parentobj?.IOTime).toLocaleTimeString()
                              : "NA"}
                          </td>
                          <td
                            className="bold right"
                            style={{ width: "10%" }}
                          >
                            Driver:
                          </td>
                          <td
                            className="normal left"
                            style={{ width: "40%" }}
                          >
                            {" "}
                            {parentobj?.ByPerson !== null
                              ? parentobj?.ByPerson
                              : "NA"}
                          </td>
                          <td
                            className="bold right"
                            style={{ width: "10%" }}
                          >
                            Vehicle:
                          </td>
                          <td
                            className="normal left"
                            style={{ width: "15%" }}
                          >
                            {parentobj?.Vehicle !== null
                              ? parentobj?.Vehicle
                              : "NA"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              border="0px"
              className="print_table"
              style={{ marginTop: "20px", border: "0px !important" }}
            >
              <thead></thead>
              <tbody>
                <tr>
                  <td
                    className="bold center underline"
                    style={{ width: "25%" }}
                  >
                    <b>Receiver Signature </b>
                  </td>
                  <td
                    className="bold center underline"
                    style={{ width: "25%" }}
                  >
                    <b> Prepared By </b>
                  </td>
                  <td
                    className="bold center underline"
                    style={{ width: "25%" }}
                  >
                    <b>Checked By </b>
                  </td>
                  <td
                    className="bold center underline"
                    style={{ width: "25%" }}
                  >
                    <b> Authorized Signature</b>
                  </td>
                </tr>
                <tr style={{ height: "50px" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
