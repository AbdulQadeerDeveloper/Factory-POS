import React, { useState, useEffect, useRef, useCallback } from "react";
import PartiesList from "../../../Comps/PartiesList";
import SVTrans from "./SVTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FirmsList from "../../../Comps/FirmsList";
import SaleStyle from "./sale.module.css";
import SalemanList from "../../../Comps/SalemanList";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import InvStats from "../../_Shared/InvStat";

function SV() {
  const navigate = useNavigate();

  let { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(-1)

  const DateRef = useRef(null);
  const FirmRef = useRef(null);
  const PartyRef = useRef(null);
  const DueRef = useRef(null);
  const PORef = useRef(null);
  const SalemanRef = useRef(null);
  const RemarksRef = useRef(null);
  const FreightRef = useRef(null);
  const OuttimeRef = useRef(null);
  const PersonRef = useRef(null);
  const VehicleRef = useRef(null);
  const ProductRef = useRef(null);
  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "SALE",
    PartyId: null,
    PartyName: null,
    FirmId: null,
    FirmName: null,
    Due: null,
    PO: null,
    SaleManId: null,
    SaleManName: null,
    Remarks: null,
    Freight: null,
    FreightType: 0,
    IOTime: null,
    ByPerson: null,
    Vehicle: null,
    Status: 0,
    Trans: [],
    EntryUser: "",
    EntryDate: null,
  };

  let [transarray, setTransarray] = useState([]);

  const [parentobj, setParentobj] = useState(parent_tmp_obj);
  const [msg, setMsg] = useState({ err: "", color: "" });
  const [confirm, setConfirm] = useState(true);
  const [ProdList, setProdList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function ParentObjEmpty() {
    setParentobj(parent_tmp_obj);
    setCurrentIndex(-1)
  }

  const GetProdsList = useCallback(() => {
    setIsLoading(true);
    axios({ method: "GET", url: "api/stk/stk_cl_bal?Edate=" + parentobj.Date })
      .then((resp) => {
        setIsLoading(false);
        if (resp.status === 200) {
          let farr = resp.data;
          let op = [];
          if (op.length === 0) {
            for (let i = 0; i < farr.length; i++) {
              let prodobj = {
                ProductId: farr[i].ProductId,
                CurBal: farr[i].PBal,
                PUnit: farr[i].PUnit,
                Packing: farr[i].Packing,
                Qty: farr[i].Bal,
                Unit: farr[i].Unit,
                value: farr[i].ProdName,
                label: farr[i].ProdName,
              };
              op.push(prodobj);
            }
            setProdList(op);
          } else {
            setProdList(op);
          }
        } else {
          alert("Error with status code" + resp.status);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert("Error:" + err.message);
      });
  }, [parentobj.Date]);

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });

    if (vNo === 0) {
      UrlID.current.id = 0;
      GetProdsList();
      ParentObjEmpty(); //parent obj empty
      setTransarray([]);
      // <Navigate url={`/sv/${UrlID.current.id}`} />
      navigate(`/sv/${UrlID.current.id}`);
      return;
    }

    setIsLoading(true);
    axios
      .get("api/sal/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          const {Trans, ...parent} = response.data[0]
          setParentobj(parent)
          setTransarray(Trans)

          // <Navigate url={`/sv/${vNo}`} />
          navigate(`/sv/${vNo}`);
          GetProdsList();
        } else {
          alert("Error with status code: " + response.status);
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/sv/${vNo}`);
          setParentobj({ ...parentobj, VocNo: vNo });
          GetProdsList();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status !== 200) {
          alert("Error with status code: " + err.response.status);
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/sv/${vNo}`);
          setParentobj({ ...parentobj, VocNo: vNo });
        }
      });
  }, []);

  useEffect(() => {
    document.title = 'SV';
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    localStorage.removeItem("upd-sale");
  }, [getData]);

  // get maximum voucher number
  function getMaxVocNo(e) {
    var config = {
      method: "GET",
      url: "api/sal/maxvocno/",
      header: { "Content-Type": "application/json" },
    };
    setIsLoading(true);
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          const maxVNo = response.data;
          if (maxVNo > 0) {
            getData(maxVNo);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
      });
  }

  function handleMouseUp(e) {
    setParentobj({ ...parentobj, VocNo: e.target.value });
    if (UrlID.current.id !== e.target.value) {
      UrlID.current.id = e.target.value;
      e.key = "Enter";
      GetVocDetail(e);
    }
  }

  // handling focus on inputs
  function GetVocDetail(e) {
    if (e.key !== "Enter") return;
    if (VocNoRef.current === document.activeElement) {
      let vNo = parseInt(parentobj.VocNo, 10);
      getData(vNo);
    }
  }

  function FocusNextInputParent(e) {
    if (e.key !== "Enter") return;
    if (DateRef.current === document.activeElement) {
      FirmRef.current && FirmRef.current.focus();
    } else if (DueRef.current === document.activeElement) {
      PORef.current && PORef.current.focus();
    } else if (PORef.current === document.activeElement) {
      SalemanRef.current && SalemanRef.current.focus();
    } else if (RemarksRef.current === document.activeElement) {
      FreightRef.current && FreightRef.current.focus();
    } else if (FreightRef.current === document.activeElement) {
      OuttimeRef.current && OuttimeRef.current.focus();
    } else if (OuttimeRef.current === document.activeElement) {
      PersonRef.current && PersonRef.current.focus();
    } else if (PersonRef.current === document.activeElement) {
      VehicleRef.current && VehicleRef.current.focus();
    } else if (VehicleRef.current === document.activeElement) {
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    setIsLoading(true);
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/sal/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          ParentObjEmpty(); // empty parent obj
          setTransarray([]);
          UrlID.current.id = 0;
          // <Navigate url={`/sv/${UrlID.current.id}`} />
          navigate(`/sv/${UrlID.current.id}`);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }
  // Are you sure pop up
  const DelConfirmation = (vcno) => {
    setMsg({ ...msg, err: "", color: "" });
    confirmAlert({
      title: "Are you sure?",
      message:
        "Do you really want to delete these records? This process cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: () => DelVoucher(vcno),
        },
        {
          label: "No",
          onClick: () => setConfirm(false),
        },
      ],
    });
  };

  // vocher validation

  function ParentValidate() {
    if (parentobj.PartyId === null) {
      setMsg({
        ...msg,
        err: "Party is required",
        color: "alert alert-warning",
      });
    } else if (parentobj.FirmId === null) {
      setMsg({ ...msg, err: "Firm is required", color: "alert alert-warning" });
      // } else if (parentobj.SaleManId === null) {
      //   setMsg({ ...msg, err: "SaleMan is required", color: "alert alert-warning" });
    } else if (transarray.length === 0) {
      setMsg({
        ...msg,
        err: "Vocher did not have any entry",
        color: "alert alert-warning",
      });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      return true;
    }
  }

  // submit vocher
  function SubmitVoucher() {
    if (ParentValidate()) {
      let final = {
        ...parentobj,
        Trans: transarray,
      };
      // console.log(final);

      let ApiMethod = "";
      if (parentobj.VocNo === 0) {
        ApiMethod = "POST";
      } else {
        ApiMethod = "PUT";
      }

      var config = {
        method: ApiMethod,
        url: "api/sal",
        header: { "Content-Type": "application/json" },
        data: final,
      };
      setIsLoading(true);
      axios(config)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200) {
            if (response.data === "Already Updated") {
              setMsg({
                ...msg,
                err: "Already Updated",
                color: "alert alert-warning",
              });
              return;
            }
            if (ApiMethod === "POST") {
              setMsg({
                ...msg,
                err: "Data Saved Successfully",
                color: "alert alert-success",
              });
            } else {
              setMsg({
                ...msg,
                err: "Data Updated Successfully",
                color: "alert alert-success",
              });
            }
            const {Trans, ...parent} = response.data[0]
            setParentobj(parent)
            setTransarray(Trans)

            GetProdsList();
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data[0].VocNo;
              // <Navigate url={`/sv/${UrlID.current.id}`} />
              navigate(`/sv/${UrlID.current.id}`);
            }
          }
        })
        .catch(function (error) {
          setIsLoading(false);
          if (error.response) {
            setMsg({
              ...msg,
              err: error.response.data,
              color: "alert alert-warning",
            });
          } else if (error.request) {
            setMsg({ ...msg, err: error.request, color: "alert alert-danger" });
          } else {
            setMsg({ ...msg, err: error.message, color: "alert alert-danger" });
          }
        });
    } else {
      ParentValidate();
    }
  }

  function SelectDate(e) {
    setParentobj({ ...parentobj, Date: e });
  }

  function PlusMinusVoc(val) {
    if (val === "plus") {
      let plusvoc = parseInt(parentobj.VocNo, 10) + 1;
      getData(plusvoc);
    } else {
      let minusvoc = parseInt(parentobj.VocNo, 10) - 1;
      getData(minusvoc);
    }
  }

  //JSX
  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          {/* <div className='bg-info panel_heading'>
            Delivery Order (DO){isLoading ? "(Loading...)" : ""} <span style={{ display: "none" }}>{confirm}</span>
          </div> */}
          <Header title="Delivery Order (DO)" isLoading={isLoading} />
          <span style={{ display: "none" }}>{confirm}</span>
          <div className="clearfix"></div>

          <div className="page_caption_area">
            <VocNoField VocNoRef={VocNoRef} GetVocDetail={GetVocDetail} setParentobj={setParentobj} parentobj={parentobj} handleMouseUp={handleMouseUp} PlusMinusVoc={PlusMinusVoc} getMaxVocNo={getMaxVocNo} />
            <div className="caption_voc">Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={DateRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => SelectDate(e.target.value)}
                value={
                  parentobj.Date !== null
                    ? parentobj.Date
                    : new Date().toISOString().slice(0, 10)
                }
                className="form-control"
              />
            </div>
            <div className="caption_voc">Firm</div>
            <div className="field_big">
              {/* Firm list */}
              <FirmsList
                parentobj={parentobj}
                setParentobj={setParentobj}
                FirmRef={FirmRef}
                NextElemRef={PartyRef}
              />
              {/* Firm list */}
            </div>
            <div className="caption_voc">Party</div>
            <div className="field_big">
              {/* parties list */}
              <PartiesList
                childobj={parentobj}
                setChildobj={setParentobj}
                PartyRef={PartyRef}
                NextElemRef={DueRef}
                DueRef={DueRef}
                DateRef={DateRef}
              />
              {/* parties list */}
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          {/* second row started */}
          <div className="page_caption_area">
            <div className="caption_voc">Due</div>
            {/* <div className={SaleStyle.field_text + " " + SaleStyle.due}> */}
            <div className="field_small">
              <input
                type="text"
                ref={DueRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Due: e.target.value })
                }
                value={parentobj.Due !== null ? parentobj.Due : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">PO#.</div>
            <div className="field_small">
              <input
                type="text"
                ref={PORef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, PO: e.target.value })
                }
                value={parentobj.PO !== null ? parentobj.PO : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">SaleMan</div>
            <div className="field_big">
              {/* saleman list */}
              <SalemanList
                parentobj={parentobj}
                setParentobj={setParentobj}
                SalemanRef={SalemanRef}
                NextElemRef={RemarksRef}
              />
              {/* saleman list */}
            </div>
            <div className="caption_voc">Remarks</div>
            <div className="field_big">
              <input
                type="text"
                ref={RemarksRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                className="form-control"
                onChange={(e) =>
                  setParentobj({ ...parentobj, Remarks: e.target.value })
                }
                value={parentobj.Remarks !== null ? parentobj.Remarks : ""}
              />
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          {/* third row started */}
          <div className="page_caption_area">
            <div className="caption_voc">Freight</div>
            <div className="field_small">
              <input
                type="text"
                ref={FreightRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Freight: e.target.value })
                }
                value={parentobj.Freight !== null ? parentobj.Freight : ""}
                className={SaleStyle.field_frieght_input + " form-control"}
              />
            </div>
            <div className="caption_voc">FreightTo</div>
            <div style={{ float: "left" }}>
              {parentobj.FreightType === 0 && (
                <>
                  <input
                    type="radio"
                    style={{ marginTop: "5px" }}
                    onChange={(e) =>
                      setParentobj({ ...parentobj, FreightType: 0 })
                    }
                    defaultChecked
                    name="freight"
                    value="Party"
                  />
                  &nbsp;Party &nbsp;&nbsp;&nbsp;
                  <input
                    type="radio"
                    onChange={(e) =>
                      setParentobj({ ...parentobj, FreightType: 1 })
                    }
                    name="freight"
                    value="Expense"
                  />
                  &nbsp;Expense
                </>
              )}
              {parentobj.FreightType === 1 && (
                <>
                  <input
                    type="radio"
                    style={{ marginTop: "5px" }}
                    onChange={(e) =>
                      setParentobj({ ...parentobj, FreightType: 0 })
                    }
                    name="freight"
                    value="Party"
                  />
                  &nbsp;Party &nbsp;&nbsp;&nbsp;
                  <input
                    type="radio"
                    defaultChecked
                    onChange={(e) =>
                      setParentobj({ ...parentobj, FreightType: 1 })
                    }
                    name="freight"
                    value="Expense"
                  />
                  &nbsp;Expense
                </>
              )}
            </div>

            <StatusField Status={parentobj.Status} />

            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          {/* fourth row started */}
          <div className="page_caption_area">
            <div className="caption_voc">OutTime</div>
            <div className="field_small">
              <input
                type="text"
                ref={OuttimeRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, IOTime: e.target.value })
                }
                value={parentobj.IOTime !== null ? parentobj.IOTime : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">ByPerson</div>
            <div className="field_small">
              <input
                type="text"
                ref={PersonRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, ByPerson: e.target.value })
                }
                value={parentobj.ByPerson !== null ? parentobj.ByPerson : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">Vehicle#</div>
            <div className="field_small">
              <input
                type="text"
                ref={VehicleRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Vehicle: e.target.value })
                }
                value={parentobj.Vehicle !== null ? parentobj.Vehicle : ""}
                className="form-control"
              />
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="panel panel-default transactions_section">
            <div className="printing_area">
              {/* Child component Area */}
              <SVTrans
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isLoading={isLoading}
                ParentObjEmpty={ParentObjEmpty}
                ProductRef={ProductRef}
                DateRef={DateRef}
                setMsg={setMsg}
                msg={msg}
                parentobj={parentobj}
                transarray={transarray}
                setTransarray={setTransarray}
                ProdList={ProdList}
                GetProdsList={GetProdsList}
                SubmitVoucher={SubmitVoucher}
                DelConfirmation={DelConfirmation}
              />
              {/* Child component Area */}
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="clearfix"></div>
      {parentobj.VocNo > 0 && <InvStats ttype={2} vocno={id} /> }
    </AnimatedPage>
  );
}

export default SV;
