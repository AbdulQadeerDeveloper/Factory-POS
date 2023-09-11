import React, { useState, useEffect, useRef, useCallback } from "react";
import PartiesList from "../../../Comps/PartiesList";
import IGPTrans from "./IGPTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import POStyle from "./igp.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import VocNoField from "../../_Shared/VocNoField";

export default function IGP() {
  let { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const ProductRef = useRef(null);
  const DateRef = useRef(null);
  const PartyRef = useRef(null);
  const BNoRef = useRef(null);
  const CNoRef = useRef(null);
  const RemarksRef = useRef(null);

  const VocNoRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "IGP",
    PartyId: null,
    PartyName: "",
    BNo: null,
    CNo: null,
    Remarks: null,
    Trans: [],
  };

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    ProductId: null,
    ProdName: "",
    Description: "",
    PQty: null,
    PUnit: null,
    Packing: null,
    Qty: null,
    Unit: null,
    ProDesc: null,
    isDeleted: 0,
  };

  const [childobj, setChildobj] = useState(child_tmp_obj);

  function ChildObjEmpty() {
    setChildobj(child_tmp_obj);
    ProductRef.current.value = "";
  }

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
      navigate(`/igp/${UrlID.current.id}`);
      return;
    }
    setIsLoading(true);

    axios
      .get("api/igp/" + vNo)
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
            BNo: response.data[0].BNo !== null ? response.data[0].BNo : null,
            CNo: response.data[0].CNo !== null ? response.data[0].CNo : null,
            Remarks: response.data[0].Remarks,
          });
          setTransarray(response.data[0].Trans);
          navigate(`/igp/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setParentobj({
            ...parentobj,
            VocNo: vNo,
            Date: new Date().toISOString().slice(0, 10),
            status: 0,
            PartyId: null,
            PartyName: null,
          });
          setTransarray([]);
          navigate(`/igp/${vNo}`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setParentobj({
            ...parentobj,
            VocNo: vNo,
            Date: new Date().toISOString().slice(0, 10),
            status: 0,
            PartyId: null,
            PartyName: null,
          });
          setTransarray([]);
          navigate(`/igp/${vNo}`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = 'IGP';
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    localStorage.removeItem("upd-po");
  }, [getData]);

  // New Voucher clean every state
  function NewVoucher() {
    setMsg({ ...msg, err: "", color: "" });
    DateRef.current && DateRef.current.focus();
    ParentObjEmpty(); // parent obj empty
    ChildObjEmpty(); // child obj empty
    setTransarray([]);
    navigate(`/igp/0`);
  }

  // get maximum voucher number
  function getMaxVocNo() {
    setIsLoading(true);
    var config = {
      method: "GET",
      url: "api/igp/maxvocno/",
      header: { "Content-Type": "application/json" },
    };
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
      PartyRef.current && PartyRef.current.focus();
    } else if (BNoRef.current === document.activeElement) {
      CNoRef.current && CNoRef.current.focus();
    } else if (CNoRef.current === document.activeElement) {
      RemarksRef.current && RemarksRef.current.focus();
    } else if (RemarksRef.current === document.activeElement) {
      ProductRef.current && ProductRef.current.focus();
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    // console.log(vcno);
    ProductRef.current && ProductRef.current.focus();
    let ApiUrl = "api/igp/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config).then((response) => {
      if (response.status === 200) {
        ParentObjEmpty(); // parent obj empty
        setTransarray([]);
        UrlID.current.id = 0;
        navigate(`/igp/${UrlID.current.id}`);
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
        BNo: parentobj.BNo,
        CNo: parentobj.CNo,
        PartyId: parentobj.PartyId,
        PartyName: parentobj.PartyName,
        Remarks: parentobj.Remarks,
        Trans: transarray,
      };
      console.log(final);
      setIsLoading(true);

      let ApiMethod = "";
      if (parentobj.VocNo === 0) {
        ApiMethod = "POST";
      } else {
        ApiMethod = "PUT";
      }

      var config = {
        method: ApiMethod,
        url: "api/igp",
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
            setParentobj({
              ...parentobj,
              VocNo: response.data[0].VocNo,
              Date: upd_date,
              TType: response.data[0].TType,
              PartyId: response.data[0].PartyId,
              PartyName: response.data[0].PartyName,
              BNo: response.data[0].BNo !== null ? response.data[0].BNo : null,
              CNo: response.data[0].CNo !== null ? response.data[0].CNo : null,
              Remarks: response.data[0].Remarks,
            });
            setTransarray(response.data[0].Trans);
            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data[0].VocNo;
              navigate(`/igp/${UrlID.current.id}`);
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
  function BNoFn(e) {
    setParentobj({ ...parentobj, BNo: e });
  }
  function CNoFn(e) {
    setParentobj({ ...parentobj, CNo: e });
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
          {/* <div className="bg-info panel_heading">
            IGP {isLoading ? "(Loading...)" : ""}{" "}
            <span style={{ display: "none" }}>{confirm}</span>
          </div> */}
          <Header title="IGP" isLoading={isLoading} />
          <span style={{ display: "none" }}>{confirm}</span>
          <div className="clearfix"></div>

          <div className="page_caption_area">
            <VocNoField VocNoRef={VocNoRef} GetVocDetail={GetVocDetail} setParentobj={setParentobj} parentobj={parentobj} handleMouseUp={handleMouseUp} PlusMinusVoc={PlusMinusVoc} getMaxVocNo={getMaxVocNo} />

            <div className="caption_voc">Date</div>
            <div className={POStyle.field_date}>
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
            <div className={POStyle.caption_party}>Party</div>
            <div className={POStyle.field_party}>
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
            <div className={POStyle.caption_ddate}>B.No</div>
            <div className={POStyle.field_ddate}>
              <input
                type="text"
                ref={BNoRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => BNoFn(e.target.value)}
                value={parentobj.BNo !== null ? parentobj.BNo : ""}
                className="form-control"
              />
            </div>
            <div className={POStyle.caption_exdate}>C.No</div>
            <div className={POStyle.field_exdate}>
              <input
                type="text"
                ref={CNoRef}
                onKeyDown={(e) => FocusNextInputParent(e)}
                onChange={(e) => CNoFn(e.target.value)}
                value={parentobj.CNo !== null ? parentobj.CNo : ""}
                className="form-control"
              />
            </div>
            <div className={POStyle.caption_party}>Remarks</div>
            <div className={POStyle.field_party}>
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
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="panel panel-default transactions_section">
            <div className="printing_area">
              {/* Child component Area */}
              <IGPTrans
                isLoading={isLoading}
                ChildObjEmpty={ChildObjEmpty}
                childobj={childobj}
                setChildobj={setChildobj}
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
              <div className="clearfix"></div>
              {msg.err !== "" && (
                <>
                  <div className="msg_div">
                    <div className={msg.color} role="alert">
                      <span className="alert-link">{msg.err}</span>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                </>
              )}

              <div className="voc_btn_bottom">
                <input
                  type="button"
                  onClick={() => DelConfirmation(parentobj.VocNo)}
                  disabled={parentobj.VocNo === 0 ? true : false}
                  className="btn btn-danger"
                  value="Delete Voc"
                />
                <input
                  type="button"
                  onClick={NewVoucher}
                  className="btn btn-info"
                  value="New Voc"
                />
                <button
                  // onClick={handlePrint}
                  className="btn btn-info"
                >
                  Print
                </button>
                <button
                  onClick={SubmitVoucher}
                  disabled={isLoading}
                  className="btn btn-info"
                >
                  {parentobj.VocNo > 0 ? "Update" : "Post"}
                </button>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="clearfix"></div>
    </AnimatedPage>
  );
}
