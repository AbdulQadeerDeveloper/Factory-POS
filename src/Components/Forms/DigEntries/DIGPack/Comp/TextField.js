import React from 'react'

export default function TextField({ dataField, readOnly = false, onChange }) {
    return (
        <input
            style={{
                borderRadius: "2px",
                textAlign: "center",
                color: "#036",
            }}
            type="text"
            className="form-control IGPOthers"
            autoComplete="off"
            onChange={onChange}
            value={dataField !== null ? dataField : ""}
            readOnly={readOnly}
        />
    )
}
