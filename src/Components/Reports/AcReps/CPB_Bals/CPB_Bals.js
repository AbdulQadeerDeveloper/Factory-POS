import axios from "../../../AxiosInstance";
import CashInHand from "../../../Comps/CashInHand";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import CpbBalsTran from "./CPB_BalsTran";
import ReportHeader from "../../Shared/ReportHeader";
import OrderByCPB from "../../../Comps/OrderByCPB";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function CPB_Bal() {
  //#region variables
  const [orderObject, setOrderObject] = useState({
    value: "Date",
    label: "Date",
  });
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
    if (parentobj.CashAcc > 0) {
      setFtransarray(transarray.filter((x) => x.IssueTo === parentobj.CashAcc));
    } else setFtransarray(transarray);
  }, [transarray, parentobj]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "CPB_Bals",
    pageStyle: pageStyle,
  });

  const [isLoading, setIsLoading] = useState(false);

  const sDateRef = useRef();
  const eDateRef = useRef();

  useEffect(() => {
    console.log("initialzed");
    sDateRef.current.value = new Date().toISOString().slice(0, 10);
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    GenerateReport();
    document.title = 'Chq Bals';

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
    let cri = "&cri=BalAmt<>0";
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/fin/cpb_bals?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}${cri}`,
    };
    // 131010060
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

  useEffect(() => {
    let a = 0;
    const arrayToSort = ftransarray.slice(0);
    // console.log(orderObject)
    let sorted = null;
    orderObject.label === "Balance" && arrayToSort
      ? arrayToSort.sort((a, b) => a.BalAmt - b.BalAmt)
      : (a = 0);
    orderObject.label === "Date" && arrayToSort
      ? arrayToSort.sort((a, b) => a.Date.localeCompare(b.Date))
      : (a = 0);
    orderObject.label === "CPB" && arrayToSort
      ? arrayToSort.sort((a, b) => a.CPB - b.CPB)
      : (a = 0);
    orderObject.label === "Party" && arrayToSort
      ? arrayToSort.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
      : (a = 0);
    orderObject.label === "ChqDate" && arrayToSort
      ? arrayToSort.sort((a, b) => a.ChqDate.localeCompare(b.ChqDate))
      : (a = 0);
    orderObject.label === "IssueTo" && arrayToSort
      ? arrayToSort.sort((a, b) => a.IssueName.localeCompare(b.IssueName))
      : (a = 0);
    orderObject.label === "Bank" && arrayToSort
      ? arrayToSort.sort((a, b) => a.BankName.localeCompare(b.BankName))
      : (a = 0);
    // console.table(sorted)
    setFtransarray(arrayToSort);
  }, [orderObject]);

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="CPB Balances"
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
              <div className="col-md-1 hideonmobile"></div>
              <div className="col-md-1">
                <div
                  className="field_1 report_cpb_cashlist"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Order By</label>
                  <OrderByCPB
                    orderObject={orderObject}
                    setOrderObject={setOrderObject}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div
                  className="field_1 report_cpb_cashlist"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Cash A/C List</label>
                  <CashInHand
                    parentobj={parentobj}
                    setParentobj={setParentobj}
                  />
                </div>
              </div>
              <div
                className="col-md-2 report_cpb_sdate_column"
                style={{ marginLeft: "7px" }}
              >
                <div
                  className="field_1 report_cpb_sdate"
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
                  className="field_1 report_cpb_edate_column"
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
                  <button
                    onClick={handleDecrement}
                    className="plusminus report_cpb_dec"
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  <button
                    onClick={handleIncrement}
                    className="plusminus report_cpb_inc"
                  >
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
          <CpbBalsTran transarray={ftransarray} />
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
