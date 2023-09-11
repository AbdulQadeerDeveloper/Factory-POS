import React from "react";
import ConvertDateInput from "../../Shared_Components/ConvertDateInput";
import Currency from "../../Shared_Components/Currency";
import "../_shared/printmain.css";
import ReportGetNow from "../_shared/ReportGetNow";
import ConvertedDate from "../../Shared_Components/ConvertedDate";

export default function PrintPO(props) {
  const { parentobj, transarray, componentRef, contextdata, docTitle } = props;
  let QtyT = 0;
  let PQtyT = 0;
  let AmtT = 0;

  return (
    <div>
      <div className="container-fluid newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <table className="no-border">
              <thead>
                <tr>
                  <th colSpan="9">
                    <table border="0" className="no-border">
                      <thead></thead>
                      <tbody>
                        <tr>
                          <th colSpan="9">
                            <table
                              border="0"
                              className="dd"
                              cellPadding={0}
                              cellSpacing={0}
                            >
                              <thead>
                                <ReportGetNow />
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="firmname">
                                      {parentobj?.FirmName?.length > 0 &&
                                        parentobj?.FirmName}
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
                          <td colSpan="9" className="firmname">
                            {docTitle || ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="bold" style={{ width: "10%" }}>
                            <b>PO#:</b>
                          </td>
                          <td>
                            <div
                              className="normal left underline"
                              style={{ width: "40%" }}
                            >
                              {parentobj?.VocNo}
                            </div>
                          </td>
                          <td className="bold" style={{ width: "10%" }}>
                            PO.Date:
                          </td>
                          <td>
                            <div
                              className="normal left underline"
                              style={{ width: "40%" }}
                            >
                              <ConvertedDate date={parentobj?.Date} />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="bold">PO Type:</td>
                          <td>
                            <div className="normal left underline"></div>
                          </td>
                          <td className="bold">Delivery.Date:</td>
                          <td className="normal left underline">
                            <ConvertedDate date={parentobj?.ExpiryDate} />
                          </td>
                        </tr>
                        <tr>
                          <td className="bold">Vendor:</td>
                          <td className="normal left underline">
                            {parentobj?.PartyName}
                          </td>
                          <td className="bold left">PO.Exp.Date:</td>
                          <td className="normal left underline">
                            {<ConvertedDate date={parentobj?.ExpiryDate} />}
                          </td>
                        </tr>
                        <tr className="left">
                          <td className="bold">Vendor Code:</td>
                          <td>
                            <div className="normal underline left"></div>
                            {parentobj?.PartyId}
                          </td>
                          <td className="bold">Pay.Mode:</td>
                          <td className="normal underline left">
                            {parentobj?.PaymentMode}
                          </td>
                        </tr>
                        <tr className="left">
                          <td className="bold">
                            <b>Inventory Type:</b>
                          </td>
                          <td>
                            <div className="normal underline">Sales Tax</div>
                          </td>
                          <td className="bold">
                            <b>F.E GST#:</b>
                          </td>
                          <td>
                            <div className="normal underline left">
                              08-80-2900-014-37
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
                            <b>F.E NTN#:</b>
                          </td>
                          <td>
                            <div className="normal underline left">
                              1183749-7
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
                  <td className="left" style={{ width: "30%" }}>
                    Product
                  </td>
                  <td className="center" style={{ width: "15%" }}>
                    Packing
                  </td>
                  <td className="right" style={{ width: "10%" }}>
                    Qty
                  </td>
                  <td className="center" style={{ width: "8%" }}>
                    Unit
                  </td>
                  <td className="center" style={{ width: "10%" }}>
                    Rate
                  </td>
                  <td className="center" style={{ width: "8%" }}>
                    GST%
                  </td>
                  <td className="center" style={{ width: "8%" }}>
                    Adv%
                  </td>
                  <td className="center" style={{ width: "15%" }}>
                    Amount
                  </td>
                </tr>
                {transarray &&
                  transarray.map((data, i) => {
                    PQtyT += data?.PQty;
                    QtyT += data?.Qty;
                    AmtT += data?.NetAmount;
                    return (
                      data?.isDeleted === 0 && (
                        <tr key={i} className="light-border normal">
                          <td className="center">{data?.SrNo}</td>
                          <td className="left">{data?.ProdName}</td>
                          <td className="center">
                            {data?.PQty} {data?.PUnit} × {data?.Packing}
                          </td>
                          <td className="right">{data?.Qty}</td>
                          <td className="center">{data?.Unit}</td>
                          <td className="right">{data?.Rate}</td>
                          <td className="right">{data?.GSTRate}</td>
                          <td className="right">{data?.AdvRate}</td>
                          <td className="right">{data?.NetAmount}</td>
                        </tr>
                      )
                    );
                  })}
                <tr className="bold dark-border">
                  <td colSpan="2"></td>
                  <td className="center">{PQtyT}</td>
                  <td className="right">{QtyT}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="right">
                    <Currency value={AmtT} />
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
            <p className="normal" style={{ fontFamily: "Times New Roman" }}>
              1. Please provide 2 copies of Delivery Challan of material
              supplied. <br />
              2. Purchase Oder and WareHouse/Party Name must be mentioned on
              Delivery Challan/Invoice, otherwise material will not be accepted.{" "}
              <br />
              3. In case of late delivery of material from the date of delivery
              mentioned P.O 5 % will be charged as a penalty. <br />
              4. In case the material is not supplied in time/substandard M/S {parentobj.FirmName}
              reserve rights to make Risk Purchase and the
              amount will be debit to your account. <br />
              5. In case of Goods complain/Quality issue, Rejected Goods be to
              lifted from M/S {parentobj.FirmName} Ware House within 5 days, In
              case of direct delivery, The material will be lifted where it was
              deliver by supplier Otherwise M/S {parentobj.FirmName} will not be
              responsible for any claim/loss of material after 5 days. <br />
              6. Purchase Oder can be cancelled by us or any time without prior
              notice and without any compensation whatsoever. Credit days will
              start from material delivery at {parentobj.FirmName} ware house and
              direct delivery on Party credit days start from when we receive
              party acknowledgment through supplier. <br />
              7. Party reconcile their accounts after every month, Otherwise M/S
              {parentobj.FirmName} will not be responsible for any discrepancy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
