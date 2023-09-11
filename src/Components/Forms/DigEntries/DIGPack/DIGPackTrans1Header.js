import React from 'react'

export default function DIGPackTrans1Header() {
  return (
    <thead>
    <tr>
      <th className="bg-color text-left">Id</th>
      <th className="bg-color text-left">SrNo</th>
      <th className="bg-color col-xs-2 text-center igpproduct">
        Product
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        Category
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        DNo
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        PUnit
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        PQty
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        Packing
      </th>
      <th style={{ textAlign: "center" }} className="bg-color col-xs-1">
        Unit
      </th>
      <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
        Qty
      </th>
      <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
        Rate
      </th>
      <th style={{ textAlign: "right" }} className="bg-color col-xs-1">
        Remarks
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1 action_without_print"
      >
        Action
      </th>
    </tr>
  </thead>
  )
}
