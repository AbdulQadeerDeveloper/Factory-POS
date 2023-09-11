import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import PartiesList from "../../../Comps/PartiesList";
import POTrans from "./POTrans";
import axios from "../../../AxiosInstance";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FirmsList from "../../../Comps/FirmsList";
import { useNavigate } from "react-router-dom";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import VocNoField from "../../_Shared/VocNoField";
import { GlobalData } from "../../../GlobalData";
import PrintPO from "../../../Prints/StkPrints/PrintPO";
import { useReactToPrint } from "react-to-print";

export default function PO() {
  let { id } = useParams();
  const navigate = useNavigate();

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
  const contextdata = useContext(GlobalData);

  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Purchase Order",
    pageStyle: pageStyle,
  });

  let parent_tmp_obj = {
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    TType: "PO",
    PartyId: null,
    PartyName: "",
    FirmId: null,
    FirmName: "",
    DeliveryDate: null,
    ExpiryDate: null,
    PaymentMode: null,
    Remarks: null,
    Trans: [],
  };

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    ProductId: null,
    ProdName: "",
    PQty: null,
    PUnit: null,
    Packing: null,
    Qty: null,
    Unit: null,
    Rate: null,
    GSTPer: null,
    AdvPer: null,
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
      navigate(`/po/${UrlID.current.id}`);
      return;
    }
    setIsLoading(true);

    axios
      .get("api/po/" + vNo)
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
          });
          setTransarray(response.data[0].Trans);
          navigate(`/po/${vNo}`);
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
            FirmId: null,
            FirmName: null,
          });
          setTransarray([]);
          navigate(`/po/${vNo}`);
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
            FirmId: null,
            FirmName: null,
          });
          setTransarray([]);
          navigate(`/po/${vNo}`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = "PO";
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
    navigate(`/po/0`);
  }

  // get maximum voucher number
  function getMaxVocNo() {
    setIsLoading(true);
    var config = {
      method: "GET",
      url: "api/po/maxvocno/",
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
    let ApiUrl = "api/po/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config).then((response) => {
      if (response.status === 200) {
        ParentObjEmpty(); // parent obj empty
        setTransarray([]);
        UrlID.current.id = 0;
        navigate(`/po/${UrlID.current.id}`);
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
      setIsLoading(true);

      let ApiMethod = "";
      if (parentobj.VocNo === 0) {
        ApiMethod = "POST";
      } else {
        ApiMethod = "PUT";
      }

      var config = {
        method: ApiMethod,
        url: "api/po",
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
              navigate(`/po/${UrlID.current.id}`);
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
          {/* <div className="bg-info panel_heading">
            Purchase Order (PO){isLoading ? "(Loading...)" : ""}{" "}
            <span style={{ display: "none" }}>{confirm}</span>
          </div> */}
          <Header title="Purchase Order (PO)" isLoading={isLoading} />
          <span style={{ display: "none" }}>{confirm}</span>
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

            <div className="caption_voc">PO Date</div>
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
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="panel panel-default transactions_section">
            <div className="printing_area">
              {/* Child component Area */}
              <POTrans
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
                <button onClick={handlePrint} className="btn btn-info">
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
      <div>
        <PrintPO
          contextdata={contextdata && contextdata}
          parentobj={parentobj}
          transarray={transarray}
          componentRef={componentRef}
          docTitle={"Purchases Order"}
        />
      </div>
    </AnimatedPage>
  );
}
