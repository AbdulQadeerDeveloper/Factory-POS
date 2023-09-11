import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../../AxiosInstance";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import BRTrans from "./BRTrans";
import ConvertDateInput from "../../../Shared_Components/ConvertDateInput";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import LegStats from "../../_Shared/LegStat";

export default function BR() {
  const type = "br";
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const UrlID = useRef({ id });
  const VocNoRef = useRef(null);
  const DateRef = useRef(null);
  const PartyRef = useRef(null);

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: type,
    Status: 0,
    Trans: [],
  };

  // objects of array for list
  let [transarray, setTransarray] = useState([]);
  const [parentobj, setParentobj] = useState(parent_tmp_obj);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  // const [handleEffect, setHandleEffect] = useState(0);
  const [confirm, setConfirm] = useState(true);

  function ParentObjEmpty() {
    setParentobj(parent_tmp_obj);
    setTransarray([]);
  }

  // function ConvertDateInput(date) {
  //   let cnv = date = date.substring(0, 10);
  //   return cnv
  // }

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });

    // console.log("callback wokring");

    if (vNo === 0) {
      // console.log("voc 0");
      ParentObjEmpty(); // get parent obj empty
      setTransarray([]);
      navigate(`/${type}/0`);
      return;
    }
    setIsLoading(true);
    axios
      .get("api/ledger/" + type + "/" + vNo)
      .then((response) => {
        // console.log(response);
        setIsLoading(false);
        if (response.data.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          let upd_date = ConvertDateInput(response.data[0].Date, true);
          setParentobj({
            ...parentobj,
            VocNo: response.data[0].VocNo,
            Date: upd_date,
            Status: response.data[0].Status,
          });
          setTransarray(response.data[0].Trans);
          navigate(`/${type}/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          setParentobj({
            ...parentobj,
            VocNo: vNo,
            Status: 0,
          });
          //ParentObjEmpty()  // get parent obj empty
          navigate(`/${type}/${vNo}`);
          setIsLoading(false);

          setTransarray([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
        console.log("false data not found");
        if (err.response.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); // get parent obj empty
          setTransarray([]);
          navigate(`/${type}/0`);
        }
      });
  }, []);

  useEffect(()=> {
    DateRef.current && DateRef.current.focus();
    if (id>0) getData(id)
    document.title = 'BR';
  },[getData])
  // // getting voucher number on Enter
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
      PartyRef.current && PartyRef.current.focus();
    }
  }

  //#region General Methods
  // Delete Voucher
  function DelVoucher(vcno) {
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/ledger/" + type + "/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config)
      .then((response) => {
        if (response.status === 200) {
          ParentObjEmpty(); // parent obj empty
          // UrlID.current.id = 0;
          navigate(`/${type}/0`);
        }
      })
      .catch(function (error) {
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
    setMsg({ ...msg, err: "", color: "" });
    if (ParentValidate()) {
      let final = {
        TType: parentobj.TType,
        VocNo: parentobj.VocNo,
        Date: parentobj.Date,
        Status: parentobj.Status,
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
        url: "api/ledger",
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
            setParentobj({ ...parentobj, VocNo: response.data[0].VocNo });
            setTransarray(response.data[0].Trans);
            if (parentobj.VocNo === 0) {
              // UrlID.current.id = response.data[0].VocNo;
              navigate(`/${type}/${response.data[0].VocNo}`);
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
    setMsg({ ...msg, err: "", color: "" });
  }

  // get maximum voucher number
  function getMaxVocNo(e) {
    var config = {
      method: "GET",
      url: "api/ledger/maxvocno/" + type,
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
        alert(err.message);
        setIsLoading(false);
      });
  }

  function handleMouseUp(e) {
    setMsg({ ...msg, err: "", color: "" });
    setParentobj({ ...parentobj, VocNo: e.target.value });
    if (UrlID.current.id !== e.target.value) {
      UrlID.current.id = e.target.value;
      e.key = "Enter";
      GetVocDetail(e);
    }
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

  //#endregion

  //JSX
  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          {/* <div className='bg-info panel_heading'>
            {
              type === 'jv' ? "JOURNAL VOUCHER"
                : type === 'bp' ? "BANK PAYMENT VOUCHER"
                  : "BANK RECEIPT VOUCHER"
            } {isLoading ? "(Loading...)": ""}<span style={{ display: "none" }}>{confirm}</span>
          </div> */}
          <Header
            title={
              type === "jv"
                ? "Journal Voucher"
                : type === "bp"
                ? "Bank Payment Voucher"
                : "Bank Receipt Voucher"
            }
            isLoading={isLoading}
          />
          <span style={{ display: "none" }}>{confirm}</span>
          <div className="clearfix"></div>

          <div className="page_caption_area">
          <VocNoField VocNoRef={VocNoRef} GetVocDetail={GetVocDetail} setParentobj={setParentobj} parentobj={parentobj} handleMouseUp={handleMouseUp} PlusMinusVoc={PlusMinusVoc} getMaxVocNo={getMaxVocNo} />

            <div className="caption_voc">Date:</div>
            <div className="field_small">
              <input
                type="date"
                ref={DateRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => SelectDate(e.target.value)}
                value={parentobj.Date}
                className="form-control"
              />
            </div>

            <StatusField Status={parentobj.Status} />

            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="panel panel-default transactions_section">
            <div className="printing_area">
              {/* Child component Area */}
              <BRTrans
                isLoading={isLoading}
                type={type}
                SubmitVoucher={SubmitVoucher}
                DelConfirmation={DelConfirmation}
                VocNoRef={VocNoRef}
                setMsg={setMsg}
                msg={msg}
                parentobj={parentobj}
                setParentobj={setParentobj}
                transarray={transarray}
                setTransarray={setTransarray}
                DateRef={DateRef}
                PartyRef={PartyRef}
              />
              {/* Child component Area */}
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="clearfix"></div>
      {parentobj.VocNo > 0 && <LegStats ttype={type} vocno={id} />}
    </AnimatedPage>
  );
}
