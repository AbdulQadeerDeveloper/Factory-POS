import React from 'react'
import { Col, Row } from 'react-bootstrap'
import OrderBy from './OrderBy'
import ProdTypes from './ProdTypes'
import FirmsList from './FirmsList'
import PartyTypes from './PartyTypes'
import PartiesMulti from './PartiesMulti'
import ProductsMulti from './ProductsMulti'

export default function FilterComp({orderObject, setOrderObject, parentobj, setParentobj, 
    sDateRef, eDateRef, StartDate, EndDate, handleDecrement, handleIncrement, 
    GenerateReport, handlePrint, showFilters, firmObject, setFirmObject, 
    partyTypeArray, setPartyTypeArray, partiesArray, setPartiesArray, productsArray, setProductsArray,
    
}) {
  return (
    <div style={{ display: showFilters ? "block" : "none" }}>
            <Row className="row">
              <Col xs="md-2">
                <label>Order By</label>
                <OrderBy
                  parentobj={orderObject}
                  setParentobj={setOrderObject}
                />
              </Col>
              <Col xs="md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Product Types</label>
                  <ProdTypes
                    parentobj={parentobj}
                    setParentobj={setParentobj}
                  />
                </div>
              </Col>
              <Col xs="md-2">
                <div
                  className="field_1"
                  style={{ width: "100%", float: "left" }}
                >
                  <label>Start Date</label>
                  <input
                    ref={sDateRef}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="date"
                    onChange={(e) => StartDate(e)}
                    autoComplete="off"
                  />
                </div>
              </Col>
              <Col xs="md-2">
                <div
                  className="field_1"
                  style={{ width: "100%", float: "left" }}
                >
                  <label>End Date</label>
                  <input
                    ref={eDateRef}
                    style={{ height: "38px" }}
                    className="form-control"
                    type="date"
                    onChange={(e) => EndDate(e)}
                    autoComplete="off"
                  />
                </div>
              </Col>
              <Col xs="md-1 p-0 m-0">
                <label>&nbsp;</label>
                <div className="field_1 report_plus_minus_btns">
                  <button onClick={handleDecrement} className="plusminus">
                    <i className="fa fa-minus"></i>
                  </button>
                  <button onClick={handleIncrement} className="plusminus">
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </Col>
              <Col xs="md-1 p-0 m-0">
                <label>&nbsp;</label>
                <div className="field_1 report_generate_btn">
                  <button
                    className="btn btn-info btn-md"
                    onClick={GenerateReport}
                  >
                    Generate
                  </button>
                </div>
              </Col>
              <Col xs="md-1 p-0 m-0">
                <label>&nbsp;</label>
                <div className="field_1 report_print_btn">
                  <button
                    onClick={handlePrint}
                    className="btn btn-info btn-md button print_voucher print__button"
                  >
                    Print
                  </button>
                </div>
              </Col>
            </Row>
            <Row
            >
              <Col xs="md-2">
                <label>Firm</label>
                <FirmsList
                  parentobj={firmObject}
                  setParentobj={setFirmObject}
                />
              </Col>
              <Col xs="md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Party Types</label>
                  <PartyTypes
                    parentobj={partyTypeArray}
                    setParentobj={setPartyTypeArray}
                  />
                </div>
              </Col>
              <Col xs="md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Parties</label>
                  <PartiesMulti
                    parentobj={partiesArray}
                    setParentobj={setPartiesArray}
                  />
                </div>
              </Col>
              <Col xs="md-3">
                <div
                  className="field_1"
                  style={{ width: "100%", margin: "0 auto" }}
                >
                  <label>Products</label>
                  <ProductsMulti
                    parentobj={productsArray}
                    setParentobj={setProductsArray}
                  />
                </div>
              </Col>
            </Row>    
    </div>
  )
}
