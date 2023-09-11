import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ReportHeader from "../../Shared/ReportHeader";
import BSDr from "./BSDr";
import BSCr from "./BSCr";
import Currency from "../../../Shared_Components/Currency";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function BS2() {
  //#region variables
  const [drArray, setDrArray] = useState([]);
  const [crArray, setCrArray] = useState([]);
  const [clstk, setClStk] = useState([]);
  const [isSum, setIsSum] = useState(true);
  //#endregion variables
  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Balance Sheet",
    pageStyle: pageStyle,
  });

  const [isLoading, setIsLoading] = useState(false);

  const eDateRef = useRef();

  useEffect(() => {
    document.title = 'BS';
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    GenerateReport();
  }, []);

  function handleDecrement() {
    eDateRef.current.value = addDays(eDateRef.current.value, -1);
    GenerateReport();
  }

  function handleIncrement() {
    eDateRef.current.value = addDays(eDateRef.current.value, +1);
    GenerateReport();
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().slice(0, 10);
  }

  const [grandDr, setGrandDr] = useState(0);
  const [grandCr, setGrandCr] = useState(0);

  function EndDate(e) {
    eDateRef.current.value = e.target.value;
    GenerateReport();
  }

  //#endregion variables 2

  //#region Functions
  function GenerateReport() {
    setIsLoading(true);
    var config = {
      method: "GET",
      url: `api/fin/bs?edate=${eDateRef.current.value}`,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.data) {
          setDrArray(response.data.dr);
          setCrArray(response.data.cr);
          setClStk(response.data.clstk[0].ClAmt);
          // if (partyTypes.length === 0) setPartyTypes(response.data.types);
        } else {
          setDrArray([]);
          setCrArray([]);
          console.log("record not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setDrArray([]);
        setCrArray([]);
        alert("network or server error: " + err.message);
      });
  }

  //#endregion Functions
  const [showFilters, setShowFilters] = useState(true);

  //#region JSX
  return (
    <AnimatedPage
      className="container-fluid"
      style={{ background: "darkgrey", padding: "7px 0" }}
    >
      <div className="main-div">
        <ReportHeader
          title="Balance Sheet"
          isLoading={isLoading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <div className="container-fluid">
          <div
            className="captions_area"
            style={{
              padding: "5px 0",
              display: showFilters ? "block" : "none",
            }}
          >
            <br />
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-2">
                <div
                  className="field_1"
                  style={{ width: "100%", float: "left" }}
                >
                  <label>End Date</label>
                  <input
                    ref={eDateRef}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="date"
                    onChange={(e) => EndDate(e)}
                    autoComplete="off"
                  />
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="col-md-1">
                {/* <br /> */}
                <div className="summarized">
                  <label>IsSummarized?</label>
                  <input
                    type="checkbox"
                    style={{ padding: "10", marginTop: "25" }}
                    checked={isSum}
                    onChange={(e) => setIsSum(!isSum)}
                  />
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_plus_minus_btns">
                  <button onClick={handleDecrement} className="plusminus">
                    <i className="fa fa-minus"></i>
                  </button>
                  <button onClick={handleIncrement} className="plusminus">
                    <i className="fa fa-plus"></i>
                  </button>
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
        <div className="clearfix"></div>
        {/* print div start */}
        <div className="printing_area bs2_report_print_area" ref={componentRef}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <BSCr crArray={crArray} setGrandCr={setGrandCr} isSum={isSum} />
              </div>
              <div className="col-md-6">
                <BSDr drArray={drArray} setGrandDr={setGrandDr} isSum={isSum} />
              </div>
            </div>

            <div className="row">
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total Liabilities: <Currency value={grandCr} />
              </div>
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total Assets: <Currency value={grandDr} />
              </div>
            </div>

            <div className="row">
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Owner Equity: <Currency value={grandDr + clstk - grandCr} />
              </div>
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Closing Stock: <Currency value={clstk} />
              </div>
            </div>

            <div className="row">
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Net Liabilities:{" "}
                <Currency value={grandDr + clstk - grandCr + grandCr} />
              </div>
              <div
                className="col-md-6"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Net Assets: <Currency value={grandDr + clstk} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
