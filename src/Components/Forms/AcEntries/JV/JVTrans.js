import React, { useRef, useState } from "react";
import PartiesList from "./PartiesList";
import Currency from "../../../Shared_Components/Currency";
import { useNavigate } from "react-router-dom";
import LegPrint from "../../../Prints/AcPrints/LegPrint";
import { useReactToPrint } from "react-to-print";
import CurrencyField from "../../../Controls/CurrencyField";
import TextField from "../../../Controls/TextField";

export default function JVTrans(props) {
  const {
    isLoading,
    transarray,
    setTransarray,
    msg,
    setMsg,
    parentobj,
    setParentobj,
    DelConfirmation,
    SubmitVoucher,
    DateRef,
    PartyRef,
    type,
  } = props;
  const navigate = useNavigate();

  const NarrationRef = useRef(null);
  const DebitRef = useRef(null);
  const CreditRef = useRef(null);
  const EnterRef = useRef(null);
  const CpbRef = useRef(null);
  const CpbRef2 = useRef(null);

  let child_tmp_obj = {
    Id: 0,
    SrNo: 1,
    PartyId: null,
    PartyName: "",
    CPB: null,
    Description: "",
    NetDebit: null,
    NetCredit: null,
    IsDeleted: 0,
  };

  const [childobj, setChildobj] = useState(child_tmp_obj);

  const [cpblist, setCpblist] = useState({
    IssueTo: null,
    CPB: null,
    BalAmt: null,
    CHQNo: null,
    PartyId: null,
    PartyName: null,
    CPBDesc: null,
    CpbAction: true,
    CpbDropdown: false,
  });

  let drTotal = 0;
  let crTotal = 0;

  function ChildObjEmpty() {
    setChildobj(child_tmp_obj);
  }

  const pageStyle = `@page {size: portrait}`;
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Journal_Document",
    pageStyle: pageStyle,
  });

  function PostEntry() {
    parentobj.Status = 1;
    SubmitVoucher();
  }

  // handling focus on inputs
  function FocusNextInputChild(e) {
    if (e.key !== "Enter") return;
    if (CpbRef2.current === document.activeElement) {
      NarrationRef.current && NarrationRef.current.focus();
    } else if (NarrationRef.current === document.activeElement) {
      if (childobj.NetDebit === null && childobj.NetCredit === null) {
        DebitRef.current && DebitRef.current.focus();
      } else if (childobj.NetDebit !== null && childobj.NetCredit === null) {
        DebitRef.current && DebitRef.current.focus();
      } else if (childobj.NetDebit === null && childobj.NetCredit !== null) {
        CreditRef.current && CreditRef.current.focus();
      }
    } else if (DebitRef.current === document.activeElement) {
      if (childobj.NetDebit !== null && childobj.NetDebit !== "") {
        if (localStorage.getItem("upd-" + type)) {
          UpdatedSingle();
        } else {
          AddSingle();
        }
        PartyRef.current && PartyRef.current.focus();
      } else {
        CreditRef.current && CreditRef.current.focus();
        if (drTotal - crTotal !== 0)
          setChildobj({ ...childobj, NetCredit: drTotal - crTotal });
      }
    } else if (CreditRef.current === document.activeElement) {
      if (childobj.NetCredit !== null && childobj.NetCredit !== "") {
        if (localStorage.getItem("upd-" + type)) {
          UpdatedSingle();
        } else {
          AddSingle();
        }
        PartyRef.current && PartyRef.current.focus();
      }
    }
  }

  // object validation before insert and update
  function HandleValidate() {
    if (childobj.PartyName === "") {
      setMsg({
        ...msg,
        err: "party is required",
        color: "alert alert-warning",
      });
    } else if (childobj.Description === "") {
      NarrationRef.current && NarrationRef.current.focus();
      setMsg({
        ...msg,
        err: "Narration is required",
        color: "alert alert-warning",
      });
    } else if (childobj.NetDebit === null && childobj.NetCredit === null) {
      setMsg({
        ...msg,
        err: "fill at least debit or credit field",
        color: "alert alert-warning",
      });
    } else if (childobj.NetDebit !== null && childobj.NetCredit !== null) {
      setMsg({
        ...msg,
        err: "Only debit or credit field can be filled",
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
      const val = [...transarray];
      let lngth = val.length + 1;
      let newobj = { ...childobj, SrNo: lngth };
      val.push(newobj);
      // val.splice(0, 0, childobj);
      setTransarray(val);
      setChildobj({ ...child_tmp_obj, Description: childobj.Description });
      // const cpbval = [...contextdata.cpbballist];
      // console.log(cpbval);
      // console.log(cpblist.PartyId);
      // let findObj = cpbval.find((obj, i) => obj.PartyId === cpblist.PartyId);
      // let fndIndex = cpbval.findIndex((obj, i) => obj.PartyId === cpblist.PartyId);
      // console.log(findObj);
      // console.log(fndIndex);
      // contextdata.setCpbBalList();
      setCpblist({
        ...cpblist,
        IssueTo: null,
        CPB: null,
        BalAmt: null,
        CHQNo: null,
        PartyId: null,
        CpbAction: true,
        CpbDropdown: false,
      });
      PartyRef.current && PartyRef.current.focus();
    }
  }

  // get selected object for updation
  function UpdSingle(index) {
    const val = [...transarray];
    let myObj = val.find((obj, i) => i === index);
    setChildobj(myObj);
    let localarr = [];
    localarr.push({ index }, myObj);
    localStorage.setItem("upd-" + type, JSON.stringify(localarr));
    setMsg({ ...msg, err: "", color: "" });
    if (myObj.NetDebit !== null && myObj.NetCredit === null) {
      DebitRef.current && DebitRef.current.focus();
    } else {
      CreditRef.current && CreditRef.current.focus();
    }
  }

  // update selected object from array
  function UpdatedSingle() {
    if (HandleValidate()) {
      let data = JSON.parse(localStorage.getItem("upd-" + type));
      const val = [...transarray];
      val.splice(data[0].index, 1, childobj);
      localStorage.removeItem("upd-" + type);
      ChildObjEmpty(); // child obj empty
      setTransarray(val);
      setMsg({ ...msg, err: "", color: "" });
      PartyRef.current && PartyRef.current.focus();
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
            PartyId: delObj.PartyId,
            PartyName: delObj.PartyName,
            CPB: delObj.CPB,
            Description: delObj.Description,
            NetDebit: delObj.NetDebit,
            NetCredit: delObj.NetCredit,
            IsDeleted: 1,
          };
          val.splice(index, 1, delObj);
          // val.splice(index, 1);
        }
      }
    }
    setTransarray(val);
    PartyRef.current && PartyRef.current.focus();
  }

  function DrFun(e) {
    let dr = parseInt(e.target.value, 10);
    if (isNaN(dr)) {
      setChildobj({ ...childobj, NetDebit: null });
    } else {
      setChildobj({ ...childobj, NetDebit: dr });
    }
  }

  function CrFun(e) {
    let cr = parseInt(e.target.value, 10);
    if (isNaN(cr)) {
      setChildobj({ ...childobj, NetCredit: null });
    } else {
      setChildobj({ ...childobj, NetCredit: cr });
    }
  }

  // New Voucher clean every state
  function NewVoucher() {
    setMsg({ ...msg, err: "", color: "" });
    setCpblist({ ...cpblist, CpbAction: true, CpbDropdown: false });
    DateRef.current && DateRef.current.focus();
    setParentobj({
      ...parentobj,
      VocNo: 0,
      Date: new Date().toISOString().slice(0, 10),
      TType: type,
      Status: 0,
      Trans: [],
    });
    setTransarray([]);
    ChildObjEmpty(); // child obj empty
    navigate(`/${type}/0`);
  }

  //JSX
  return (
    <div>
      <div>
        <table
          className="table table-bordered table-condensed table-hover"
          cellSpacing="0"
          style={{ width: "100%", margin: "0" }}
        >
          <thead>
            <tr>
              <th className="bg-color text-center">ID</th>
              <th className="bg-color text-center">SrNo</th>
              <th
                className="bg-color text-center col-xs-3"
                style={{ verticalAlign: "middle" }}
                colSpan="2"
              >
                Account
              </th>
              <th className="bg-color col-xs-3 text-left">CPB</th>
              <th className="bg-color col-xs-1 text-left">CPB</th>
              <th className="bg-color col-xs-3 text-left">Narration</th>
              <th className="bg-color col-xs-1 text-center">Debit</th>
              <th className="bg-color col-xs-1 text-center">Credit</th>
              <th className="bg-color col-xs-1 action_without_print">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="entry_row">
              <PartiesList
                NarrationRef={NarrationRef}
                PartyRef={PartyRef}
                CpbRef={CpbRef}
                childobj={childobj}
                setChildobj={setChildobj}
                cpblist={cpblist}
                setCpblist={setCpblist}
              />
              <td>
                <input
                  style={{ borderRadius: "2px" }}
                  ref={CpbRef2}
                  onKeyDown={(e) => FocusNextInputChild(e)}
                  onChange={(e) =>
                    setChildobj({ ...childobj, CPB: e.target.value })
                  }
                  type="text"
                  value={childobj.CPB !== null ? childobj.CPB : ""}
                  className="form-control JVNarrationInput"
                  autoComplete="off"
                />
              </td>
              <td>
                <TextField
                  childobj={childobj}
                  setChildobj={setChildobj}
                  Ref={NarrationRef}
                  FocusNextInputChild={FocusNextInputChild}
                />
              </td>
              <td>
                <CurrencyField
                  value={childobj.NetDebit || ""}
                  onChange={DrFun}
                  Ref={DebitRef}
                  onKeyDown={FocusNextInputChild}
                />
              </td>
              <td>
                <CurrencyField
                  value={childobj.NetCredit || ""}
                  onChange={CrFun}
                  Ref={CreditRef}
                  onKeyDown={FocusNextInputChild}
                />
              </td>
              <td>
                {!localStorage.getItem("upd-" + type) ? (
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
                if (data.IsDeleted === 0 && data?.NetDebit > 0)
                  drTotal += data.NetDebit;
                if (data.IsDeleted === 0 && data?.NetCredit > 0)
                  crTotal += data.NetCredit;

                return (
                  data.IsDeleted === 0 && (
                    <tr key={index} className="entry_row">
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.Id}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#036" }}>{data.SrNo}</span>
                      </td>
                      {/* <td>
                        <span style={{ color: "#036" }}>{data.PartyId}</span>
                      </td> */}
                      <td colSpan={2} style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>
                          {data.PartyId} {data.PartyName}
                        </span>
                      </td>
                      {/* <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#036" }}>{data.CPB}</span>
                      </td> */}
                      <td style={{ textAlign: "left" }} colSpan={3}>
                        <span style={{ color: "#036" }}>
                          {data.CPB > 0 ? "(" + data.CPB + ") " : ""}
                          {data.Description}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: "#036" }}>
                          {data.NetDebit !== null
                            ? data.NetDebit.toLocaleString()
                            : ""}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: "#036" }}>
                          {data.NetCredit !== null
                            ? data.NetCredit.toLocaleString()
                            : ""}
                        </span>
                      </td>
                      <td className="action_without_print">
                        <span
                          className="btn btn-info btn-xs"
                          style={{ cursor: "pointer" }}
                          onClick={() => UpdSingle(index)}
                        >
                          <i className="fa fa-pencil"></i>
                        </span>{" "}
                        &nbsp;
                        <span
                          className="btn btn-danger btn-xs"
                          style={{ cursor: "pointer" }}
                          onClick={() => RemSingle(index)}
                        >
                          <i className="fa fa-times"></i>
                        </span>
                      </td>
                    </tr>
                  )
                );
              })}
            {/* <tr className="transactions" style={{ display: "none" }}></tr> */}
            <tr
              style={{
                backgroundColor: "#f8f8f8",
                fontWeight: "bold",
                height: "30px",
              }}
            >
              <td colSpan="7" style={{ textAlign: "right" }}>
                Total/Difference
              </td>
              <td
                className="debitTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="DebitTotal"
              >
                {/* {drTotal.toLocaleString()} */}
                <Currency value={drTotal} />
              </td>
              <td
                className="creditTotal"
                style={{ textAlign: "right", color: "#042377" }}
                title="CreditTotal"
              >
                {/* {crTotal.toLocaleString()} */}
                <Currency value={crTotal} />
              </td>
              <td
                className="drCrDiffer"
                style={{ textAlign: "right", color: "#042377" }}
                title="DiffrenceTotal"
              >
                <Currency value={drTotal - crTotal} />
              </td>
            </tr>
          </tbody>
        </table>

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

        <div className="voc_btn_bottom" style={{textAlign: 'right'}}>
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
            disabled={
              drTotal !== 0 &&
              crTotal !== 0 &&
              drTotal === crTotal &&
              isLoading === false
                ? false
                : true
            }
            className="btn btn-info"
          >
            {parentobj.VocNo > 0 ? "Update" : "Save"}
          </button>
        </div>
        <div className="clearfix"></div>
        <div>
          <LegPrint
            componentRef={componentRef}
            parentobj={parentobj}
            transarray={transarray}
          />
        </div>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}
