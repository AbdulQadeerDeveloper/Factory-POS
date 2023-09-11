import React from "react";
import ConvertDateInput from "../../../Shared_Components/ConvertDateInput";
// import Currency from '../Shared_Components/Currency';
import "../../_shared/printmain.css";
import GetNow from "../../../Shared_Components/GetNow";

export default function OutwardGatePass(props) {
  const { parentobj, transarray, GatePassRef, contextdata, docTitle } = props;
  let QtyT = 0;
  let PQtyT = 0;

  return (
    <div>
      <div className="container-fluid newprint">
        <div className="row">
          <div className="col-md-12" ref={GatePassRef}>
            <table border="1px" className="dd">
              <thead>
                <tr>
                  <th colSpan="5">
                    <table border="0px" className="print_table">
                      <thead></thead>
                      <tbody>
                        <tr>
                          <th colSpan="4">
                            <table
                              border="1px"
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
                                        contextdata.firm[0].label}
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
                            className="master_heading"
                            style={{ width: "12%" }}
                          >
                            <b>OGP#:</b>
                          </td>
                          <td>
                            <div
                              className="master_field"
                              style={{ width: "38%" }}
                            >
                              {parentobj.VocNo}
                            </div>
                          </td>
                          <td
                            className="master_heading"
                            style={{ width: "12%" }}
                          >
                            <b>DO#:</b>
                          </td>
                          <td>
                            <div
                              className="master_field"
                              style={{ width: "38%" }}
                            >
                              {parentobj.VocNo}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="master_heading">
                            <b>Date:</b>
                          </td>
                          <td>
                            <div className="master_field">
                              {ConvertDateInput(parentobj.Date, false)}
                            </div>
                          </td>
                          <td className="master_heading">
                            <b>Invoice#:</b>
                          </td>
                          <td>
                            <div className="master_field">
                              {" "}
                              {parentobj.VocNo}{" "}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="master_heading">
                            <b>Party:</b>
                          </td>
                          <td colSpan={3}>
                            <div className="master_field">
                              {parentobj.PartyName}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="master_heading">
                            <b>Remarks:</b>
                          </td>
                          <td colSpan={3}>
                            <div className="master_field">
                              {parentobj.Remarks}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="detail_heading center" style={{ width: "5%" }}>
                    Sr#
                  </td>
                  <td className="detail_heading left" style={{ width: "50%" }}>
                    Product
                  </td>
                  <td
                    className="detail_heading center"
                    style={{ width: "20%" }}
                  >
                    Packing
                  </td>
                  <td className="detail_heading right" style={{ width: "15%" }}>
                    Qty
                  </td>
                  <td
                    className="detail_heading center"
                    style={{ width: "10%" }}
                  >
                    Unit
                  </td>
                </tr>
                {transarray &&
                  transarray.map((data, i) => {
                    PQtyT += data.PQty;
                    QtyT += data.Qty;
                    return (
                      data.isDeleted === 0 && (
                        <tr key={i}>
                          <td className="detail_field center">{data.SrNo}</td>
                          <td className="detail_field left">
                            {data.ProDesc.length > 0
                              ? data.ProDesc
                              : data.ProdName}
                          </td>
                          <td className="detail_field center">
                            {data.PQty} {data.PUnit} × {data.Packing}
                          </td>
                          <td className="detail_field right">{data.Qty}</td>
                          <td className="detail_field center">{data.Unit}</td>
                        </tr>
                      )
                    );
                  })}
                <tr>
                  <td colSpan="2"></td>
                  <td className="detail_heading center">{PQtyT}</td>
                  <td className="detail_heading">{QtyT}</td>
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
                            className="master_heading right"
                            style={{ width: "10%" }}
                          >
                            Out Time:
                          </td>
                          <td
                            className="master_field left"
                            style={{ width: "15%" }}
                          >
                            {parentobj.IOTime !== null
                              ? new Date(parentobj.IOTime).toLocaleTimeString()
                              : "NA"}
                          </td>
                          <td
                            className="master_heading right"
                            style={{ width: "10%" }}
                          >
                            Driver:
                          </td>
                          <td
                            className="master_field left"
                            style={{ width: "40%" }}
                          >
                            {" "}
                            {parentobj.ByPerson !== null
                              ? parentobj.ByPerson
                              : "NA"}
                          </td>
                          <td
                            className="master_heading right"
                            style={{ width: "10%" }}
                          >
                            Vehicle:
                          </td>
                          <td
                            className="master_field left"
                            style={{ width: "15%" }}
                          >
                            {parentobj.Vehicle !== null
                              ? parentobj.Vehicle
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
                    className="master_heading center underline"
                    style={{ width: "25%" }}
                  >
                    <b>Receiver Signature </b>
                  </td>
                  <td
                    className="master_heading center underline"
                    style={{ width: "25%" }}
                  >
                    <b> Prepared By </b>
                  </td>
                  <td
                    className="master_heading center underline"
                    style={{ width: "25%" }}
                  >
                    <b>Checked By </b>
                  </td>
                  <td
                    className="master_heading center underline"
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
