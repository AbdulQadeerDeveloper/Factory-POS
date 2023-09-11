import React, { useState, useEffect, useRef, useCallback } from "react";
import PartiesList from "../../../Comps/PartiesList";
import SRVTrans from "./SRVTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FirmsList from "../../../Comps/FirmsList";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import InvStats from "../../_Shared/InvStat";

function SRV() {
  const navigate = useNavigate();

  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const ProductRef = useRef(null);
  const DateRef = useRef(null);
  const PartyRef = useRef(null);
  const FirmRef = useRef(null);
  const DelRef = useRef(null);
  const ExpRef = useRef(null);
  const PayModeRef = useRef(null);
  const RemarksRef = useRef(null);

  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "PRET",
    PartyId: null,
    PartyName: "",
    FirmId: null,
    FirmName: "",
    DeliveryDate: null,
    ExpiryDate: null,
    PaymentMode: null,
    Remarks: null,
    Status: 0,
    Trans: [],
  };

  let [transarray, setTransarray] = useState([]);
  const [parentobj, setParentobj] = useState(parent_tmp_obj);

  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });

  const [confirm, setConfirm] = useState(true);

  function ParentObjEmpty() {
    setParentobj(parent_tmp_obj);
  }

  function ConvertDateInput(date) {
    let cnv = (date = date.substring(0, 10));
    return cnv;
  }

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });

    if (vNo === 0) {
      UrlID.current.id = 0;
      ParentObjEmpty(); //parent obj empty
      setTransarray([]);
      navigate(`/srv/${UrlID.current.id}`);
      return;
    }

    setIsLoading(true);
    axios
      .get("api/sret/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          let upd_date = ConvertDateInput(response.data[0].Date);
          setParentobj({
            ...parentobj,
            VocNo: response.data[0].VocNo,
            Date: upd_date,
            TType: response.data[0].TType,
            PartyId: response.data[0].PartyId,
            PartyName: response.data[0].PartyName,
            FirmId: response.data[0].FirmId,
            FirmName: response.data[0].FirmName,
            DeliveryDate:
              response.data[0].DeliveryDate !== null
                ? response.data[0].DeliveryDate
                : null,
            ExpiryDate:
              response.data[0].ExpiryDate !== null
                ? response.data[0].ExpiryDate
                : null,
            PaymentMode: response.data[0].PaymentMode,
            Remarks: response.data[0].Remarks,
            Status: response.data[0].Status,
          });
          setTransarray(response.data[0].Trans);
          navigate(`/srv/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/srv/0`);
        }
      })
      .catch((err) => {
        if (err.response.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/srv/0`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = "SRV";
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    localStorage.removeItem("upd-sr");
  }, [getData]);

  // get maximum voucher number
  function getMaxVocNo() {
    var config = {
      method: "GET",
      url: "api/sret/maxvocno/",
      header: { "Content-Type": "application/json" },
    };
    setIsLoading(true);
    axios(config).then((response) => {
      setIsLoading(false);
      if (response.status === 200) {
        const maxVNo = response.data;
        if (maxVNo > 0) {
          getData(maxVNo);
        }
      }
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
    } else if (DelRef.current === document.activeElement) {
      ExpRef.current && ExpRef.current.focus();
    } else if (ExpRef.current === document.activeElement) {
      PayModeRef.current && PayModeRef.current.focus();
    } else if (PayModeRef.current === document.activeElement) {
      RemarksRef.current && RemarksRef.current.focus();
    } else if (RemarksRef.current === document.activeElement) {
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    // console.log(vcno);
    ProductRef.current && ProductRef.current.focus();
    let ApiUrl = "api/sret/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    setIsLoading(true);
    axios(config).then((response) => {
      setIsLoading(false);
      if (response.status === 200) {
        ParentObjEmpty(); // parent obj empty
        setTransarray([]);
        UrlID.current.id = 0;
        navigate(`/srv/${UrlID.current.id}`);
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
        err: "Vocher did not have any entry!",
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
        DeliveryDate: parentobj.DeliveryDate,
        ExpiryDate: parentobj.ExpiryDate,
        PartyId: parentobj.PartyId,
        PartyName: parentobj.PartyName,
        FirmId: parentobj.FirmId,
        FirmName: parentobj.FirmName,
        PaymentMode: parentobj.PaymentMode,
        Remarks: parentobj.Remarks,
        Trans: transarray,
      };
      console.log(final);

      let ApiMethod = "";
      if (parentobj.VocNo === 0) {
        ApiMethod = "POST";
      } else {
        ApiMethod = "PUT";
      }

      var config = {
        method: ApiMethod,
        url: "api/sret",
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
            let upd_date = ConvertDateInput(response.data[0].Date);
            setParentobj({
              ...parentobj,
              VocNo: response.data[0].VocNo,
              Date: upd_date,
              TType: response.data[0].TType,
              PartyId: response.data[0].PartyId,
              PartyName: response.data[0].PartyName,
              FirmId: response.data[0].FirmId,
              FirmName: response.data[0].FirmName,
              DeliveryDate:
                response.data[0].DeliveryDate !== null
                  ? response.data[0].DeliveryDate
                  : null,
              ExpiryDate:
                response.data[0].ExpiryDate !== null
                  ? response.data[0].ExpiryDate
                  : null,
              PaymentMode: response.data[0].PaymentMode,
              Remarks: response.data[0].Remarks,
            });
            setTransarray(response.data[0].Trans);
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data[0].VocNo;
              navigate(`/srv/${UrlID.current.id}`);
            }
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
    } else {
      ParentValidate();
    }
  }

  function SelectDate(e) {
    setParentobj({ ...parentobj, Date: e });
  }
  function DeliveryDateFn(e) {
    setParentobj({ ...parentobj, DeliveryDate: e });
  }
  function ExpiryDateFn(e) {
    setParentobj({ ...parentobj, ExpiryDate: e });
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

  return (
    <AnimatedPage>
      <div className="container-fluid main_container">
        <div className="main-div">
          <div className="bg-info panel_heading">
            Sale Return (SR) <span style={{ display: "none" }}>{confirm}</span>
          </div>
          <div className="clearfix"></div>

          <div className="page_caption_area">
            <VocNoField
              VocNoRef={VocNoRef}
              GetVocDetail={GetVocDetail}
              setParentobj={setParentobj}
              parentobj={parentobj}
              handleMouseUp={handleMouseUp}
              PlusMinusVoc={PlusMinusVoc}
              getMaxVocNo={getMaxVocNo}
            />
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
                NextElemRef={DelRef}
              />
              {/* parties list */}
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          {/* second row started */}
          <div className="page_caption_area">
            <div className="caption_voc">D.Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={DelRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => DeliveryDateFn(e.target.value)}
                value={
                  parentobj.DeliveryDate !== null ? parentobj.DeliveryDate : ""
                }
                className="form-control"
              />
            </div>
            <div className="caption_voc">Exp.Date</div>
            <div className="field_small">
              <input
                type="date"
                ref={ExpRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => ExpiryDateFn(e.target.value)}
                value={
                  parentobj.ExpiryDate !== null ? parentobj.ExpiryDate : ""
                }
                className="form-control"
              />
            </div>
            <div className="caption_voc">Pay.Mode</div>
            <div className="field_big">
              <input
                type="text"
                ref={PayModeRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, PaymentMode: e.target.value })
                }
                value={
                  parentobj.PaymentMode !== null ? parentobj.PaymentMode : ""
                }
                className="form-control"
              />
            </div>
            <div className="caption_voc">Remarks</div>
            <div className="field_big">
              <input
                type="text"
                ref={RemarksRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) =>
                  setParentobj({ ...parentobj, Remarks: e.target.value })
                }
                value={parentobj.Remarks !== null ? parentobj.Remarks : ""}
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
              <SRVTrans
                isLoading={isLoading}
                SubmitVoucher={SubmitVoucher}
                DelConfirmation={DelConfirmation}
                ParentObjEmpty={ParentObjEmpty}
                ProductRef={ProductRef}
                DateRef={DateRef}
                setMsg={setMsg}
                msg={msg}
                parentobj={parentobj}
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
      {parentobj.VocNo > 0 && <InvStats ttype={3} vocno={id} /> }
    </AnimatedPage>
  );
}

export default SRV;
