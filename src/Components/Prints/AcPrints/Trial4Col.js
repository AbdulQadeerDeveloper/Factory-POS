import React from "react";
import Currency from "../../Shared_Components/Currency";
import '../_shared/printmain.css'
import ReportHead from "../_shared/ReportHead";
import DateHead from "../_shared/DateHead";
import ReportGetNow from "../_shared/ReportGetNow";

export default function Trial4Col({ componentRef, parentobj, transarray }) {

  //#region variables
  // g for group level
  let g1_opBal = 0;
  let g1_curDr = 0;
  let g1_curCr = 0;
  let g1_clBal = 0;

  let grand_opBal = 0;
  let grand_curDr = 0;
  let grand_curCr = 0;
  let grand_clBal = 0;
  //#endregion variables

  return (
    <div>
      <div className="container newprint">
        <div className="row">
          <div className="col-md-12" ref={componentRef}>
            <ReportGetNow />
            <table cellSpacing="0" style={{ width: "100%" }}>
              <thead>
                <ReportHead colspan={9} title='Trial Balance' />
                <DateHead parentobj={parentobj} />
                <tr className="table table-bordered">
                  <th className="bg-color col-xs-1 text-center" style={{ width: '12%' }}>Code</th>
                  <th className="bg-color col-xs-6 text-left" style={{ width: '40%' }}>A/C Title</th>
                  <th className="bg-color col-xs-1 text-right" style={{ width: '12%' }}>Opening</th>
                  <th className="bg-color col-xs-1 text-right" style={{ width: '12%' }}>Cur Dr</th>
                  <th className="bg-color col-xs-1 text-right" style={{ width: '12%' }}>Cur Cr</th>
                  <th className="bg-color col-xs-1 text-right" style={{ width: '12%' }}>Closing</th>
                </tr>
              </thead>
              <tbody className="table table-bordered table-condensed">
                {transarray?.length > 0 ? (
                  transarray?.map((data, i) => {
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
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No Record Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="clearfix"></div>
    </div>
  );

  //#region Sub-Components

  function HeaderRow({ index }) {
    if (isNewG1(index)) {
      g1_opBal = 0;
      g1_curDr = 0;
      g1_curCr = 0;
      g1_clBal = 0;

      return (
        <tr>
          <td colSpan={9} className="left bold">
            <div className="bg" style={{ background: 'lightblue' }}>
              {transarray[index].PartyType}({transarray[index].PartyTypeId})
            </div>
          </td>
        </tr>
      );
    }
  }

  function DataRow({ data }) {
    g1_opBal += data.OpBal || 0;
    g1_curDr += data.CurDr || 0;
    g1_curCr += data.CurCr || 0;
    g1_clBal += data.ClBal || 0;

    grand_opBal += data.OpBal || 0;
    grand_curDr += data.CurDr || 0;
    grand_curCr += data.CurCr || 0;
    grand_clBal += data.ClBal || 0;

    return (
      <tr cellSpacing="0">
        <td className="center normal">
          {data.PartyId}
        </td>
        <td className="left normal">
          {data.PartyName}
        </td>
        <td className="right normal">
          <Currency value={data.OpBal} />
        </td>
        <td className="right normal">
          <Currency value={data.CurDr} />
        </td>
        <td className="right normal">
          <Currency value={data.CurCr} />
        </td>
        <td className="right normal">
          <Currency value={data.ClBal} />
        </td>
      </tr>
    );
  }

  function FooterRow({ index }) {
    if (isLastG1(index)) {
      return (
        <tr style={{ backgroundColor: "lightgrey" }}>
          <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
            {transarray[index].PartyType} Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={g1_clBal} />
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
          <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>
            Grand Total:
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_opBal} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curDr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_curCr} />
          </td>
          <td colSpan={1} style={{ textAlign: "right", fontWeight: "bold" }}>
            <Currency value={grand_clBal} />
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
      transarray[index].PartyTypeId !== transarray[index + 1].PartyTypeId
    );
  }

  function isNewG1(index) {
    return (
      index === 0 ||
      transarray[index].PartyTypeId !== transarray[index - 1].PartyTypeId
    );
  }
  //#endregion Utility Methods
}
