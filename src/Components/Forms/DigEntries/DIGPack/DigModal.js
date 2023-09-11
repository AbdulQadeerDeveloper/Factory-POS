import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Modal } from "react-bootstrap";

function DigModal({ show, data, setShow, selectedItem, setSelectedItem, NextElementRef }) {
  const [search, setSearch] = useState("");

  function handleSelect(item) {
    setSelectedItem({
      ...selectedItem,
      RefId: item.Id,
      ProductId: item.ProductId,
      ProdName: item.ProdName,
      CategId: item.CategId,
      CategName: item.CategName,
      DNo: item.DNo,
      PQty: item.PBal,
      Packing: item.Packing,
      Qty: item.Bal,
      PUnit: item.PUnit,
      Unit: item.Unit,
    });
    setShow(false);
    setSearch("")
    NextElementRef?.current?.focus()
    // console.log(item)
  }

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
          <Button onClick={()=> setShow(false)}>X</Button>
        </Modal.Header>
        <Form>
          <InputGroup id="txtSearch" className="my-3" style={{ width: "100%" }}>
            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts"
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th style={{ textAlign: "center" }}>Select</th>
              <th>Prod Name</th>
              <th>Category</th>
              <th>DNo</th>
              <th>PBal</th>
              <th>Packing</th>
              <th>Bal</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.ProdName.toLowerCase().includes(
                      search.toLowerCase()
                    ) ||
                      item.CategName.toLowerCase().includes(
                        search.toLowerCase()
                      ) ||
                      item.DNo.toLowerCase().includes(search.toLowerCase());
              })
              .map((item) => (
                <tr key={item.Id}>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelect(item)}
                    >
                      <i className="fa fa-check"></i>
                    </Button>
                  </td>
                  <td>{item.ProdName}</td>
                  <td>{item.CategName}</td>
                  <td>{item.DNo}</td>
                  <td>{item.PBal}</td>
                  <td>{item.Packing}</td>
                  <td>{item.Bal}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Modal>
    </div>
  );
}

export default DigModal;
