import React from 'react';
import GetNow from '../../Shared_Components/GetNow';
import ConvertDateInput from '../../Shared_Components/ConvertDateInput';
import Currency from '../../Shared_Components/Currency';
import PrevBal from '../../Forms/StkEntries/SV/PrevBal';

export default function PrintSV(props) {

    const { parentobj, transarray, InvRef, contextdata, showPrevBal } = props;

    let tmpamt = 0;
    let valexgst = 0;
    let freight = parentobj.FreightType === 0 ? parentobj.Freight || 0 : 0;

    let run_qty = 0;
    let run_pqty = 0;
    let run_amt = 0;
    let run_advamt = 0;

    return (
        <div>
            <div className='container newprint'>
                {/* <div className='container-fluid'> */}
                <div className='row'>
                    <div className='col-md-12' ref={InvRef}>
                        <table border="0" className='print_table'>
                            <thead>
                                <tr>
                                    <th colSpan={4}>
                                        <table border="0px">
                                            <thead></thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={3} className="time">Report Run At : {GetNow()}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}>
                                                        <div className="firmname">{contextdata?.firm?.length > 0 && contextdata.firm[0].label}</div>
                                                        <div className='clearfix'></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4">
                                        <div className="address">
                                            {contextdata?.firm?.length > 0 && contextdata.firm[0].Address}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4"><div className="firmname underline">Commercial Invoice</div></td>
                                </tr>
                                <tr>
                                    <td className='master_heading' style={{ width: '10%' }}><b>VocNo:</b></td>
                                    <td><div className="master_field">{parentobj.VocNo}</div></td>
                                    <td className='master_heading' style={{ width: '10%' }}><b>PO:</b></td>
                                    <td><div className="master_field">{parentobj.PO}</div></td>
                                </tr>
                                <tr>
                                    <td className='master_heading'><b>Date:</b></td>
                                    <td><div className="master_field">{ConvertDateInput(parentobj.Date, false)}</div></td>
                                    <td className='master_heading'><b>Due:</b></td>
                                    <td><div className="master_field"> {parentobj?.Due} Days </div></td>
                                </tr>
                                <tr>
                                    <td className='master_heading'><b>Party:</b></td>
                                    <td><div className="master_field">{parentobj.PartyName} </div></td>
                                    <td className='master_heading'><b>Vehicle:</b></td>
                                    <td><div className="master_field">{parentobj.Vehicle}</div></td>
                                </tr>
                                <tr>
                                    <td className='master_heading'><b>Remarks:</b></td>
                                    <td><div className="master_field">{parentobj.Remarks} &nbsp; </div></td>
                                    <td className='master_heading'><b>Driver:</b></td>
                                    <td><div className="master_field">{parentobj.ByPerson}</div></td>
                                </tr>
                            </tbody>
                        </table>

                        <table className='dd' border="1" cellPadding="0" cellSpacing="0px">
                            <thead>
                                <tr>
                                    <th width="4%" className="detail_heading center">Sr#</th>
                                    <th width="32%" className="detail_heading left">Product</th>
                                    <th width="16%" className="detail_heading center">Packing</th>
                                    <th width="8%" className="detail_heading right">Qty</th>
                                    <th width="8%" className="detail_heading center">Unit</th>
                                    <th width="8%" className="detail_heading center">Rate</th>
                                    <th width="8%" className="detail_heading center">(S.T%)</th>
                                    <th width="15%" className="detail_heading right">Total Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    transarray && transarray.map((data, i) => {
                                        run_pqty += data.PQty;
                                        run_qty += data.Qty;

                                        valexgst = data.Qty * data.Rate;


                                        //AdvAmt Total
                                        tmpamt = 0;
                                        tmpamt = valexgst * data.AdvPer / 100;
                                        run_advamt += tmpamt;

                                        //Amount Total
                                        tmpamt = 0;
                                        tmpamt = valexgst + (valexgst * data.GSTPer / 100);
                                        run_amt += tmpamt;

                                        return (
                                            data.isDeleted === 0 &&
                                            <tr key={i}>
                                                <td className="detail_field center">{data.SrNo}</td>
                                                <td className="detail_field left">{data.ProDesc.length > 0 ? data.ProDesc : data.ProdName}</td>
                                                <td className="detail_field center">{data.PQty} {data.PUnit} × {data.Packing}</td>
                                                <td className="detail_field right">{data.Qty}</td>
                                                <td className="detail_field center">{data.Unit}</td>
                                                <td className="detail_field center">{data.Rate}/-</td>
                                                <td className="detail_field center">{data.GSTPer}</td>
                                                <td className="detail_field right"><Currency value={tmpamt} /></td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan="2"></td>
                                    <td className="master_heading center">{run_pqty}</td>
                                    <td className="master_heading right">{run_qty}</td>
                                    <td></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className="master_heading"><Currency value={run_amt} /></td>
                                </tr>
                            </tbody>
                        </table>

                        <table border="0px" className='print_table'>
                            <tbody>
                                <tr>
                                    <td style={{ width: '30%' }}>
                                        <div className="time">User: {parentobj.EntryUser}</div>
                                        <div className="time">Time: {parentobj.EntryDate}</div>
                                    </td>
                                    <td style={{ width: '30%' }}>
                                        {showPrevBal && <PrevBal PartyId={parentobj.PartyId} eDate={parentobj.Date} CurBillNo={parentobj.VocNo} CurBillAmt={run_amt + freight + run_advamt} />}
                                    </td>
                                    <td style={{ width: '40%' }}>
                                        <>
                                            <table border="0px" cellSpacing="0" cellPadding="3px" align="right" width="220px">
                                                <thead></thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="master_heading right">Freight:</td>
                                                        <td className="detail_heading right"><Currency value={freight} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="master_heading right">Bill Amt:</td>
                                                        <td className="detail_heading right"><Currency value={run_amt + freight} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="master_heading right">Adv Tax:</td>
                                                        <td className="detail_heading right"><Currency value={run_advamt || 0} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="master_heading right">Net Amt:</td>
                                                        <td className="detail_heading right"><Currency value={run_amt + freight + run_advamt} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="detail_heading right underline">Received By</td>
                                                        <td className="detail_heading center underline">Authorized Signature</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="left">Note: Please inform us within 7 days if any difference in Balance </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
