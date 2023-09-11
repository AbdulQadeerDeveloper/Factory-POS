import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Ana1ByProd from "./Ana1ByProd";
import Ana2ByProdParty from "./Ana2ByProdParty";
import Ana3ByPartyProd from "./Ana3ByPartyProd";
import ProdTypes from "../../../Comps/ProdTypes";
import FirmsList from "../../../Comps/FirmsList";
import PartyTypes from "../../../Comps/PartyTypes";
import PartiesMulti from "../../../Comps/PartiesMulti";
import ProductsMulti from "../../../Comps/ProductsMulti";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function Ana() {
  //#region variables
  const [transarray, setTransarray] = useState([]);
  const [ftransarray, setFtransarray] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  //#endregion variables
  const [parentobj, setParentobj] = useState([]);
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
    documentTitle: "Analysis",
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

  const [number, setNumber] = useState("1");

  useEffect(() => {
    console.log("initialzed");
  }, []);

  //#endregion variables 2

  //#region Functions
  function GenerateReport(num) {
    let url = "api/ana/";
    if (num === "1") url += "sale_prod_qty";
    else if (num === "2") url += "sale_prod_party_qty";
    else if (num === "3") url += "sale_party_prod_qty";
    else if (num === "4") {
      url += "sale_prod_amt";
      num = "1";
    } else if (num === "5") {
      url += "sale_prod_party_amt";
      num = "2";
    } else if (num === "6") {
      url += "sale_party_prod_amt";
      num = "3";
    }

    setIsLoading(true);
    axios
      .get(url)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0) {
          setTransarray(response.data);
        } else {
          setTransarray([]);
          console.log("record not exist");
        }
        setNumber(num);
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
          title="Analysis"
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
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Product Types</label>
                  <ProdTypes
                    parentobj={parentobj}
                    setParentobj={setParentobj}
                  />
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("1")}
                  >
                    Product Qty
                  </button>
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("2")}
                  >
                    ProdPartyQty
                  </button>
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("3")}
                  >
                    PartyProdQty
                  </button>
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("4")}
                  >
                    Product Amt
                  </button>
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("5")}
                  >
                    ProdPartyAmt
                  </button>
                </div>
              </div>
              <div className="col-md-1" style={{ padding: "0", margin: "0" }}>
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={() => GenerateReport("6")}
                  >
                    PartyProdAmt
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
          {number === "1" && (
            <Ana1ByProd transarray={isFiltered ? ftransarray : transarray} />
          )}
          {number === "2" && (
            <Ana2ByProdParty
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
          {number === "3" && (
            <Ana3ByPartyProd
              transarray={isFiltered ? ftransarray : transarray}
            />
          )}
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
