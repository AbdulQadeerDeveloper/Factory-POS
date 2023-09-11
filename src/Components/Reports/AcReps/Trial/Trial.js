import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "../../../AxiosInstance";
import Level2 from "./Level2";
import { GlobalData } from "../../../GlobalData";
import { useReactToPrint } from "react-to-print";
import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";
import PartyTypes from "../../../Comps/PartyTypes";
import ReportFiltersShowHide from "../../Shared/ReportFiltersShowHide";
import ReportHeader from "../../Shared/ReportHeader";

function TrialBalance() {
  const [isLoading, setIsLoading] = useState(false);
  const [partyTypeArray, setPartyTypeArray] = useState([]);
  const [data, setData] = useState({
    L1: [],
    L2: [],
    L3: [],
    L4: [],
    L5: [],
  });

  useEffect(() => {
    document.title = 'Trial';
  },[])
  const [showFilters, setShowFilters] = useState(true);

  const datacontext = useContext(GlobalData);

  const componentRef = useRef();
  const pageStyle = `@page {size: landscape}`;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Trial_Balance",
    pageStyle: pageStyle,
  });

  const [parentobj, setParentobj] = useState({
    CDate: new Date().toISOString().slice(0, 10),
    SDate: localStorage.getItem("sDate"),
    EDate: new Date().toISOString().slice(0, 10),
  });

  function StartDate(e) {
    setParentobj({ ...parentobj, SDate: e.target.value });
  }
  function EndDate(e) {
    setParentobj({ ...parentobj, EDate: e.target.value });
  }
  function GenerateReport() {
    setIsLoading(true);
    let cri = "";
    for (let i = 0; i < partyTypeArray.length; i++) {
      cri = cri + partyTypeArray[i].value;
      if (i !== partyTypeArray.length - 1) cri = cri + ",";
    }
    if (cri.length > 0) cri = `partytypeid in(${cri})`;

    var config = {
      method: "GET",
      url: `api/fin/trial?sdate=${parentobj.SDate}&edate=${parentobj.EDate}&isTrans=true&cri=${cri}`,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.data.L1.length > 0) {
          setData({
            ...data,
            L1: response.data.L1,
            L2: response.data.L2,
            L3: response.data.L3,
            L4: response.data.L4,
            L5: response.data.L5,
          });
        } else {
          console.log("record does not exist");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setData([]);
        alert("Network or Server Error: " + err.message);
      });
    // console.log(config.url);
  }

  return (
    <div>
      <div
        className="container-fluid"
        style={{ background: "darkgrey", padding: "7px 0" }}
      >
        <div className="main-div">
          <ReportHeader
            title="Trial Balance"
            isLoading={isLoading}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          {/* <div className='bg-info top_heading' style={{ borderBottom: "1px solid darkgrey", fontFamily: "verdana", background: "", fontWeight: "normal", fontSize: "20px", color: "#444", textAlign: "left", padding: "15px 0 15px 25px" }}>
                        Trial Balance{isLoading ? "(Loading...)" : ""}
                    </div> */}
          <div className="clearfix"></div>
          <div className="container">
            <div
              className="report_caption_area"
              style={ReportFiltersShowHide(showFilters)}
            >
              <div className="row">
                <div className="col-md-4">
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
                <div className="col-md-2">
                  <label>&nbsp;</label>
                  <div className="field_1 report_generate_btn">
                    <button
                      className="btn btn-info btn-md"
                      style={{ height: "38px", width: "100%" }}
                      onClick={GenerateReport}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
                <div className="col-md-2" style={{ padding: "0", margin: "0" }}>
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
            {/* new code */}
            <div className="container">
              <div className="row">
                <div className="col-md-4 trialbalancesort">
                  <div>
                    {/* <span style={{fontSize:"14px"}}>Trial Sort By: Name</span> */}
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <span
                      className="trialbalancecompany"
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        borderBottom: "2px solid lightgrey",
                      }}
                    >
                      {datacontext.firm.FirmName}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "14px" }}>
                      <b>Report run at: &nbsp; &nbsp;</b>
                      <ConvertedDate date={parentobj.CDate} />
                    </span>
                  </div>
                </div>
              </div>
              <br />
            </div>

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12" style={{ marginTop: "-45px" }}>
                  <table
                    className="trialbalancetable"
                    style={{ width: "35%", margin: "0 auto" }}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div
                            style={{
                              fontSize: "12px",
                              width: "80%",
                              margin: "0 auto",
                              borderBottom: "2px solid darkgrey",
                              marginTop: "0px",
                              background: "",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>
                              Trial Balance: &nbsp; &nbsp;
                            </span>
                            From <ConvertedDate date={parentobj.SDate} /> To
                            <ConvertedDate date={parentobj.EDate} />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
              {/* <div className='row'>
                                <div className='col-md-3' style={{marginTop: "-55px"}}>
                                    <div className="input-group rounded" style={{ width: "86%", margin: "0 auto" }}>
                                        <input style={{ zIndex: "0" }} id="search" type="search" onKeyUp={SearcFilter} className="form-control rounded" placeholder="🔍 Search" />
                                    </div>
                                </div>
                            </div> */}
              {/* <br /> */}
              <div className="row">
                <div className="col-md-12">
                  <div className="mytable">
                    <div className="transactions_section">
                      <table
                        id="myTable"
                        className="table table-bordered trial_bal_table_amounts"
                      >
                        <thead>
                          <tr>
                            <th colSpan="2"> &nbsp; </th>
                            <th className="trial_heading" colSpan="2">
                              Opening
                            </th>
                            <th className="trial_heading" colSpan="2">
                              Transaction
                            </th>
                            <th className="trial_heading" colSpan="2">
                              Balance
                            </th>
                          </tr>
                          <tr>
                            <th> ID </th>
                            <th>Description</th>
                            <th className="trial_heading">Debit</th>
                            <th className="trial_heading">Credit</th>
                            <th className="trial_heading">Debit</th>
                            <th className="trial_heading">Credit</th>
                            <th className="trial_heading">Debit</th>
                            <th className="trial_heading">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.L1.length > 0 ? (
                            data.L1 &&
                            data.L1.map((l1, i) => (
                              <>
                                <tr
                                  key={i}
                                  style={{
                                    background: "lightblue",
                                    textAlign: "justify",
                                  }}
                                >
                                  <td>{l1.MHeadID}</td>
                                  <td>{l1.MHead}</td>
                                  <td>
                                    <Currency value={l1.OpDr} />
                                  </td>
                                  <td>
                                    <Currency value={l1.OpCr} />
                                  </td>
                                  <td>
                                    <Currency value={l1.CurDr} />
                                  </td>
                                  <td>
                                    <Currency value={l1.CurCr} />
                                  </td>
                                  <td>
                                    <Currency value={l1.ClDr} />
                                  </td>
                                  <td>
                                    <Currency value={l1.ClCr} />
                                  </td>
                                </tr>
                                <Level2 data={data} MHeadID={l1.MHeadID} />
                              </>
                            ))
                          ) : (
                            <tr
                              style={{
                                background: "lightgrey",
                                textAlign: "justify",
                              }}
                            >
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                No Record Found!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='col-md-12'>
                            <table style={{width: "98%", margin: "0 auto"}}>
                                <thead>
                                    <tr><th></th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{textAlign: "left"}}>Company Signature</td>
                                        <td style={{textAlign: "right"}}>Party Signature</td>
                                    </tr>
                                </tbody>
                                
                            </table>
                        </div>
                        <div className='clearfix'></div>

                        <div className='col-md-12' style={{borderTop: "1px solid #eee", marginTop: "10px"}}>
                            <div style={{textAlign: "center"}}>Kashif Traders</div>
                        </div>
                        <div className='clearfix'></div> */}
            <br />
          </div>
          {/* print div end */}
        </div>
      </div>
    </div>
  );
}

export default TrialBalance;
