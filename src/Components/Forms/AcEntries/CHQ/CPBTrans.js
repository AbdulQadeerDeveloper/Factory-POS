import React, { useState, useRef } from "react";
import CashList from "../../../Comps/CashList";
import BanksList from "../../../Comps/BanksList";
import Currency from "../../../Shared_Components/Currency";
import { useReactToPrint } from "react-to-print";
import ConvertDateInput from "../../../Shared_Components/ConvertDateInput";
import { useNavigate } from "react-router-dom";
import CHQPrint from "../../../Prints/AcPrints/CHQPrint";
import CurrencyField from "../../../Controls/CurrencyField";
import TextField from "../../../Controls/TextField";

export default function CPBTrans(props) {
  const navigate = useNavigate();

  const {
    isLoading,
    BankRef,
    DateRef,
    transarray,
    setTransarray,
    msg,
    setMsg,
    DelConfirmation,
    SubmitVoucher,
    parentobj,
    ParentObjEmpty,
  } = props;

  const ChqRef = useRef(null);
  const DatedRef = useRef(null);
  const NarrationRef = useRef(null);
  const CreditRef = useRef(null);
  const CashInHandRef = useRef(null);
  const IsActualRef = useRef(null);
  const EnterRef = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    BankId: null,
    BankName: "",
    CPB: null,
    CHQNo: null,
    Dated: new Date().toISOString().slice(0, 10),
    Description: "",
    NetCredit: null,
    IssueTo: null,
    IssueToName: "",
    isAct: false,
    isDeleted: 0,
  };

  const [childobj, setChildobj] = useState(child_tmp_obj);

  function ChildObjEmpty() {
    setChildobj(child_tmp_obj);
  }

  let total = 0;
  let tmptotal = 0;

  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "CHQ",
    pageStyle: pageStyle,
  });

  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  // handling focus on inputs
  function FocusNextInputChild(e) {
    if (e?.key !== "Enter") return;
    if (ChqRef.current === document.activeElement) {
      DatedRef.current && DatedRef.current.focus();
    } else if (DatedRef.current === document.activeElement) {
      CashInHandRef.current && CashInHandRef.current.focus();
    } else if (CashInHandRef.current === document.activeElement) {
      IsActualRef.current && IsActualRef.current.focus();
    } else if (IsActualRef.current === document.activeElement) {
      if (e.key === " ") {
        CheckBoxFunc();
      } else {
        NarrationRef.current && NarrationRef.current.focus();
      }
    } else if (NarrationRef.current === document.activeElement) {
      CreditRef.current && CreditRef.current.focus();
    } else if (CreditRef.current === document.activeElement) {
      if (childobj.NetCredit !== null && childobj.NetCredit !== "") {
        if (localStorage.getItem("upd-cpb")) {
          UpdatedSingle();
        } else {
          AddSingle();
        }
        BankRef.current && BankRef.current.focus();
      } else {
        CreditRef.current && CreditRef.current.focus();
      }
    }
  }

  // useEffect(() => {
  //     // console.log(transarray);
  //     if (updatedchild === 1) {
  //         UpdatedSingle();
  //         setUpdatedchild(0);
  //     }
  //     if (addchild === 1) {
  //         AddSingle()
  //         setAddchild(0);
  //     }
  // }, [updatedchild, addchild])

  // object validation before insert and update
  function HandleValidate() {
    if (childobj.BankId === "") {
      setMsg({ ...msg, err: "Bank is required", color: "alert alert-warning" });
    } else if (childobj.NetCredit === null) {
      setMsg({
        ...msg,
        err: "Credit Amount is required",
        color: "alert alert-warning",
      });
    } else {
      setMsg({ ...msg, err: "", color: "" });
      return true;
    }
  }

  // insert objects into array
  function AddSingle() {
    if (HandleValidate()) {
      // console.log(childobj);
      const val = [...transarray];
      let lngth = val.length;
      val.push({
        ...childobj,
        Id: childobj.Id,
        SrNo: lngth + 1,
        BankId: childobj.BankId,
        BankName: childobj.BankName,
        CPB: childobj.CPB,
        CHQNo: childobj.CHQNo,
        Dated: childobj.Dated,
        Description: childobj.Description,
        NetCredit: childobj.NetCredit,
        IssueTo: childobj.IssueTo,
        IssueToName: childobj.IssueToName,
        isAct: childobj.isAct,
        isDeleted: 0,
      });
      // val.splice(0, 0, childobj);
      setTransarray(val);
      // setChildobj({ Id: 0, SrNo: 1, BankId: null, BankName: '', CPB: null, CHQNo: null, Dated: new Date().toISOString().slice(0, 10), Description: "", NetCredit: null, IssueTo: null, IssueToName: "", isAct: false, isDeleted: 0 });
      ChildObjEmpty(); //child obj empty
      BankRef.current && BankRef.current.focus();
    }
  }

  // get selected object for updation
  function UpdSingle(index) {
    const val = [...transarray];
    let myObj = val.find((obj, i) => i === index);
    setChildobj({
      ...childobj,
      Id: myObj.Id,
      SrNo: 1,
      BankId: myObj.BankId,
      BankName: myObj.BankName,
      CPB: myObj.CPB,
      CHQNo: myObj.CHQNo,
      Dated: new Date().toISOString().slice(0, 10),
      Description: myObj.Description,
      NetCredit: myObj.NetCredit,
      IssueTo: myObj.IssueTo,
      IssueToName: myObj.IssueToName,
      isAct: myObj.isAct,
      isDeleted: 0,
    });
    let localarr = [];
    localarr.push({ index }, myObj);
    localStorage.setItem("upd-cpb", JSON.stringify(localarr));
    setMsg({ ...msg, err: "", color: "" });
    CreditRef.current && CreditRef.current.focus();
  }

  // update selected object from array
  function UpdatedSingle() {
    if (HandleValidate()) {
      let data = JSON.parse(localStorage.getItem("upd-cpb"));
      const val = [...transarray];
      val.splice(data[0].index, 1, childobj);
      // console.log(val);
      localStorage.removeItem("upd-cpb");
      // setChildobj({ Id: 0, SrNo: 1, BankId: null, BankName: '', CPB: null, CHQNo: null, Dated: new Date().toISOString().slice(0, 10), Description: "", NetCredit: null, IssueTo: null, IssueToName: "", isAct: false, isDeleted: 0 });
      ChildObjEmpty(); //child obj empty
      setTransarray(val);
      setMsg({ ...msg, err: "", color: "" });
      BankRef.current && BankRef.current.focus();
    }
  }

  // remove object from array
  function RemSingle(index) {
    setMsg({ ...msg, err: "", color: "" });
    const val = [...transarray];
    if (parentobj.VocNo === 0) {
      val.splice(index, 1);
    }
    if (parentobj.VocNo !== 0) {
      if (val.length > 0) {
        let delObj = val.find((obj, i) => i === index);
        if (delObj.Id === 0) {
          val.splice(index, 1);
        } else {
          delObj = {
            Id: delObj.Id,
            SrNo: delObj.SrNo,
            BankId: delObj.BankId,
            BankName: delObj.BankName,
            CPB: delObj.CPB,
            CHQNo: delObj.CHQNo,
            Dated: delObj.Dated,
            Description: delObj.Description,
            NetCredit: delObj.NetCredit,
            IssueTo: delObj.IssueTo,
            IssueToName: delObj.IssueToName,
            isAct: delObj.isAct,
            isDeleted: 1,
          };
          val.splice(index, 1, delObj);
        }
      }
    }
    setTransarray(val);
    BankRef.current && BankRef.current.focus();
  }

  // New Voucher clean every state
  function NewVoucher() {
    setMsg({ ...msg, err: "", color: "" });
    DateRef.current && DateRef.current.focus();
    ParentObjEmpty(); //parent obj empty
    ChildObjEmpty(); //child obj empty
    setTransarray([]);
    navigate(`/chq/0`);
  }

  function AmountFun(e) {
    let amount = parseInt(e.target.value, 10);
    if (isNaN(amount)) {
      setChildobj({ ...childobj, NetCredit: null });
    } else {
      setChildobj({ ...childobj, NetCredit: amount });
    }
  }

  function CheckBoxFunc() {
    NarrationRef.current && NarrationRef.current.focus();
    if (childobj.isAct === false) {
      setChildobj({ ...childobj, isAct: true });
    } else {
      setChildobj({ ...childobj, isAct: false });
    }
  }

  return (
    <div>
      <div>
        <div className="parentinfoprintcpcr">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th
                        className="col-md-4"
                        style={{ textAlign: "left", background: "orange" }}
                      >
                        VOC # {parentobj.VocNo}
                      </th>
                      <th
                        className="col-md-4"
                        style={{ textAlign: "right", background: "green" }}
                      >
                        Type: {parentobj.TType}
                      </th>
                      <th
                        className="col-md-4"
                        style={{ textAlign: "right", background: "orange" }}
                      >
                        Date: {parentobj.Date}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="clearfix"></div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <table
                  className="trialbalancetable"
                  style={{ width: "35%", margin: "0 auto" }}
                >
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div
                          style={{
                            fontSize: "12px",
                            width: "70%",
                            margin: "0 auto",
                            borderBottom: "2px solid darkgrey",
                            marginTop: "0px",
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>
                            Party: {parentobj.PartyName} ( {parentobj.PartyId} )
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
          </div>
        </div>
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr className="heading_without_print">
              <th className="bg-color text-center">ID</th>
              <th className="bg-color text-center">SrNo</th>
              <th
                className="bg-color text-center col-xs-1"
                style={{ verticalAlign: "middle" }}
                colSpan=""
              >
                Bank
              </th>
              <th className="bg-color text-center">CPB</th>
              <th className="bg-color text-center">CHQNo</th>
              <th className="bg-color text-center">Dated</th>
              <th className="bg-color col-xs-2 text-center">IssueTo</th>
              <th className="bg-color col-xs-1 text-center">IsAct</th>
              <th className="bg-color col-xs-2 text-left">Description</th>
              <th className="bg-color col-xs-1 text-center">Credit</th>
              <th className="bg-color col-xs-1 action_without_print">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="entry_row add_new_cp_trans">
              <td colSpan="3">
                <BanksList
                  childobj={childobj}
                  setChildobj={setChildobj}
                  BankRef={BankRef}
                  NextElemRef={ChqRef}
                />
              </td>
              <td>
                <input
                  style={{ borderRadius: "2px" }}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  onChange={(e) =>
                    setChildobj({ ...childobj, CPB: e.target.value })
                  }
                  type="text"
                  value={childobj.CPB !== null ? childobj.CPB : ""}
                  className="form-control CPBBank"
                  autoComplete="off"
                />
              </td>
              <td>
                <input
                  style={{ borderRadius: "2px" }}
                  ref={ChqRef}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  onChange={(e) =>
                    setChildobj({ ...childobj, CHQNo: e.target.value })
                  }
                  type="text"
                  value={childobj.CHQNo !== null ? childobj.CHQNo : ""}
                  className="form-control CPBCHQNo"
                  autoComplete="off"
                />
              </td>
              <td>
                <input
                  style={{ borderRadius: "2px" }}
                  ref={DatedRef}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  onChange={(e) =>
                    setChildobj({ ...childobj, Dated: e.target.value })
                  }
                  type="date"
                  value={childobj.Dated}
                  className="form-control CPBDated"
                  autoComplete="off"
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <CashList
                  CashInHandRef={CashInHandRef}
                  NextElemRef={IsActualRef}
                  childobj={childobj}
                  setChildobj={setChildobj}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                {childobj.isAct === true && (
                  <input
                    style={{
                      borderRadius: "2px",
                      color: "#036",
                      width: "100%",
                    }}
                    ref={IsActualRef}
                    defaultChecked
                    onKeyDown={(e) => FocusNextInputChild(e)}
                    onClick={CheckBoxFunc}
                    type="checkbox"
                    className="checkbox CPBCheck"
                  />
                )}
                {childobj.isAct === false && (
                  <input
                    style={{
                      borderRadius: "2px",
                      color: "#036",
                      width: "100%",
                    }}
                    ref={IsActualRef}
                    onKeyDown={(e) => FocusNextInputChild(e)}
                    onClick={CheckBoxFunc}
                    type="checkbox"
                    className="checkbox CPBCheck"
                  />
                )}
              </td>
              <td>
                <TextField
                  childobj={childobj}
                  setChildobj={setChildobj}
                  Ref={NarrationRef}
                  FocusNextInputChild={FocusNextInputChild}
                  className="CPBNarration"
                />
              </td>
              <td>
                <CurrencyField
                  value={childobj.NetCredit || ""}
                  onChange={AmountFun}
                  Ref={CreditRef}
                  onKeyDown={FocusNextInputChild}
                  className="CPBDebit"
                />
              </td>
              <td>
                {!localStorage.getItem("upd-cpb") ? (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onKeyDown={(e) => FocusNextInputChild(e)}
                    onClick={AddSingle}
                    className="btn btn-info cdr_btn btn-block"
                    value="Enter"
                  />
                ) : (
                  <input
                    style={{ borderRadius: "2px" }}
                    ref={EnterRef}
                    type="button"
                    onClick={UpdatedSingle}
                    className="btn btn-info cdr_btn btn-block"
                    value="Update"
                  />
                )}
              </td>
            </tr>
            {transarray &&
              transarray.map((data, index) => {
                data.isDeleted === 0 && data.NetCredit > 0
                  ? (total += data.NetCredit)
                  : (tmptotal += data.NetCredit); // running Total
                return (
                  data.isDeleted === 0 && (
                    <tr key={index} className="entry_row tr_loop_cp_trans">
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Id}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.SrNo}</span>
                      </td>
                      <td colSpan={1}>
                        <span style={{ color: "#036" }}>{data.BankName}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.CPB}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.CHQNo}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>
                          {ConvertDateInput(data.Dated, false)}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>
                          {data.IssueToName}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {data.isAct === true && (
                          <input
                            type="checkbox"
                            disabled={true}
                            defaultChecked={true}
                          />
                        )}
                        {data.isAct === false && (
                          <input type="checkbox" disabled={true} />
                        )}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>
                          {data.Description}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: "#036" }}>
                          <Currency value={data.NetCredit} />
                        </span>
                      </td>
                      <td className="action_without_print">
                        <span
                          className="btn btn-info btn-xs"
                          onClick={() => UpdSingle(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-pencil"></i>
                        </span>{" "}
                        &nbsp;
                        <span
                          className="btn btn-danger btn-xs"
                          onClick={() => RemSingle(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-times"></i>
                        </span>
                      </td>
                    </tr>
                  )
                );
              })}
            <tr className="transactions" style={{ display: "none" }}></tr>
            <tr
              style={{
                backgroundColor: "#f8f8f8",
                fontWeight: "bold",
                height: "30px",
              }}
            >
              <td colSpan="9" style={{ textAlign: "right" }}>
                Total Balance
              </td>
              <td
                colSpan="1"
                className="drCrDiffer"
                style={{ textAlign: "right", color: "#042377" }}
                title="Diffrence"
              >
                <Currency value={total} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
        {parentobj.Status === 0 && parentobj.VocNo > 0 && (
          <input
            type="button"
            onClick={PostEntry}
            className="btn btn-info"
            value="Post Entry"
          />
        )}
        {parentobj.Status > 0 && (
          <input
            type="button"
            onClick={handlePrint}
            className="btn btn-info"
            value="Print"
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
      <div className="clearfix"></div>
      <div>
        <CHQPrint
          componentRef={componentRef}
          parentobj={parentobj}
          transarray={transarray}
        />
      </div>
    </div>
  );
}
