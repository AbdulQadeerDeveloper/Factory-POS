import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ReportHeader from "../../Shared/ReportHeader";
import BSDr from "./BSDr";
import BSCr from "./BSCr";
import Currency from "../../../Shared_Components/Currency";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function BS() {
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
    console.log("initialzed");
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
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Balance Sheet"
          isLoading={isLoading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <div className="container-fluid">
          <div
            className="report_caption_area"
            style={ReportFiltersShowHide(showFilters)}
          >
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
                </div>
              </div>
              <div className="col-md-1">
                <br />
                <label>IsSummarized?</label>
                <input
                  type="checkbox"
                  style={{ padding: "10", marginTop: "25" }}
                  checked={isSum}
                  onChange={(e) => setIsSum(!isSum)}
                />
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div
                  className="field_1"
                  style={{ width: "100%", textAlign: "left" }}
                >
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
                <div
                  className="field_1"
                  style={{ width: "100%", textAlign: "right" }}
                >
                  <button
                    className="btn btn-info btn-md"
                    style={{ height: "38px", width: "90%" }}
                    onClick={GenerateReport}
                  >
                    Generate
                  </button>
                </div>
              </div>
              {/* <div className='col-md-1'></div> */}
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div
                  className="field_1"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <button
                    onClick={handlePrint}
                    style={{ height: "38px", width: "80%" }}
                    className="btn btn-info btn-md button pull-right print_voucher print__button"
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
        <div className="printing_area" ref={componentRef}>
          <br />
          <div className="row">
            <div className="col-md-6">
              <BSCr crArray={crArray} setGrandCr={setGrandCr} isSum={isSum} />
            </div>
            <div className="col-md-6">
              <BSDr drArray={drArray} setGrandDr={setGrandDr} isSum={isSum} />
            </div>
          </div>
          <div className="row" style={{ height: "38px", marginTop: "10px" }}>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Total Liabilities:
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={grandCr} />
                  </th>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Total Assets:
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={grandDr} />
                  </th>
                </tr>
              </table>
            </div>
          </div>
          <div className="row" style={{ height: "38px", marginTop: "10px" }}>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}></th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Closing Stock:
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={clstk} />
                  </th>
                </tr>
              </table>
            </div>
          </div>
          <div className="row" style={{ height: "38px", marginTop: "10px" }}>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Owner Equity:
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={grandDr + clstk - grandCr} />
                  </th>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}></th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </table>
            </div>
          </div>
          <div className="row" style={{ height: "38px", marginTop: "10px" }}>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Net Liabilities:
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={grandDr + clstk - grandCr + grandCr} />
                  </th>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table style={{ width: "98%" }}>
                <tr>
                  <th style={{ textAlign: "right", width: "80%" }}>
                    Net Assets
                  </th>
                  <th style={{ textAlign: "right" }}>
                    <Currency value={grandDr + clstk} />
                  </th>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
