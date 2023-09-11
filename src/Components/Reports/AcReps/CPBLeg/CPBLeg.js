import axios from "../../../AxiosInstance";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import CpbBalsTran from "./CPBLegTrans";
import { useNavigate, useParams } from "react-router-dom";
import ReportHeader from "../../Shared/ReportHeader";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function CPBLeg() {
  const navigate = useNavigate();
  let { id } = useParams();
  const UrlID = useRef({ id });

  //#region variables
  const [transarray, setTransarray] = useState([]);
  //#endregion variables

  //#region variables 2
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "CPB Ledger",
    pageStyle: pageStyle,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    UrlID.current.value = id;
    GenerateReport();
    document.title = 'Chq Detail';
  }, []);

  function GotoUrl(e) {
    if (e.key === "Enter") navigate(`/cpbleg/${UrlID.current.value}`);
  }

  //#endregion variables 2

  //#region Functions
  function GenerateReport() {
    setIsLoading(true);
    axios
      .get(`api/fin/cpbleg/${UrlID.current.value}`)
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

  //#region JSX
  return (
    <AnimatedPage
      className="container-fluid"
      style={{ background: "darkgrey", padding: "7px 0" }}
    >
      <div className="main-div">
        <ReportHeader
          title="CPB Ledger"
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
              <div
                className="col-md-2 report_cpb_sdate_column"
                style={{ marginLeft: "7px" }}
              >
                <div
                  className="field_1 report_cpb_sdate"
                  style={{ width: "100%", float: "left" }}
                >
                  <label>Enter CPB No</label>
                  <input
                    ref={UrlID}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="number"
                    onKeyDown={GotoUrl}
                    autoComplete="off"
                  />
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
          <CpbBalsTran transarray={transarray} />
        </div>
      </div>
    </AnimatedPage>
  );
  //#endregion JSX
}
