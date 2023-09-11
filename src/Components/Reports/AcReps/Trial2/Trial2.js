import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Trial2Trans4Col from "./Trial2Trans4Col";
import Trial2Trans6Col from "./Trial2Trans6Col";
import PartyTypes from "../../../Comps/PartyTypes";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import Trial4Col from "../../../Prints/AcPrints/Trial4Col";
import Trial6Col from "../../../Prints/AcPrints/Trial6Col";
import Trial2Col from "../../../Prints/AcPrints/Trial2Col";
import Trial2Trans2Col from "./Trial2Trans2Col";
export default function Trial2() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  //#endregion variables
  const [parentobj, setParentobj] = useState({
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "CR",
    Cash: null,
    CashAcc: null,
    Trans: [],
  });
  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  useEffect(() => {
    if (parentobj.length > 0) {
      setFtransarray([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].PartyTypeId === parentobj[j].value) {
            setFtransarray((p) => [...p, transarray[k]]);
          }
        }
      }
    } else setFtransarray(transarray);
  }, [transarray, parentobj]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Trial",
    pageStyle: pageStyle,
  });

  const [isLoading, setIsLoading] = useState(false);

  const sDateRef = useRef();
  const eDateRef = useRef();

  useEffect(() => {
    sDateRef.current.value = new Date().toISOString().slice(0, 10);
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    GenerateReport();
    document.title = "Trial";
  }, []);

  function handleDecrement() {
    sDateRef.current.value = addDays(sDateRef.current.value, -1);
    eDateRef.current.value = addDays(eDateRef.current.value, -1);
    GenerateReport();
  }

  function handleIncrement() {
    sDateRef.current.value = addDays(sDateRef.current.value, +1);
    eDateRef.current.value = addDays(eDateRef.current.value, +1);
    GenerateReport();
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().slice(0, 10);
  }

  function StartDate(e) {
    sDateRef.current.value = e.target.value;
  }

  function EndDate(e) {
    eDateRef.current.value = e.target.value;
  }

  //#endregion variables 2

  //#region Functions
  function GenerateReport() {
    setIsLoading(true);
    let cri = "";
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/fin/trial2?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}${cri}`,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0) {
          setTransarray(response.data);
        } else {
          setTransarray([]);
          console.log("record not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setTransarray([]);
        alert("network or server error: " + err.message);
      });
  }

  //#endregion Functions
  const [showFilters, setShowFilters] = useState(true);
  const [trialColumns, setTrialColumns] = useState("6");

  function handleTrialColumn(e) {
      setTrialColumns(e.target.value)
  }

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Trial"
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
              <div className="col-md-1">
                <label>Trial Columns</label>
                <select className="form-control" onChange={handleTrialColumn}>
                  <option value="6" selected>6 Col</option>
                  <option value="4">4 Col</option>
                  <option value="2">2 Col</option>
                </select>
              </div>
              <div className="col-md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Party Types</label>
                  <PartyTypes
                    parentobj={parentobj}
                    setParentobj={setParentobj}
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
                    ref={sDateRef}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="date"
                    onChange={(e) => StartDate(e)}
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
                    ref={eDateRef}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="date"
                    onChange={(e) => EndDate(e)}
                    autoComplete="off"
                  />
                </div>
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
              {/* <div className='col-md-1'></div> */}
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
        <div className="printing_area">
          <br />
          {trialColumns === "6" && <Trial2Trans6Col transarray={ftransarray} />}
          {trialColumns === "4" && <Trial2Trans4Col transarray={ftransarray} />}
          {trialColumns === "2" && <Trial2Trans2Col transarray={ftransarray} />}
        </div>
      </div>
      <div>
        {trialColumns === "6" && <Trial6Col
          parentobj={parentobj}
          componentRef={componentRef}
          transarray={ftransarray}
        />
        }
        {trialColumns === "4" && <Trial4Col
          parentobj={parentobj}
          componentRef={componentRef}
          transarray={ftransarray}
        />
        }
        {trialColumns === "2" && <Trial2Col
          parentobj={parentobj}
          componentRef={componentRef}
          transarray={ftransarray}
        />
        }
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
