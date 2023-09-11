import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import StkEvalTrans from "./StkEvalTrans";
import ProdTypes from "../../../Comps/ProdTypes";
import ReportHeader from "../../Shared/ReportHeader";
import ProductsMulti from "../../../Comps/ProductsMulti";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StkEvalTrans4Col from "./StkEvalTrans4Col";

export default function StkEval() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  //#endregion variables
  const [productsArray, setProductsArray] = useState([]);
  const [parentobj, setParentobj] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Stock Eval",
    pageStyle: pageStyle,
  });

  useEffect(() => {
    if (parentobj.length === 0 && productsArray.length === 0) {
      setFtransarray([]);
      setIsFiltered(false);
      return;
    }
    setIsFiltered(true);
    setFtransarray([]);
    //PRODTYPEID
    if (parentobj.length > 0) {
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].ProdTypeId === parentobj[j].value) {
            setFtransarray((p) => [...p, transarray[k]]);
          }
        }
      }
    }

    //PRODUCTS ARRAY
    if (productsArray.length > 0) {
      for (let j = 0; j < productsArray.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].ProductId === productsArray[j].value) {
            setFtransarray((p) => [...p, transarray[k]]);
          }
        }
      }
    }
  }, [transarray, parentobj, productsArray]);

  // useEffect(() => {
  //     if (parentobj.length > 0) {
  //         setFtransarray([])
  //         for (let j = 0; j < parentobj.length; j++) {
  //             for (let k = 0; k < transarray.length; k++) {
  //                 if (transarray[k].ProdTypeId === parentobj[j].value) {
  //                     setFtransarray(p => [...p, transarray[k]])
  //                 }
  //             }
  //         }
  //     }
  //     else
  //         setFtransarray(transarray)

  // }, [transarray, parentobj])

  const [isLoading, setIsLoading] = useState(false);

  const sDateRef = useRef();
  const eDateRef = useRef();

  useEffect(() => {
    document.title = 'Stock Eval';
    sDateRef.current.value = new Date().toISOString().slice(0, 10);
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    GenerateReport();
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
    GenerateReport();
  }

  function EndDate(e) {
    eDateRef.current.value = e.target.value;
    GenerateReport();
  }

  //#endregion variables 2
  const [showFilters, setShowFilters] = useState(true);

  //#region Functions
  function GenerateReport() {
    let url = ""
    if (trialColumns === "2")
      url = `api/stk/stk_cl_eval?edate=${eDateRef.current.value}`;
    else if (trialColumns === "4")
      url = `api/stk/stk_4col_eval?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}`;

    setIsLoading(true);
    axios.get(url)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data.length);
        console.log(response.data);
        // const unique = [...new Set(data.map(item => item.group))]; // [ 'A', 'B']
        // const unique = [...new Set(array.map(item => item.age))];      // filter unque values
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
  const [trialColumns, setTrialColumns] = useState("2");

  function handleTrialColumn(e) {
    setTrialColumns(e.target.value)
  }

  useEffect(() => {
    GenerateReport();
  },[trialColumns])

  //#endregion Functions

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Stock Evaluation"
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
                  <option value="2" selected>2 Col</option>
                  <option value="4">4 Col</option>
                </select>
              </div>
              <div className="col-md-2">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Product Types</label>
                  <ProdTypes
                    parentobj={parentobj}
                    setParentobj={setParentobj}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Products</label>
                  <ProductsMulti
                    parentobj={productsArray}
                    setParentobj={setProductsArray}
                  />
                </div>
              </div>
              {1==1 && <div className="col-md-2">
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
              }
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
                <div className="field_1">
                  <button
                    className="btn btn-info btn-md" style={{ width: "55%" }}
                    onClick={GenerateReport}
                  >
                    Generate
                  </button>
                  <label>&nbsp;</label>
                  <button
                    onClick={handlePrint}
                    className="btn btn-info btn-md" style={{ width: "40%" }}
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
          {trialColumns === "2" && <StkEvalTrans transarray={isFiltered ? ftransarray : transarray} />}
          {trialColumns === "4" && <StkEvalTrans4Col transarray={isFiltered ? ftransarray : transarray} />}
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
