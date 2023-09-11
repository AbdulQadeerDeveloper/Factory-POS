import React from 'react'
import Parties from "../../../Comps/Parties";

export default function PartyOpBody({dataObject, setDataObject, handleChange, handleAdd, handleClear, btnAddRef, partyRef, netDebitRef, netCreditRef }) {
  return (
    <tr>
      <td>
        <input
          name="Id"
          type="text"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          value={dataObject.Id}
          required
        />
      </td>
      <td>
        <input
          name="SrNo"
          type="text"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          value={dataObject.SrNo}
          required
        />
      </td>
      <td>
        <input
          name="Date"
          type="date"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          value={dataObject.Date}
          required
        />
      </td>
      <td>
        <input
          name="PartyId"
          type="text"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "left",
            color: "#036",
          }}
          onChange={handleChange}
          value={
            dataObject.PartyId !== null
              ? dataObject.PartyId
              : ""
          }
          required
        />
      </td>
      <td>
        <Parties
          NextElemRef={netDebitRef}
          partyRef={partyRef}
          parentobj={dataObject}
          setParentobj={setDataObject}
        />
      </td>
      <td>
        <input
          name="Description"
          type="text"
          className="form-control POOthers"
          autoComplete="off"
          tabIndex={-1}
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          value={dataObject.Description}
          required
        />
      </td>
      <td>
        <input
          ref={netDebitRef}
          name="NetDebit"
          type="number"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "left",
            color: "#036",
          }}
          onChange={handleChange}
          onKeyDown={(e) =>
            e.key === "Enter" && netCreditRef.current.focus()
          }
          value={
            dataObject.NetDebit !== null
              ? dataObject.NetDebit
              : ""
          }
          required
        />
      </td>
      <td>
        <input
          ref={netCreditRef}
          name="NetCredit"
          type="number"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          onKeyDown={(e) =>
            e.key === "Enter" && btnAddRef.current.focus()
          }
          value={
            dataObject.NetCredit !== null
              ? dataObject.NetCredit
              : ""
          }
          required
        />
      </td>
      <td>
        <input
          name="Status"
          tabIndex={-1}
          type="number"
          className="form-control POOthers"
          autoComplete="off"
          style={{
            borderRadius: "2px",
            textAlign: "center",
            color: "#036",
          }}
          onChange={handleChange}
          value={dataObject.Status}
          required
        />
      </td>

      <td style={{ textAlign: "center" }}>
        <button
          ref={btnAddRef}
          className="btn btn-info btn-xs"
          onClick={handleAdd}
        >
          <i className="fa fa-plus"></i>
        </button>{" "}
        &nbsp;
        <button
          className="btn btn-info btn-xs"
          onClick={handleClear}
        >
          <i className="fa fa-refresh"></i>
        </button>
        {/* {
          !localStorage.getItem('upd-prodtype') ?
            <input
              style={{ borderRadius: "2px" }}
              type="button"
              onClick={handleAdd}
              className="btn btn-info cdr_btn"
              value="Enter" />
            :
            <input
              style={{ borderRadius: "2px" }}
              type="button"
              className="btn btn-info cdr_btn btn-block"
              value="Update" />
        } */}
      </td>
    </tr>
  )
}
