import React, { useState, useContext, useRef, useEffect } from "react";
import PartiesList from "../../../Comps/PartiesList";
import CPBBal from "./CPBBal";
import { GlobalData } from "../../../GlobalData";
import axios from "../../../AxiosInstance";
import { useReactToPrint } from "react-to-print";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import ReportHeader from "../../Shared/ReportHeader";
import PrintAcStat from "../../../Prints/AcPrints/PrintAcStat/PrintAcStat";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import AcStatTrans from "./AcStatTrans";
import { useSearchParams } from "react-router-dom";

export default function AcStat() {
  const [searchParams, setSearchParams] = useSearchParams();

  const datacontext = useContext(GlobalData);
  //#region Methods
  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Account Statement",
    pageStyle: pageStyle,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [parentobj, setParentobj] = useState({
    PartyId: 0,
    PartyName: "",
    CDate: new Date().toISOString().slice(0, 10),
    SDate: localStorage.getItem("sDate"), //new Date().toISOString().slice(0,10),
    EDate: new Date().toISOString().slice(0, 10),
  });
  // const ClickRef =  useRef(null);
  const [tmparray, setTmparray] = useState([]);
  const [cpb_array, setCpb_array] = useState([]);
  const [opening, setOpening] = useState(0);

  function StartDate(e) {
    setParentobj({ ...parentobj, SDate: e.target.value });
  }
  function EndDate(e) {
    setParentobj({ ...parentobj, EDate: e.target.value });
  }
  function GenerateReport() {
    if (parentobj.PartyId === "" || parentobj.PartyId === 0) {
      setTmparray([]);
      setCpb_array([]);
      setOpening(0);
      return;
    }
    // console.log(parentobj);
    var config = {
      method: "GET",
      url:
        "api/fin/acstat?partyid=" +
        parentobj.PartyId +
        "&sdate=" +
        parentobj.SDate +
        "&edate=" +
        parentobj.EDate,
    };
    setIsLoading(true);
    // 131010060
    axios(config)
      .then((response) => {
        setIsLoading(false);
        let res = response.data;
        console.log(res);
        if (res.data) {
          // console.log(res.data);
          // console.log(res.opening[0].opbal)
          setTmparray(res.data);
          setCpb_array(res.cpb_bal);
          setOpening(res.opening[0].opbal);
        } else {
          console.log("record not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
      });
  }
  // function SelectParty(e) {
  //     setParentobj({...parentobj, PartyId: e.target.value})
  // }
  // convert date into standard format
  // function ConvertDateFrmt(date) {
  //     let cnv = date = date.substring(0, 10);
  //     return cnv
  // }
  //#endregion Methods End

  useEffect(() => {
    if (parentobj.PartyId === 0) {
      let partyId = searchParams.get("partyid")
      if (partyId?.length > 0) {
        setParentobj({ ...parentobj, PartyId: partyId, PartyName: searchParams.get("partyname") })
        searchParams.delete("partyid")
        searchParams.delete("partyname")
        setSearchParams(searchParams)

      }
    }
  }, [])

  useEffect(() => {
    GenerateReport();
    document.title = "AcStat";
  }, [parentobj.PartyId]);
  //#region JSX
  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          <ReportHeader
            title="A/C Statement"
            isLoading={isLoading}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <div className="clearfix"></div>
          <div className="container">
            <div
              className="report_caption_area"
              style={ReportFiltersShowHide(showFilters)}
            >
              <div className="row">
                <br />
                <div
                  className="col-md-2"
                  style={{ textAlign: "justify", paddingRight: "0" }}
                >
                  <div style={{ fontSize: "18px" }}>
                    <b>{datacontext.firm[0] && datacontext.firm[0].label}</b>
                  </div>
                  {/* <div>
                    {" "}
                    <i className="fa fa-phone"></i>{" "}
                    {datacontext.firm[0] && datacontext.firm[0].phone}
                  </div>
                  <div>
                    {" "}
                    <i className="fa fa-envelope"></i>{" "}
                    {datacontext.firm[0] && datacontext.firm[0].Email}
                  </div>
                  <div>
                    {" "}
                    <i className="fa fa-location-arrow"></i>{" "}
                    {datacontext.firm[0] && datacontext.firm[0].Address}
                  </div> */}
                </div>
                <div className="col-md-4">
                  <div
                    className="field_1"
                    style={{ width: "100%", margin: "0 auto" }}
                  >
                    <label>A/c Title</label>
                    <PartiesList
                      partieslist={datacontext.parties}
                      childobj={parentobj}
                      setChildobj={setParentobj}
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
                      style={{ height: "38px" }}
                      className="form-control"
                      type="date"
                      onChange={(e) => StartDate(e)}
                      value={parentobj.SDate}
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
                      style={{ height: "38px" }}
                      className="form-control"
                      type="date"
                      onChange={(e) => EndDate(e)}
                      value={parentobj.EDate}
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
                    </button>{" "}
                  </div>
                </div>
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
          <hr />
          <div className="clearfix"></div>

          {/* print div start */}
          <div className="printing_area" ref={componentRef}>
            <div
              className="col-md-12"
              style={{ textAlign: "center", margin: "0px 0 0 0" }}
            >
              <div
                className="bg-info"
                style={{ fontSize: "17px", padding: "7px 0" }}
              >
                <b>
                  {parentobj.PartyName} ( {parentobj.PartyId} )
                </b>
              </div>
            </div>
            <div className="clearfix"></div>

            <div className="col-md-12" style={{ margin: "0", padding: "0" }}>
              <table style={{ width: "98%", margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left", fontSize: "12px" }}>
                      LedgerFrom:{" "}
                      <u>
                        <ConvertedDate date={parentobj.SDate} />
                      </u>{" "}
                      TO:{" "}
                      <u>
                        <ConvertedDate date={parentobj.EDate} />
                      </u>
                    </td>
                    <td style={{ textAlign: "right", fontSize: "12px" }}>
                      ReportGenerated Date:{" "}
                      <u>
                        <ConvertedDate date={parentobj.CDate} />
                      </u>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="clearfix"></div>

            <br />
            <AcStatTrans opening={opening} tmparray={tmparray} />
            <br />
            <br />
            {cpb_array.length > 0 && <CPBBal cpb_array={cpb_array} />}

            <br />
            <br />

            <div className="col-md-12">
              <table style={{ width: "98%", margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>Company Signature</td>
                    <td style={{ textAlign: "right" }}>Party Signature</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="clearfix"></div>

            {/* <hr/> */}

            <div
              className="col-md-12"
              style={{ borderTop: "1px solid #eee", marginTop: "10px" }}
            >
              <div style={{ textAlign: "center" }}>
                {datacontext.firm[0] && datacontext.firm[0].FirmName}
              </div>
            </div>
            <div className="clearfix"></div>
            <br />
          </div>
          {/* print div end */}
        </div>
      </div>
      <div>
        <PrintAcStat
          parentobj={parentobj}
          componentRef={componentRef}
          opening={opening}
          tmparray={tmparray}
          cpb_array={cpb_array}
        />
      </div>
    </AnimatedPage>
  );
  //#endregion JSX END
}
