import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import StkPurByDate from "./StkPurByDate";
import ProdTypes from "../../../Comps/ProdTypes";
import OrderBy from "../../../Comps/OrderBy";
import StkPurByProd from "./StkPurByProd";
import StkPurByParty from "./StkPurByParty";
import StkPurByPartySum from "./StkPurByPartySum";
import StkPurByProdSum from "./StkPurByProdSum";
import StkPurByVocNo from "./StkPurByVocNo";
import FirmsList from "../../../Comps/FirmsList";
import PartyTypes from "../../../Comps/PartyTypes";
import PartiesMulti from "../../../Comps/PartiesMulti";
import ProductsMulti from "../../../Comps/ProductsMulti";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import PrintStkPurByDate from "../../../Prints/StkPrints/PrintStkPurByDate";
import FilterComp from "../../../Comps/FilterComp";

export default function StkPur() {
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
  const pageStyle = `@page {size: landscape}`;
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
    document.title = "Pur Report";
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

  useEffect(() => {
    GenerateReport();
  }, [orderObject]);
  //#region Functions
  function GenerateReport() {
    setIsLoading(true);
    // setTransarray([]);
    var config = {
      method: "GET",
      url: `api/stk/pur?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}&orderby=${orderObject.value}`,
    };
    setIsLoading(true);
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

  //#region JSX
  return (
    <AnimatedPage className="container-fluid main_container">
      <div className="main-div">
        <ReportHeader
          title="Purchase Report"
          isLoading={isLoading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <div className="container-fluid">
          <div
            className="report_caption_area"
            style={ReportFiltersShowHide(showFilters)}
          >
          </div>
          <FilterComp
            orderObject={orderObject} setOrderObject={setOrderObject} parentobj={parentobj} setParentobj={setParentobj} 
            sDateRef={sDateRef} eDateRef={eDateRef} StartDate={StartDate} EndDate={EndDate} 
            handleDecrement={handleDecrement} handleIncrement={handleIncrement} GenerateReport={GenerateReport} 
            handlePrint={handlePrint} showFilters={showFilters} firmObject={firmObject} setFirmObject={firmObject} 
            partyTypeArray={partyTypeArray} setPartyTypeArray={setPartyTypeArray} partiesArray={partiesArray} 
            setPartiesArray={setPartiesArray} productsArray={productsArray} setProductsArray={setProductsArray}
             />
        </div>
        {/* print div start */}
        <div className="printing_area" ref={componentRef}>
          <br />
          {orderObject.label === "Date" && (
            <StkPurByDate transarray={isFiltered ? ftransarray : transarray} />
          )}
          {orderObject.label === "Product" && (
            <StkPurByProd transarray={isFiltered ? ftransarray : transarray} />
          )}
          {orderObject.label === "Party" && (
            <StkPurByParty transarray={isFiltered ? ftransarray : transarray} />
          )}
          {orderObject.label === "VocNo" && (
            <StkPurByVocNo transarray={isFiltered ? ftransarray : transarray} />
          )}
          {orderObject.label === "Party Sum" && (
            <StkPurByPartySum
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
          {orderObject.label === "Prod Sum" && (
            <StkPurByProdSum
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
        </div>
      </div>
      <div>
        <PrintStkPurByDate
          parentobj={{ SDate: sDateRef?.current?.value, EDate: eDateRef?.current?.value }}
          componentRef={componentRef}
          transarray={isFiltered ? ftransarray : transarray}
        />
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
