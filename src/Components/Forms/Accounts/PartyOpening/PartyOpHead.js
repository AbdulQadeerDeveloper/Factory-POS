import React from 'react'

export default function PartyOpHead() {
  return (
    <thead>
    <tr>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        Id
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        SrNo
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        Date
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        Party ID
      </th>
      <th
        style={{ textAlign: "left" }}
        className="bg-color col-xs-3"
      >
        Party Name
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-2"
      >
        Description
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        NetDebit
      </th>
      <th
        style={{ textAlign: "left" }}
        className="bg-color col-xs-1"
      >
        NetCredit
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1"
      >
        Status
      </th>
      <th
        style={{ textAlign: "center" }}
        className="bg-color col-xs-1 action_without_print"
      >
        ACTION
      </th>
    </tr>
  </thead>
  )
}
