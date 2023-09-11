import React, { useState, useEffect, useRef, useCallback } from "react";
import PartiesList from "../../../Comps/PartiesList";
import GPVTrans from "./GPVTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PURStyle from "./gpv.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import InvStats from "../../_Shared/InvStat";

export default function GPV() {
  const navigate = useNavigate();

  let { id } = useParams();

  const DateRef = useRef(null);
  const PartyRef = useRef(null);
  const TypeRef = useRef(null);
  const BNoRef = useRef(null);
  const BDateRef = useRef(null);
  const MDateRef = useRef(null);
  const RemarksRef = useRef(null);
  const LoomRef = useRef(null);
  const DueRef = useRef(null);

  const ProductRef = useRef(null);
  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    Type: "R",
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    BDate: null,
    MDate: null,
    PartyId: null,
    PartyName: null,
    PartyDesc: null,
    BNo: null,
    Due: null,
    Remarks: null,
    Loom: null,
    Status: 0,
    Trans: [],
  };

  let [transarray, setTransarray] = useState([]);
  const [parentobj, setParentobj] = useState(parent_tmp_obj);
  const [isLoading, setIsLoading] = useState(false);

  const [msg, setMsg] = useState({ err: "", color: "" });
  const [confirm, setConfirm] = useState(true);

  function ParentObjEmpty(vNo = 0) {
    setParentobj({ ...parent_tmp_obj, VocNo: vNo });
  }

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });
    if (vNo === 0) {
      UrlID.current.id = 0;
      ParentObjEmpty(); //parent obj empty
      setTransarray([]);
      navigate(`/gpv/${UrlID.current.id}`);
      return;
    }

    setIsLoading(true);
    axios
      .get("api/greypur/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data?.master?.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          setParentobj(response.data.master[0]);
          setTransarray(response.data.detail);
          navigate(`/gpv/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(vNo); //parent obj empty
          setTransarray([]);
          navigate(`/gpv/${vNo}`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/gpv/0`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = 'GPV';
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
      url: "api/greypur/maxvocno/",
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
        PartyRef.current.focus()
        break;
      case TypeRef.current:
        PartyRef.current.focus()
        break;
      case BNoRef.current:
        BDateRef.current?.focus();
        break;
      case BDateRef.current:
        MDateRef.current?.focus();
        break;
      case MDateRef.current:
        LoomRef.current?.focus();
        break;
      case LoomRef.current:
        RemarksRef.current?.focus();
        break;
      case RemarksRef.current:
        DueRef.current?.focus();
        break;
      case DueRef.current:
        ProductRef.current?.focus();
        break;
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    // console.log(vcno);
    setIsLoading(true);
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/greypur/" + vcno;
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
          navigate(`/gpv/${UrlID.current.id}`);
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
        ...parentobj,
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
        url: "api/greypur",
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
            setParentobj(response.data.master[0]);
            setTransarray(response.data.detail);
  
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data.master[0].VocNo;
              navigate(`/gpv/${UrlID.current.id}`);
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
  function MDateFn(e) {
    setParentobj({ ...parentobj, MDate: e });
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
          <Header title="Greige Purchase" isLoading={isLoading} />
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
            <div className="caption_voc">Type</div>
            <div className="field_big">
              {/* parties list */}
              <select tabIndex={-1} value={parentobj.Type} onChange={(e)=> setParentobj({ ...parentobj, Type: e.target.value})} ref={TypeRef} className="form-control" style={{ fontSize: "12px", width: "100%" }} onKeyDown={(e) => FocusNextInputParent(e)}>
                <option value="R">R</option>
                <option value="P">P</option>
              </select>
              {/* parties list */}
            </div>
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
            <div className="caption_voc">Bill.No</div>
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
            <div className="caption_voc">B.Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={BDateRef}
                onChange={(e) => BDateFn(e.target.value)}
                onKeyDown={(e) => FocusNextInputParent(e)}
                value={parentobj.BDate !== null ? parentobj.BDate : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">Loom: </div>
            <div className="field_big">
              <input
                type="text"
                ref={LoomRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Loom: e.target.value })
                }
                value={parentobj.Loom !== null ? parentobj.Loom : ""}
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
          <div className="caption_voc">M.Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={MDateRef}
                onChange={(e) => MDateFn(e.target.value)}
                onKeyDown={(e) => FocusNextInputParent(e)}
                value={parentobj.MDate !== null ? parentobj.MDate : ""}
                className="form-control"
              />
            </div>
            <div className="caption_voc">Due</div>
            <div className="field_small">
              <input
                type="text"
                ref={DueRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Due: e.target.value })
                }
                value={parentobj.Due !== null ? parentobj.Due : ""}
                className={PURStyle.field_frieght_input + " form-control"}
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
              <GPVTrans
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

