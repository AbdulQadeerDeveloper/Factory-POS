import React, { useEffect, useState, useRef } from 'react'
import { ComposedChart, LineChart, Line, Tooltip, CartesianGrid, ResponsiveContainer, Legend, XAxis, YAxis, Bar } from 'recharts';
import axios from '../../AxiosInstance'
import FirmsList from '../../Comps/FirmsList';
import OrderBy from '../../Comps/OrderBy';
import PartiesMulti from '../../Comps/PartiesMulti';
import PartyTypes from '../../Comps/PartyTypes';
import ProdTypes from '../../Comps/ProdTypes';
import ProductsMulti from '../../Comps/ProductsMulti';
// import ReportHeader from './Reports/Shared/ReportHeader';

export default function DashBoard2() {

    //#region Data
    
    const color1 = "#8884d8"
    const color2 = "#818418"
    const color3 = "#2824d8"
    
    const sDateRef = useRef();
    const eDateRef = useRef();
    const [parentobj, setParentobj] = useState([])
    const [orderObject, setOrderObject] = useState({ "value": "Date", "label": "Date" })
    const [firmObject, setFirmObject] = useState({FirmId: null, FirmName: null })
    const [partyTypeArray, setPartyTypeArray] = useState([])
    const [partiesArray, setPartiesArray] = useState([])
    const [productsArray, setProductsArray] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {

        sDateRef.current.value = new Date().toISOString().slice(0, 10)
        eDateRef.current.value = new Date().toISOString().slice(0, 10)

        GetData()

    }, [])

    const GetData = () => {
        setIsLoading(true)
        axios.get(`api/chart/recpay?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}`)
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
            <div className=''>
                <div className='' style={{ padding: "5px 0", "display": "none" }}>
                    <br />
                    <div className='row'>
                        <div className='col-md-2'>
                            <label>Order By</label>
                            <OrderBy parentobj={orderObject} setParentobj={setOrderObject} />
                        </div>
                        <div className='col-md-3'>
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Product Types</label>
                                <ProdTypes parentobj={parentobj} setParentobj={setParentobj} />
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <div className="field_1" style={{ width: "100%", float: "left" }}>
                                <label>Start Date</label>
                                <input ref={sDateRef} style={{ height: "38px" }} className="form-control" type="date" onChange={(e) => StartDate(e)} autoComplete="off" />
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <div className="field_1" style={{ width: "100%", float: "left" }}>
                                <label>End Date</label>
                                <input ref={eDateRef} style={{ height: "38px" }} className="form-control" type="date" onChange={(e) => EndDate(e)} autoComplete="off" />
                            </div>
                        </div>
                        <div className='col-md-1' style={{ padding: "0", margin: "0" }}>
                            <label>&nbsp;</label>
                            <div className="field_1 report_plus_minus_btns">
                                <button onClick={handleDecrement} className="plusminus">
                                    <i className='fa fa-minus'></i>
                                </button>
                                <button onClick={handleIncrement} className="plusminus">
                                    <i className='fa fa-plus'></i>
                                </button>
                            </div>
                        </div>
                        <div className='col-md-1' style={{ padding: "0", margin: "0" }}>
                            <label>&nbsp;</label>
                            <div className="field_1 report_generate_btn">
                                <button className='btn btn-info btn-md' onClick={GenerateReport}>Refresh</button>
                            </div>
                        </div>
                        {/* <div className='col-md-1'></div> */}
                        <div className='clearfix'></div>
                    </div>
                    <div className='report_input_space_top_bottom' style={{ "display": "none" }}>
                        &nbsp;
                    </div>
                    <div className='row' style={{ "display": "none" }}>
                        <div className='col-md-2'>
                            <label>Firm</label>
                            <FirmsList parentobj={firmObject} setParentobj={setFirmObject} />
                        </div>
                        <div className='col-md-3'>
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Party Types</label>
                                <PartyTypes parentobj={partyTypeArray} setParentobj={setPartyTypeArray} />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Parties</label>
                                <PartiesMulti parentobj={partiesArray} setParentobj={setPartiesArray} />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className="field_1" style={{ width: "100%", margin: "0 auto" }}>
                                <label>Products</label>
                                <ProductsMulti parentobj={productsArray} setParentobj={setProductsArray} />
                            </div>
                        </div>
                    </div>
                    <div className='clearfix'></div>
                </div>
                <div className='clearfix'></div>
            </div>
            {isLoading && <div>Loading...</div>}
            {/* {!isLoading && <ReportHeader title='Reports' showFilters={showFilters} setShowFilters={setShowFilters} />} */}
            {!isLoading && <div style={{ textAlign: 'center' }}>
                <div className='col-md-6'>
                    <h4>MonthWise P/L</h4>
                    <ResponsiveContainer width='100%' height={300}>
                        <ComposedChart data={data.month}>
                            <Bar type="monotone" dataKey="rec" fill={color1} />
                            <Bar type="monotone" dataKey="pay" fill={color2} />
                            <Tooltip />
                            <CartesianGrid />
                            <Legend />
                            <XAxis dataKey="Mon" />
                            <YAxis />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className='col-md-6'>

                </div>
            </div>
            }
        </>
    )

    //#endregion JSX
}
