import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import PartiesList from "../../../Comps/PartiesList";
import PVTrans from "./PVTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FirmsList from "../../../Comps/FirmsList";
import PURStyle from "./pur.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import InvStats from "../../_Shared/InvStat";
import { GlobalData } from "../../../GlobalData";

function PV() {
  const navigate = useNavigate();

  let { id } = useParams();
  const contextdata = useContext(GlobalData);

  const DateRef = useRef(null);
  const PartyRef = useRef(null);
  const FirmRef = useRef(null);
  const BNoRef = useRef(null);
  const DADateRef = useRef(null);
  const BiltiRef = useRef(null);
  const RemarksRef = useRef(null);
  const FreightRef = useRef(null);
  const InTimeRef = useRef(null);
  const PersonRef = useRef(null);
  const VehicleRef = useRef(null);

  const ProductRef = useRef(null);
  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "P",
    PartyId: null,
    PartyName: null,
    FirmId: null,
    FirmName: null,
    BNo: null,
    BDate: null,
    CNo: null,
    Freight: null,
    Remarks: null,
    IOTime: null,
    ByPerson: null,
    Vehicle: null,
    Status: 0,
    Trans: [],
  };

  let [transarray, setTransarray] = useState([]);
  const [parentobj, setParentobj] = useState(parent_tmp_obj);
  const [isLoading, setIsLoading] = useState(false);

  const [msg, setMsg] = useState({ err: "", color: "" });
  const [confirm, setConfirm] = useState(true);

  function ParentObjEmpty(vNo = 0) {
    setParentobj({ ...parent_tmp_obj, VocNo: vNo, FirmId: contextdata?.firm[0]?.value, FirmName: contextdata?.firm[0]?.label });
  }

  function ConvertDateInput(date) {
    let cnv = (date = date.substring(0, 10));
    return cnv;
  }

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });

    if (vNo === 0) {
      setIsLoading(false)
      UrlID.current.id = 0;
      ParentObjEmpty(); //parent obj empty
      setTransarray([]);
      navigate(`/pv/${UrlID.current.id}`);
      return;
    }

    setIsLoading(true);
    axios
      .get("api/pur/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          let upd_date = ConvertDateInput(response.data[0].Date);
          let b_date = response.data[0].BDate
            ? ConvertDateInput(response.data[0].BDate)
            : null;
          setParentobj({
            ...parentobj,
            VocNo: response.data[0].VocNo,
            Date: upd_date,
            TType: response.data[0].TType,
            PartyId: response.data[0].PartyId,
            PartyName: response.data[0].PartyName,
            FirmId: response.data[0].FirmId,
            FirmName: response.data[0].FirmName,
            BNo: response.data[0].BNo,
            BDate: response.data[0].BDate !== null ? b_date : null,
            CNo: response.data[0].CNo,
            Freight: response.data[0].Freight,
            Remarks: response.data[0].Remarks,
            IOTime: response.data[0].IOTime,
            ByPerson: response.data[0].ByPerson,
            Vehicle: response.data[0].Vehicle,
            Status: response.data[0].Status,
          });
          setTransarray(response.data[0].Trans);
          navigate(`/pv/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(vNo); //parent obj empty
          setTransarray([]);
          navigate(`/pv/${vNo}`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/pv/0`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = 'PV';
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    localStorage.removeItem("upd-pur");
  }, [getData]);

  // get maximum voucher number
  function getMaxVocNo(e) {
    setIsLoading(true);
    var config = {
      method: "GET",
      url: "api/pur/maxvocno/",
      header: { "Content-Type": "application/json" },
    };
    axios(config)
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          const maxVNo = response.data;
          if (maxVNo > 0) {
            getData(maxVNo);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert("Error" + err.message);
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

  // handling focus on inputs
  function FocusNextInputParent(e) {
    if (e.key !== "Enter") return;
    switch (document.activeElement) {
      case DateRef.current:
        FirmRef.current ? FirmRef.current.focus() : PartyRef.current.focus()        
        break;
      case BNoRef.current:
        DADateRef.current?.focus();
        break;
      case DADateRef.current:
        BiltiRef.current?.focus();
        break;
      case BiltiRef.current:
        RemarksRef.current?.focus();
        break;
      case RemarksRef.current:
        FreightRef.current?.focus();
        break;
      case FreightRef.current:
        InTimeRef.current?.focus();
        break;
      case InTimeRef.current:
        PersonRef.current?.focus();
        break;
      case PersonRef.current:
        VehicleRef.current?.focus();
        break;
      case VehicleRef.current:
        ProductRef.current?.focus();
        break;
      default:
        break;
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    // console.log(vcno);
    setIsLoading(true);
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/pur/" + vcno;
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
          navigate(`/pv/${UrlID.current.id}`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
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
    if (transarray.length === 0) {
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
        VocNo: parentobj.VocNo,
        Date: parentobj.Date,
        PartyId: parentobj.PartyId,
        PartyName: parentobj.PartyName,
        FirmId: parentobj.FirmId,
        FirmName: parentobj.FirmName,
        BNo: parentobj.BNo,
        BDate: parentobj.BDate,
        CNo: parentobj.CNo,
        Freight: parentobj.Freight,
        Remarks: parentobj.Remarks,
        IOTime: parentobj.IOTime,
        ByPerson: parentobj.ByPerson,
        Vehicle: parentobj.Vehicle,
        Status: parentobj.Status,
        Trans: transarray,
      };
      console.log(final);

      let ApiMethod = "";
      if (parentobj.VocNo === 0) {
        ApiMethod = "POST";
      } else {
        ApiMethod = "PUT";
      }

      setIsLoading(true);

      var config = {
        method: ApiMethod,
        url: "api/pur",
        header: { "Content-Type": "application/json" },
        data: final,
      };
      axios(config)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
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
            let upd_date = ConvertDateInput(response.data[0].Date);
            let b_date = response.data[0].BDate
              ? ConvertDateInput(response.data[0].BDate)
              : null;
            setParentobj({
              ...parentobj,
              VocNo: response.data[0].VocNo,
              Date: upd_date,
              TType: response.data[0].TType,
              PartyId: response.data[0].PartyId,
              PartyName: response.data[0].PartyName,
              FirmId: response.data[0].FirmId,
              FirmName: response.data[0].FirmName,
              BNo: response.data[0].BNo,
              BDate: response.data[0].BDate !== null ? b_date : null,
              CNo: response.data[0].CNo,
              Freight: response.data[0].Freight,
              Remarks: response.data[0].Remarks,
              IOTime: response.data[0].IOTime,
              ByPerson: response.data[0].ByPerson,
              Vehicle: response.data[0].Vehicle,
              Status: response.data[0].Status,
            });
            setTransarray(response.data[0].Trans);
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data[0].VocNo;
              navigate(`/pv/${UrlID.current.id}`);
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

  function BDateFn(e) {
    setParentobj({ ...parentobj, BDate: e });
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
  //jsx
  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          {/* <div className='bg-info panel_heading'>
            IGP{isLoading ? "(Loading...)" : ""} <span style={{ display: "none" }}>{confirm}</span>
          </div> */}
          <Header title="IGP" isLoading={isLoading} />
          <span style={{ display: "none" }}>{confirm}</span>
          <div className="clearfix"></div>

          {/* <br /> */}
          <div className="page_caption_area">
            <VocNoField VocNoRef={VocNoRef} GetVocDetail={GetVocDetail} setParentobj={setParentobj} parentobj={parentobj} handleMouseUp={handleMouseUp} PlusMinusVoc={PlusMinusVoc} getMaxVocNo={getMaxVocNo} />
            <div className="caption_voc">Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={DateRef}
                onChange={(e) => SelectDate(e.target.value)}
                onKeyDown={(e) => FocusNextInputParent(e)}
                value={
                  parentobj.Date !== null
                    ? parentobj.Date
                    : new Date().toISOString().slice(0, 10)
                }
                className="form-control"
              />
            </div>
            {contextdata.firm.length > 1 && <>
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
            </>
            }
            <div className="caption_voc">Party</div>
            <div className="field_big">
              {/* parties list */}
              <PartiesList
                childobj={parentobj}
                setChildobj={setParentobj}
                PartyRef={PartyRef}
                NextElemRef={BNoRef}
              />
              {/* parties list */}
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          {/* second row started */}
          <div className="page_caption_area">
            <div className="caption_voc">DA#</div>
            <div className="field_small">
              {/* DA# list */}
              <input
                type="text"
                ref={BNoRef}
                onChange={(e) =>
                  setParentobj({ ...parentobj, BNo: e.target.value })
                }
                onKeyDown={(e) => FocusNextInputParent(e)}
                value={parentobj.BNo !== null ? parentobj.BNo : ""}
                className="form-control"
              />
              {/* DA# list */}
            </div>
            <div className="caption_voc">DA.Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={DADateRef}
                onChange={(e) => BDateFn(e.target.value)}
                onKeyDown={(e) => FocusNextInputParent(e)}
                value={parentobj.BDate !== null ? parentobj.BDate : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">Bilti#.</div>
            <div className="field_big">
              <input
                type="text"
                ref={BiltiRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, CNo: e.target.value })
                }
                value={parentobj.CNo !== null ? parentobj.CNo : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">Remarks</div>
            <div className="field_big">
              <input
                type="text"
                ref={RemarksRef}
                className="form-control"
                onKeyDown={(e) => FocusNextInputParent(e)}
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
                className={PURStyle.field_frieght_input + " form-control"}
              />
            </div>
            <div className="caption_voc">InTime</div>
            <div className="field_small">
              <input
                type="text"
                ref={InTimeRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, IOTime: e.target.value })
                }
                value={parentobj.IOTime !== null ? parentobj.IOTime : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">ByPerson</div>
            <div className="field_big">
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
            <div className="field_big">
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
          </div>
          <div className="clearfix"></div>

          {/* third row started */}

          <div className="page_caption_area">
            <StatusField Status={parentobj.Status} />
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="panel panel-default transactions_section">
            <div className="printing_area">
              {/* Child component Area */}
              <PVTrans
                isLoading={isLoading}
                ParentObjEmpty={ParentObjEmpty}
                ProductRef={ProductRef}
                DateRef={DateRef}
                setMsg={setMsg}
                msg={msg}
                parentobj={parentobj}
                SubmitVoucher={SubmitVoucher}
                DelConfirmation={DelConfirmation}
                // setParentobj={setParentobj}
                transarray={transarray}
                setTransarray={setTransarray}
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
      {parentobj.VocNo > 0 && <InvStats ttype={1} vocno={id} />}
    </AnimatedPage>
  );
}

export default PV;
