import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PartiesList from "../../../Comps/PartiesList";
import DIGPackTrans1 from "./DIGPackTrans1";
import axios from "../../../AxiosInstance";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import StatusField from "../../_Shared/StatusField";
import VocNoField from "../../_Shared/VocNoField";
import InvStats from "../../_Shared/InvStat";
import DIGPackTrans2 from "./DIGPackTrans2";
import MainContainer from "../../../Comps/MainContainer";

export default function DIGPack() {
  const navigate = useNavigate();

  let { id } = useParams();

  const DateRef = useRef(null);
  const PartyRef = useRef(null);

  const ProductRef = useRef(null);
  const VocNoRef = useRef(null);
  const searchDataBtnRef = useRef(null);
  const UrlID = useRef({ id });

  let parent_tmp_obj = {
    Type: "P",
    VocNo: 0,
    Date: new Date().toISOString().slice(0, 10),
    PartyId: null,
    PartyName: null,
    Remarks: null,
    Status: 0,
    Trans: [],
  };

  let child_tmp_obj1 = {
    Id: 0,
    SrNo: 1,
    RefId: null,
    ProductId: null,
    ProdName: null,
    CategId: null,
    CategName: null,
    DNo: null,
    PUnit: null,
    PQty: null,
    Packing: null,
    Unit: null,
    Qty: null,
    Rate: null,
    Remarks: null,
    isDeleted: 0,
  };

  let child_tmp_obj2 = {
    Id: 0,
    SrNo: 1,
    RefId: null,
    ProductId: null,
    ProdName: null,
    CategId: null,
    CategName: null,
    DNo: null,
    PUnit: null,
    PQty: null,
    Packing: null,
    Unit: null,
    Qty: null,
    Rate: null,
    Remarks: null,
    isDeleted: 0,
  };

  const [parentobj, setParentobj] = useState(parent_tmp_obj);

  const [childobj1, setChildobj1] = useState(child_tmp_obj1);
  const [childobj2, setChildobj2] = useState(child_tmp_obj2);

  let [transarray1, setTransarray1] = useState([]);
  let [transarray2, setTransarray2] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [msg, setMsg] = useState({ err: "", color: "" });
  const [msg2, setMsg2] = useState({ err: "", color: "" });
  const [confirm, setConfirm] = useState(true);

  function ParentObjEmpty(vNo = 0) {
    setParentobj({ ...parent_tmp_obj, VocNo: vNo });
  }
  function ChildObjEmpty1() {
    setChildobj1(child_tmp_obj1);
  }
  function ChildObjEmpty2() {
    setChildobj2(child_tmp_obj2);
  }

  const getData = useCallback((vNo) => {
    setMsg({ ...msg, err: "", color: "" });
    if (vNo === 0) {
      UrlID.current.id = 0;
      ParentObjEmpty(); //parent obj empty
      setTransarray1([]);
      navigate(`/digpack/${UrlID.current.id}`);
      return;
    }

    setIsLoading(true);
    axios
      .get("api/digpack/" + vNo)
      .then((response) => {
        setIsLoading(false);
        if (response.data?.master?.length > 0 && response.status === 200) {
          setMsg({ ...msg, err: "", color: "" });
          setParentobj(response.data.master[0]);
          setTransarray1(response.data.detail);
          setTransarray2(response?.data?.detail2);
          navigate(`/digpack/${vNo}`);
        } else {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(vNo); //parent obj empty
          setTransarray1([]);
          setTransarray2([]);
          navigate(`/digpack/${vNo}`);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.status !== 200) {
          setMsg({ ...msg, err: "", color: "" });
          ParentObjEmpty(); //parent obj empty
          setTransarray1([]);
          setTransarray2([]);
          navigate(`/digpack/0`);
        }
      });
  }, []);

  useEffect(() => {
    document.title = "Dig Packing";
    DateRef.current && DateRef.current.focus();
    if (UrlID.current.id > 0) {
      getData(UrlID.current.id);
    } else {
      getData(0);
    }
    GetStockBal();
  }, [getData]);

  // get maximum voucher number
  function getMaxVocNo(e) {
    setIsLoading(true);
    var config = {
      method: "GET",
      url: "api/digpack/maxvocno/",
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
        PartyRef.current.focus();
        break;
    }
  }

  // Delete Voucher
  function DelVoucher(vcno) {
    // console.log(vcno);
    setIsLoading(true);
    DateRef.current && DateRef.current.focus();
    let ApiUrl = "api/digpack/" + vcno;
    var config = {
      method: "DELETE",
      url: ApiUrl,
    };
    axios(config)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          ParentObjEmpty(); // empty parent obj
          setTransarray1([]);
          setTransarray2([]);
          UrlID.current.id = 0;
          navigate(`/digpack/${UrlID.current.id}`);
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
    if (transarray1.length === 0) {
      setMsg({
        ...msg,
        err: "Voucher did not have any entry",
        color: "alert alert-warning",
      });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      setMsg2({ ...msg, err: "", color: "" });
      return true;
    }
  }
  const [data, setData] = useState([]);

  const GetStockBal = useCallback(() => {
    axios
      .get(`api/digpack/prodbal?edate=${DateRef.current.value}`)
      .then((res) => {
        setData(res.data);
      });
  }, [])

  // submit voucher
  function SubmitVoucher() {
    if (ParentValidate()) {
      let final = {
        ...parentobj,
        Trans: transarray1,
        Trans2: transarray2,
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
        url: "api/digpack",
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
            setTransarray1(response.data.detail);
            setTransarray2(response?.data?.detail2);

            if (parentobj.VocNo === 0) {
              UrlID.current.id = response.data.master[0].VocNo;
              navigate(`/digpack/${UrlID.current.id}`);
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

  function NewVoucher() {
    setMsg({ ...msg, err: "", color: "" });
    DateRef.current && DateRef.current.focus();
    ParentObjEmpty(); // empty parent obj
    ChildObjEmpty1(); // empty child obj
    ChildObjEmpty2(); // empty child obj
    setTransarray1([]);
    setTransarray2([]);
    navigate(`/digpack/0`);
  }

  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  // JSX
  return (
    <AnimatedPage>
      <MainContainer title="Party Cheques" isLoading={isLoading}>
        <span style={{ display: "none" }}>{confirm}</span>

        <Row className="mt-2 ml-sm-5 ml-md-5">
          <Col
            lg={6}
            xl={3}
            style={{ display: "contents", alignItems: "center" }}
          >
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
            <div style={{ width: "113px", display: "flex" }}>
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
            <PartiesList
              childobj={parentobj}
              setChildobj={setParentobj}
              PartyRef={PartyRef}
              NextElemRef={searchDataBtnRef}
            />
          </Col>
          <Col lg={6} xl={2}>
            <StatusField Status={parentobj.Status} />
          </Col>
        </Row>

        <div className="panel panel-default transactions_section">
          <DIGPackTrans1
            data={data}
            ChildObjEmpty1={ChildObjEmpty1}
            childobj1={childobj1}
            setChildobj1={setChildobj1}
            isLoading={isLoading}
            ParentObjEmpty={ParentObjEmpty}
            searchDataBtnRef={searchDataBtnRef}
            setMsg={setMsg}
            msg={msg}
            parentobj={parentobj}
            SubmitVoucher={SubmitVoucher}
            DelConfirmation={DelConfirmation}
            // setParentobj={setParentobj}
            transarray1={transarray1}
            setTransarray1={setTransarray1}
          />
        </div>

        <div className="panel panel-default transactions_section">
          <DIGPackTrans2
            ChildObjEmpty2={ChildObjEmpty2}
            childobj2={childobj2}
            setChildobj2={setChildobj2}
            isLoading={isLoading}
            ParentObjEmpty={ParentObjEmpty}
            ProductRef={ProductRef}
            DateRef={DateRef}
            setMsg2={setMsg2}
            msg2={msg2}
            parentobj={parentobj}
            SubmitVoucher={SubmitVoucher}
            DelConfirmation={DelConfirmation}
            // setParentobj={setParentobj}
            transarray2={transarray2}
            setTransarray2={setTransarray2}
          />
        </div>
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
          {parentobj.Status === 0 && parentobj.VocNo > 0 && (
            <input
              type="button"
              onClick={PostEntry}
              className="btn btn-info"
              value="Post Entry"
            />
          )}
          <button
            onClick={SubmitVoucher}
            disabled={isLoading}
            className="btn btn-info"
          >
            {parentobj.VocNo > 0 ? "Update" : "Post"}
          </button>
        </div>
      </MainContainer>
      {parentobj.VocNo > 0 && <InvStats ttype={1} vocno={id} />}
    </AnimatedPage>
  );
}
