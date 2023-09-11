import React, { useEffect, useRef, useState } from "react";
import DigModal from "./DigModal";
import { Button } from "react-bootstrap";
import DIGPackTrans1Header from "./DIGPackTrans1Header";
import DIGPackTrans1Body from "./DIGPackTrans1Body";
import DIGPackTrans1Body2 from "./DIGPackTrans1Body2";

export default function DIGPackTrans1(props) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const {
    searchDataBtnRef,
    data,
    ChildObjEmpty1,
    childobj1,
    setChildobj1,
    ProductRef,
    transarray1,
    setTransarray1,
    setMsg,
    msg,
    parentobj,
  } = props;

  const PQtyRef = useRef(null);

  // handling focus on inputs

  // New Voucher clean every state

  useEffect(() => {
    setChildobj1({
      ...childobj1,
      Qty: Number(childobj1?.PQty) * Number(childobj1?.Packing),
    });
  }, [childobj1?.PQty, childobj1?.Packing]);

  const [show, setShow] = useState(false);

  //JSX
  return (
    <div>
      <div>
        <div>
          <Button ref={searchDataBtnRef} onClick={() => setShow((prev) => !prev)}>Search Data</Button>
        </div>
        <div>
          <DigModal
            data={data}
            show={show}
            setShow={setShow}
            selectedItem={childobj1}
            setSelectedItem={setChildobj1}
            NextElementRef={PQtyRef}
          />
        </div>
        <table
          className="table table-bordered"
          cellSpacing="0"
          style={{ width: "100%", margin: "0" }}
        >
          <DIGPackTrans1Header />
          <tbody>
            <DIGPackTrans1Body parentobj={parentobj} msg={msg} setMsg={setMsg} NextElementRef={ProductRef} childobj1={childobj1} setChildobj1={setChildobj1} PQtyRef={PQtyRef} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} transarray1={transarray1} setTransarray1={setTransarray1} ChildObjEmpty1={ChildObjEmpty1} />
            <DIGPackTrans1Body2 ProductRef={ProductRef} msg={msg} setMsg={setMsg} parentobj={parentobj} transarray1={transarray1} setTransarray1={setTransarray1}
              setCurrentIndex={setCurrentIndex} setChildobj1={setChildobj1} />
          </tbody>

        </table>
      </div>
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
    </div>
  );
}
