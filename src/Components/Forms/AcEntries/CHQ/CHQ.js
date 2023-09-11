import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import CPBTrans from "./CPBTrans";
import PartiesList from "../../../Comps/PartiesList";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import ChqStats from "../../_Shared/ChqStat";
import { Col, Container, Row } from "react-bootstrap";
import MainContainer from "../../../Comps/MainContainer";

export default function CHQ() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let { id } = useParams();

  const DateRef = useRef(null);
  const PartyRef = useRef(null);
  const BankRef = useRef(null);
  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "CPB",
    PartyId: null,
    PartyName: "",
    Status: 0,
    Trans: [],
  };

  // objects of array for list
  let [transarray, setTransarray] = useState([]);
  const [parentobj, setParentobj] = useState(parent_tmp_obj);

  const [msg, setMsg] = useState({ err: "", color: "" });
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
      navigate(`/chq/${UrlID.current.id}`);
      return;
    }
    setIsLoading(true);
    axios
      .get("api/cpb/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          let upd_date = ConvertDateInput(response.data[0].Date);
          setParentobj({
            ...parentobj,
            VocNo: response.data[0].VocNo,
            Date: upd_date,
            TType: "CPB",
            Status: response.data[0].Status,
            PartyId: response.data[0].PartyId,
            PartyName: response.data[0].PartyName,
          });
          setTransarray(response.data[0].Trans);
          navigate(`/chq/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/chq/0`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray([]);
          navigate(`/chq/0`);
        }
      });
  }, []);

  useEffect(() => {
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    localStorage.removeItem("upd-cpb");
  }, [getData]);

  // get maximum voucher number
  function getMaxVocNo() {
    setIsLoading(true);

    var config = {
      method: "GET",
      url: "api/cpb/maxvocno",
      header: { "Content-Type": "application/json" },
    };
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
    setMsg({ ...msg, err: "", color: "" });
    setParentobj({ ...parentobj, VocNo: e.target.value });
    if (UrlID.current.id !== e.target.value) {
      UrlID.current.id = e.target.value;
      e.key = "Enter";
      GetVocDetail(e);
    }
  }

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

  // Delete Voucher
  function DelVoucher(vcno) {
    setIsLoading(true);
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/cpb/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config).then((response) => {
      setIsLoading(false);
      if (response.status === 200) {
        ParentObjEmpty(); //parent obj empty
        setTransarray([]);
        UrlID.current.id = 0;
        navigate(`/chq/${UrlID.current.id}`);
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
        TType: parentobj.TType,
        VocNo: parentobj.VocNo,
        Date: parentobj.Date,
        PartyId: parentobj.PartyId,
        PartyName: parentobj.PartyName,
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
        url: "api/cpb",
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
              TType: "CPB",
              Status: response.data[0].Status,
              PartyId: response.data[0].PartyId,
              PartyName: response.data[0].PartyName,
            });
            setTransarray(response.data[0].Trans);
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data[0].VocNo;
              navigate(`/chq/${UrlID.current.id}`);
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
    setMsg({ ...msg, err: "", color: "" });
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

  return (
    <AnimatedPage>

      <MainContainer title="Party Cheques" isLoading={isLoading}>
        <span style={{ display: "none" }}>{confirm}</span>
        <Row className="mt-2 ml-sm-5 ml-md-5">
          <Col lg={6} xl={3} style={{ display: "contents", alignItems: "center" }}>
            <VocNoField
              VocNoRef={VocNoRef}
              GetVocDetail={GetVocDetail}
              setParentobj={setParentobj}
              parentobj={parentobj}
              handleMouseUp={handleMouseUp}
              PlusMinusVoc={PlusMinusVoc}
              getMaxVocNo={getMaxVocNo}
            />
          </Col>
          <Col lg={6} xl={2}>
            <div className="caption_voc">Date</div>
            <div style={{ width: '113px', display: 'flex' }}>
              <input
                type="date"
                onChange={(e) => SelectDate(e.target.value)}
                onKeyDown={(e) => FocusNextInputParent(e)}
                ref={DateRef}
                value={parentobj.Date}
                className="form-control"
              />
            </div>
          </Col>
          <Col lg={6} xl={5}>
            <div className="caption_voc">Party</div>
            <div className="" style={{ width: "450px" }}>
              <PartiesList
                childobj={parentobj}
                setChildobj={setParentobj}
                PartyRef={PartyRef}
                NextElemRef={BankRef}
              />
            </div>
          </Col>
          <Col lg={6} xl={2}>
            <StatusField Status={parentobj.Status} />
          </Col>
        </Row>

        <div className="panel panel-default transactions_section">
          <div className="printing_area">
            {/* Child component Area */}
            <CPBTrans
              isLoading={isLoading}
              SubmitVoucher={SubmitVoucher}
              DelConfirmation={DelConfirmation}
              VocNoRef={VocNoRef}
              setMsg={setMsg}
              msg={msg}
              parentobj={parentobj}
              setParentobj={setParentobj}
              transarray={transarray}
              setTransarray={setTransarray}
              ParentObjEmpty={ParentObjEmpty}
              BankRef={BankRef}
              DateRef={DateRef}
            />
            {/* Child component Area */}
          </div>
        </div>
      </MainContainer>
      <ChqStats ttype={1} vocno={id} />
    </AnimatedPage>
  );
}
