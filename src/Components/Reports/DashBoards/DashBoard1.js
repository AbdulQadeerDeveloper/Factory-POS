import React, { useEffect, useState, useRef } from 'react'
import { ComposedChart, LineChart, Line, Tooltip, CartesianGrid, ResponsiveContainer, Legend, XAxis, YAxis, Bar } from 'recharts';
import axios from '../../AxiosInstance'
import FirmsList from '../../Comps/FirmsList';
import OrderBy from '../../Comps/OrderBy';
import PartiesMulti from '../../Comps/PartiesMulti';
import PartyTypes from '../../Comps/PartyTypes';
import ProdTypes from '../../Comps/ProdTypes';
import ProductsMulti from '../../Comps/ProductsMulti';
import { Col, Row } from 'react-bootstrap';
// import ReportHeader from './Reports/Shared/ReportHeader';

export default function DashBoard1() {

    //#region Data

    const color1 = "#8884d8"
    const color2 = "#818418"
    const color3 = "#2824d8"

    const sDateRef = useRef();
    const eDateRef = useRef();
    const [parentobj, setParentobj] = useState([])
    const [orderObject, setOrderObject] = useState({ "value": "Date", "label": "Date" })
    const [firmObject, setFirmObject] = useState({ FirmId: null, FirmName: null })
    const [partyTypeArray, setPartyTypeArray] = useState([])
    const [partiesArray, setPartiesArray] = useState([])
    const [productsArray, setProductsArray] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {

        sDateRef.current.value = new Date().toISOString().slice(0, 10)
        eDateRef.current.value = new Date().toISOString().slice(0, 10)

        GetData()

    }, [])

    const GetData = () => {
        setIsLoading(true)
        axios.get(`api/chart/pl?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}`)
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                alert(err.message)
                setIsLoading(false)
            })
    }

    function GenerateReport() {
        GetData()
    }

    function handleDecrement() {
        sDateRef.current.value = addDays(sDateRef.current.value, -1)
        eDateRef.current.value = addDays(eDateRef.current.value, -1)
        GenerateReport();
    }

    function handleIncrement() {
        sDateRef.current.value = addDays(sDateRef.current.value, +1)
        eDateRef.current.value = addDays(eDateRef.current.value, +1)
        GenerateReport();
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().slice(0, 10);
    }

    function StartDate(e) {
        sDateRef.current.value = e.target.value;
        GenerateReport();
    }

    function EndDate(e) {
        eDateRef.current.value = e.target.value;
        GenerateReport();
    }

    //#endregion Data

    //#region JSX
    return (
        <>
                    <Row>
                        <Col xs="md-2">
                            <label>Order By</label>
                            <OrderBy parentobj={orderObject} setParentobj={setOrderObject} />
                        </Col>
                        <Col xs="md-3">
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Product Types</label>
                                <ProdTypes parentobj={parentobj} setParentobj={setParentobj} />
                            </div>
                        </Col>
                        <Col xs="md-2">
                            <div className="field_1" style={{ width: "100%", float: "left" }}>
                                <label>Start Date</label>
                                <input ref={sDateRef} style={{ height: "38px" }} className="form-control" type="date" onChange={(e) => StartDate(e)} autoComplete="off" />
                            </div>
                        </Col>
                        <Col xs="md-2">
                            <div className="field_1" style={{ width: "100%", float: "left" }}>
                                <label>End Date</label>
                                <input ref={eDateRef} style={{ height: "38px" }} className="form-control" type="date" onChange={(e) => EndDate(e)} autoComplete="off" />
                            </div>
                        </Col>
                        <Col xs="md-1">
                            <label>&nbsp;</label>
                            <div className="field_1 report_plus_minus_btns">
                                <button onClick={handleDecrement} className="plusminus">
                                    <i className='fa fa-minus'></i>
                                </button>
                                <button onClick={handleIncrement} className="plusminus">
                                    <i className='fa fa-plus'></i>
                                </button>
                            </div>
                        </Col>
                        <Col xs="md-1">
                            <label>&nbsp;</label>
                            <div className="field_1 report_generate_btn">
                                <button className='btn btn-info btn-md' onClick={GenerateReport}>Refresh</button>
                            </div>
                        </Col>
                    </Row>
                    {/* <div className='report_input_space_top_bottom' style={{ "display": showFilters ? "block" : "none" }}>
                        &nbsp;
                    </div> */}
                    <Row>
                        <Col xs="md-2">
                            <label>Firm</label>
                            <FirmsList parentobj={firmObject} setParentobj={setFirmObject} />
                        </Col>
                        <Col xs="md-3">
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Party Types</label>
                                <PartyTypes parentobj={partyTypeArray} setParentobj={setPartyTypeArray} />
                            </div>
                        </Col>
                        <Col xs="md-3">
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Parties</label>
                                <PartiesMulti parentobj={partiesArray} setParentobj={setPartiesArray} />
                            </div>
                        </Col>
                        <Col xs="md-3">
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Products</label>
                                <ProductsMulti parentobj={productsArray} setParentobj={setProductsArray} />
                            </div>
                        </Col>
                    </Row>
            {isLoading && <div>Loading...</div>}
            {/* {!isLoading && <ReportHeader title='Reports' showFilters={showFilters} setShowFilters={setShowFilters} />} */}
            {!isLoading && <Row style={{ textAlign: 'center' }}>
                <Col xs='md-6'>
                    <h4>MonthWise P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.month}>
                            <Bar type="monotone" dataKey="sale" fill={color1} />
                            <Bar type="monotone" dataKey="cost" fill={color2} />
                            <Bar type="monotone" dataKey="pl" fill={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="Month" interval={'preserveStartEnd'} tickFormatter={(value) => value.toString().substring(0, 10)} />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Col>
                <Col xs='md-6'>
                    <h4>DateWise P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.date}>
                            <Bar type="monotone" dataKey="sale" fill={color1} />
                            <Bar type="monotone" dataKey="cost" fill={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="Date" interval={'preserveStartEnd'} tickFormatter={(value) => value.toString().substring(0, 10)} />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Col>
                <Col xs="md-6">
                    <h4>ProdType P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.prodtype}>
                            <Bar type="monotone" dataKey="sale" fill={color1} />
                            <Bar type="monotone" dataKey="cost" fill={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="ProdType" />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>

                </Col>
                <Col xs="md-6">
                    <h4>Products P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.prod}>
                            <Bar type="monotone" dataKey="sale" fill={color1} />
                            <Bar type="monotone" dataKey="cost" fill={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="Prod" />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>

                </Col>

                <Col xs="md-6">
                    <h4>PartyType P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.partytype}>
                            <Bar type="monotone" dataKey="sale" fill={color1} />
                            <Bar type="monotone" dataKey="cost" fill={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="PartyType" />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>

                </Col>
                <Col xs="md-6">
                    <h4>Parties P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <LineChart data={data.party}>
                            <Line type="monotone" dataKey="sale" stroke={color1} />
                            <Line type="monotone" dataKey="cost" stroke={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="Party" />
                            <YAxis />
                        </LineChart>
                    </ResponsiveContainer>

                </Col>
                <Col xs="md-6">
                    <h4>Sales Person P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <LineChart data={data.saleman}>
                            <Line type="monotone" dataKey="sale" stroke={color1} />
                            <Line type="monotone" dataKey="cost" stroke={color2} />
                            <Line type="monotone" dataKey="pl" stroke={color3} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="SaleMan" />
                            <YAxis />
                        </LineChart>
                    </ResponsiveContainer>

                </Col>
            </Row>
            }
        </>
    )

    //#endregion JSX
}
