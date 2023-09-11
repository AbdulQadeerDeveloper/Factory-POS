import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import AgingDrTrans from "./AgingDrTrans";
import PartyTypes from "../../../Comps/PartyTypes";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function AgingDr() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  const [partyTypes, setPartyTypes] = useState([]);
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
    documentTitle: "Aging",
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

  function EndDate(e) {
    eDateRef.current.value = e.target.value;
    GenerateReport();
  }

  //#endregion variables 2

  //#region Functions
  function GenerateReport() {
    setIsLoading(true);
    let cri = "";
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/fin/dr_aging?edate=${eDateRef.current.value}${cri}`,
    };
    axios(config)
      .then((response) => {
        console.log(response.data.types);
        setIsLoading(false);
        if (response.data.data.length > 0) {
          setTransarray(response.data.data);
          if (partyTypes.length === 0) setPartyTypes(response.data.types);
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

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Aging Dr"
          isLoading={isLoading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {/* <div className='bg-info top_heading' style={{ borderBottom: "1px solid darkgrey", fontFamily: "verdana", background: "", fontWeight: "normal", fontSize: "20px", color: "#444", textAlign: "left", padding: "15px 0 15px 25px" }}>
                    Aging{isLoading ? "(Loading...)" : ""}
                </div> */}
        <div className="container-fluid">
          <div
            className="report_caption_area"
            style={ReportFiltersShowHide(showFilters)}
          >
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-5">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Party Types</label>
                  <PartyTypes
                    parentobj={parentobj}
                    setParentobj={setParentobj}
                    partyTypes={partyTypes}
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
        <div className="printing_area" ref={componentRef}>
          <br />
          <AgingDrTrans transarray={ftransarray} />
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
