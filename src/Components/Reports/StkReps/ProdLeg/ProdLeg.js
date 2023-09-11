import React, { useState, useContext, useRef, useEffect } from "react";
import ProductsList from "../../../Comps/ProductsList";
import ProdLegTrans from "./ProdLegTrans";
import { GlobalData } from "../../../GlobalData";
import axios from "../../../AxiosInstance";
import { useReactToPrint } from "react-to-print";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import PrintProdLeg from '../../../Prints/StkPrints/PrintProdLeg/PrintProdLeg'
function ProdLeg() {
  const datacontext = useContext(GlobalData);
  //#region Methods
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Prod Ledger",
    pageStyle: pageStyle,
  });

  const [parentobj, setParentobj] = useState({
    ProductId: 0,
    ProdName: "",
    CDate: new Date().toISOString().slice(0, 10),
    SDate: localStorage.getItem("sDate"),
    EDate: new Date().toISOString().slice(0, 10),
  });
  // const ClickRef =  useRef(null);
  const [tmparray, setTmparray] = useState([]);
  const [opQty, setOpQty] = useState(0);
  const [opAmt, setOpAmt] = useState(0);

  useEffect(() => {
    document.title = 'Prod Leg';
    GenerateReport();
  }, [parentobj.ProductId]);

  function StartDate(e) {
    setParentobj({ ...parentobj, SDate: e.target.value });
  }
  function EndDate(e) {
    setParentobj({ ...parentobj, EDate: e.target.value });
  }
  function GenerateReport() {
    if (!parentobj.ProductId > 0) {
      setTmparray([]);
      setOpQty(0);
      setOpAmt(0);
      return;
    }
    // console.log(parentobj);
    var config = {
      method: "GET",
      url:
        "api/stk/prodleg?productid=" +
        parentobj.ProductId +
        "&sdate=" +
        parentobj.SDate +
        "&edate=" +
        parentobj.EDate,
    };
    setIsLoading(true);
    // 131010060
    axios(config)
      .then((response) => {
        setIsLoading(false);
        let res = response.data;
        console.log(res);
        if (res.data) {
          // console.log(res.data);
          // console.log(res.opQty[0].opbal)
          setTmparray(res.data);
          setOpQty(res.opening[0].OpQty);
          setOpAmt(res.opening[0].OpAmt);
        } else {
          console.log("record not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
      });
  }
  // function SelectParty(e) {
  //     setParentobj({...parentobj, PartyId: e.target.value})
  // }
  // convert date into standard format
  // function ConvertDateFrmt(date) {
  //     let cnv = date = date.substring(0, 10);
  //     return cnv
  // }
  //#endregion Methods End

  //#region JSX
  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          <ReportHeader
            title="Product Ledger"
            isLoading={isLoading}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <div className="clearfix"></div>
          <div className="container">
            <div
              className="report_caption_area"
              style={ReportFiltersShowHide(showFilters)}
            >
              <div className="row">
                <div className="col-md-4">
                  <div
                    className="field_1"
                    style={{ width: "100%", margin: "0 auto" }}
                  >
                    <label>Product Name</label>
                    <ProductsList
                      partieslist={datacontext.parties}
                      childobj={parentobj}
                      setChildobj={setParentobj}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div
                    className="field_1"
                    style={{ width: "100%", float: "left" }}
                  >
                    <label>Start Date</label>
                    <input
                      style={{ height: "38px" }}
                      className="form-control"
                      type="date"
                      onChange={(e) => StartDate(e)}
                      value={parentobj.SDate}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div
                    className="field_1"
                    style={{ width: "100%", float: "left" }}
                  >
                    <label>End Date</label>
                    <input
                      style={{ height: "38px" }}
                      className="form-control"
                      type="date"
                      onChange={(e) => EndDate(e)}
                      value={parentobj.EDate}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                  <label>&nbsp;</label>
                  <div className="field_1 report_generate_btn">
                    <button
                      className="btn btn-info btn-md"
                      onClick={GenerateReport}
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                  <label>&nbsp;</label>
                  <div className="field_1 report_print_btn">
                    <button
                      onClick={handlePrint}
                      className="btn btn-info btn-md button print_voucher print__button"
                    >
                      Print
                    </button>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <hr />
          <div className="clearfix"></div>

          {/* print div start */}
          <div className="printing_area" ref={componentRef}>
            <div
              className="col-md-12"
              style={{ textAlign: "center", margin: "0px 0 0 0" }}
            >
              <div
                className="bg-info"
                style={{ fontSize: "17px", padding: "7px 0" }}
              >
                <b>
                  {parentobj.ProdName} ( {parentobj.ProductId} )
                </b>
              </div>
            </div>
            <div className="clearfix"></div>

            <div className="col-md-12" style={{ margin: "0", padding: "0" }}>
              <table style={{ width: "98%", margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left", fontSize: "12px" }}>
                      LedgerFrom:{" "}
                      <u>
                        <ConvertedDate date={parentobj.SDate} />
                      </u>{" "}
                      TO:{" "}
                      <u>
                        <ConvertedDate date={parentobj.EDate} />
                      </u>
                    </td>
                    <td style={{ textAlign: "right", fontSize: "12px" }}>
                      ReportGenerated Date:{" "}
                      <u>
                        <ConvertedDate date={parentobj.CDate} />
                      </u>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="clearfix"></div>

            <br />
            <ProdLegTrans opQty={opQty} opAmt={opAmt} tmparray={tmparray} />
            <br />
            <br />

            <div className="col-md-12">
              <table style={{ width: "98%", margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>Company Signature</td>
                    <td style={{ textAlign: "right" }}>Party Signature</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="clearfix"></div>

            {/* <hr/> */}

            <div
              className="col-md-12"
              style={{ borderTop: "1px solid #eee", marginTop: "10px" }}
            >
              <div style={{ textAlign: "center" }}>
                {datacontext.firm[0] && datacontext.firm[0].FirmName}
              </div>
            </div>
            <div className="clearfix"></div>
            <br />
          </div>
          {/* print div end */}
        </div>
      </div>
      <div>
      <PrintProdLeg
          parentobj={parentobj}
          componentRef={componentRef}
          opQty={opQty}
          opAmt={opAmt}
          tmparray={tmparray}
        />
      </div>

    </AnimatedPage>
  );
  //#endregion JSX END
}

export default ProdLeg;
