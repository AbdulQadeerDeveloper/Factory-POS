import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import DailyRegTran from "./DailyRegTran";
import Select from "react-select";
import ReportHeader from "../../Shared/ReportHeader";
import MultiSelectStyling from "../../../Shared_Components/MultiSelectStyling";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function DailyReg() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //#endregion variables

  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "DailyReg",
    pageStyle: pageStyle,
  });

  const sDateRef = useRef();
  const eDateRef = useRef();
  const ttypeRef = useRef();

  useEffect(() => {
    console.log("initialzed");
    sDateRef.current.value = new Date().toISOString().slice(0, 10);
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    GenerateReport();
    document.title = 'DailyReg';
  }, []);

  function handleDecrement() {
    sDateRef.current.value = addDays(sDateRef.current.value, -1);
    eDateRef.current.value = sDateRef.current.value;
    GenerateReport();
  }

  function handleIncrement() {
    sDateRef.current.value = addDays(sDateRef.current.value, +1);
    eDateRef.current.value = sDateRef.current.value;
    GenerateReport();
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().slice(0, 10);
  }

  // function ConvertDateFrmt(date) {
  //     let cnv = date = date.substring(0, 10);
  //     return cnv
  // }

  function StartDate(e) {
    sDateRef.current.value = e.target.value;
    GenerateReport();
    // setSDate(e.target.value)
    // setEDate(e.target.value)
  }
  function EndDate(e) {
    eDateRef.current.value = e.target.value;
    GenerateReport();
  }

  //#endregion variables 2

  //#region Functions

  function GenerateReport() {
    setIsLoading(true);
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/fin/dailyreg?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}`,
    };
    // 131010060
    axios(config)
      .then((response) => {
        setIsLoading(false);
        // console.log(response.data);
        if (response.data.length > 0) {
          setTransarray(response.data);
          setFtransarray(response.data);
        } else {
          setTransarray([]);
          setFtransarray([]);
          console.log("record not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setTransarray([]);
        setFtransarray([]);
        alert("network or server error: " + err.message);
      });
  }

  //#endregion Functions
  const [selectedTtypeList, setSelectedTtypeList] = useState([]);
  const ttypeList = [
    { value: "CHQ", label: "CHQ" },
    { value: "JV", label: "JV" },
    { value: "BR", label: "BR" },
    { value: "BP", label: "BP" },
    { value: "PV", label: "PV" },
    { value: "SV", label: "SV" },
    { value: "SRV", label: "SRV" },
    { value: "PRV", label: "PRV" },
    { value: "CR", label: "CR" },
    { value: "CP", label: "CP" },
  ];

  function handleTType(e) {
    setSelectedTtypeList(e);
  }

  useEffect(() => {
    if (selectedTtypeList.length > 0) {
      setFtransarray([]);
      for (let j = 0; j < selectedTtypeList.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].TType === selectedTtypeList[j].value) {
            setFtransarray((p) => [...p, transarray[k]]);
          }
        }
      }
    } else setFtransarray(transarray);

    // if (selectedTtypeList.length > 0) {
    //     selectedTtypeList.map(({ value }) => {
    //         setfTransarray(transarray.filter(x => x.TType === value))
    //     })
    // } else {
    //     setfTransarray(transarray)
    // }
  }, [selectedTtypeList, transarray]);
  const [showFilters, setShowFilters] = useState(true);

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Daily Register"
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
              <div className="col-md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", float: "left" }}
                >
                  <label>TType</label>
                  <Select
                    ref={ttypeRef}
                    value={selectedTtypeList}
                    onChange={handleTType}
                    isMulti
                    // className="basic-single"
                    styles={MultiSelectStyling()}
                    classNamePrefix="select"
                    name="color"
                    options={ttypeList}
                  />
                </div>
              </div>
              <div
                className="col-md-2 report_dailyreg_sdate_column"
                style={{ marginLeft: "7px" }}
              >
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
              <div className="col-md-2 report_dailyreg_edate_column">
                <div
                  className="field_1 report_dailyreg_edate_column"
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
              <div className="col-md-1"></div>
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
          <DailyRegTran transarray={ftransarray} />
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
