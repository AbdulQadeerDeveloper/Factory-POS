import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import StkPendPOByDate from "./StkPendPOByDate";
import ProdTypes from "../../../Comps/ProdTypes";
import OrderBy from "../../../Comps/OrderBy";
// import StkPurByProd from './StkPurByProd';
// import StkPurByParty from './StkPurByParty';
// import StkPurByPartySum from './StkPurByPartySum';
// import StkPurByProdSum from './StkPurByProdSum';
// import StkPurByVocNo from './StkPurByVocNo';
import FirmsList from "../../../Comps/FirmsList";
import PartyTypes from "../../../Comps/PartyTypes";
import PartiesMulti from "../../../Comps/PartiesMulti";
import ProductsMulti from "../../../Comps/ProductsMulti";
import ReportHeader from "../../Shared/ReportHeader";
import StkPendPOByProd from "./StkPendPOByProd";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function StkPendPO() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  //#endregion variables
  const [parentobj, setParentobj] = useState([]);
  const [orderObject, setOrderObject] = useState({
    value: "Date",
    label: "Date",
  });
  const [firmObject, setFirmObject] = useState({
    FirmId: null,
    FirmName: null,
  });
  const [partyTypeArray, setPartyTypeArray] = useState([]);
  const [partiesArray, setPartiesArray] = useState([]);
  const [productsArray, setProductsArray] = useState([]);
  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Purchases",
    pageStyle: pageStyle,
  });

  useEffect(() => {
    if (
      parentobj.length === 0 &&
      (firmObject.FirmId === "" || firmObject.FirmId === null) &&
      partyTypeArray.length === 0 &&
      partiesArray.length === 0 &&
      productsArray.length === 0
    ) {
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
    //FIRM ARRAY
    if (firmObject.FirmId > 0) {
      for (let k = 0; k < transarray.length; k++) {
        if (transarray[k].FirmId === firmObject.FirmId) {
          setFtransarray((p) => [...p, transarray[k]]);
        }
      }
    }

    //PARTY TYPE
    if (partyTypeArray.length > 0) {
      for (let j = 0; j < partyTypeArray.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].PartyTypeId === partyTypeArray[j].value) {
            setFtransarray((p) => [...p, transarray[k]]);
          }
        }
      }
    }

    //PARTIES
    if (partiesArray.length > 0) {
      for (let j = 0; j < partiesArray.length; j++) {
        for (let k = 0; k < transarray.length; k++) {
          if (transarray[k].PartyId === partiesArray[j].value) {
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
  }, [
    transarray,
    parentobj,
    firmObject,
    partyTypeArray,
    partiesArray,
    productsArray,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sDateRef = useRef();
  const eDateRef = useRef();

  useEffect(() => {
    document.title = 'Pending PO';
    const dt = new Date();
    dt.setDate(dt.getDate() - 30);

    sDateRef.current.value = dt.toISOString().slice(0, 10);
    eDateRef.current.value = new Date().toISOString().slice(0, 10);
    // GenerateReport();
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
  const GenerateReport = useCallback(() => {
    setIsLoading(true);
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/stk/po_bal?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}&orderby=Date`, //
    };
    setIsLoading(true);
    axios(config)
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
  }, []);
  useEffect(() => {
    GenerateReport();
  }, [orderObject, GenerateReport]);
  //#region Functions

  //#endregion Functions

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Pending PO"
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
              <div className="col-md-2">
                <label>Order By</label>
                <OrderBy
                  parentobj={orderObject}
                  setParentobj={setOrderObject}
                />
              </div>
              <div className="col-md-3">
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
            <div
              className="report_input_space_top_bottom"
              style={{ display: showFilters ? "block" : "none" }}
            >
              &nbsp;
            </div>
            <div
              className="row"
              style={{ display: showFilters ? "block" : "none" }}
            >
              <div className="col-md-2">
                <label>Firm</label>
                <FirmsList
                  parentobj={firmObject}
                  setParentobj={setFirmObject}
                />
              </div>
              <div className="col-md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Party Types</label>
                  <PartyTypes
                    parentobj={partyTypeArray}
                    setParentobj={setPartyTypeArray}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Parties</label>
                  <PartiesMulti
                    parentobj={partiesArray}
                    setParentobj={setPartiesArray}
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
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
        {/* print div start */}
        <div className="printing_area" ref={componentRef}>
          <br />
          {orderObject.label === "Date" && (
            <StkPendPOByDate
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
          {orderObject.label === "Product" && (
            <StkPendPOByProd
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
          {/* {
                        orderObject.label === "Party" && <StkPurByParty transarray={isFiltered ? ftransarray : transarray} />
                    }
                    {
                        orderObject.label === "VocNo" && <StkPurByVocNo transarray={isFiltered ? ftransarray : transarray} />
                    }
                    {
                        orderObject.label === "Party Sum" && <StkPurByPartySum transarray={isFiltered ? ftransarray : transarray} />
                    }
                    {
                        orderObject.label === "Prod Sum" && <StkPurByProdSum transarray={isFiltered ? ftransarray : transarray} />
                    } */}
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
