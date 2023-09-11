import React, {useContext, useEffect, useState, useRef} from 'react';
import CompanyLogo from './../../../company.png';
import { useParams } from "react-router-dom";
import { GlobalData } from '../../GlobalData';
import axios from '../../AxiosInstance';
import { useReactToPrint } from 'react-to-print';
import ConvertedDate from '../../Shared_Components/ConvertedDate';
import Currency from '../../Shared_Components/Currency';

export default function PrintV() {
    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'new document',
        pageStyle: "print"
    });

    const datacontext = useContext(GlobalData);
    const { vocno, type } = useParams();
    const [restrict, setRestrict] = useState(0);
    const [parent, setParent] = useState({
        VocNo: 0,
        TType: "",
        Date: new Date().toISOString().slice(0,10),
        Trans: []

    });
    const [dtotal, setDtotal] = useState(0)
    const [ctotal, setCtotal] = useState(0)
    

    // function getPrint() {
    //     window.print()
    // }

    // convert total amount into english words
    var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    function inWords (num) {
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] !== "0") ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] !== "0") ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] !== "0") ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] !== "0") ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] !== "0") ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees:' : '';
        return str;
    }
    
    // convert date into standard format
    // function ConvertDateFrmt(date) {
    //     let cnv = date = date.substring(0, 10);
    //     return cnv
    // }

    useEffect(() => {
      setRestrict(1);
      if (restrict === 1) {
          var config = {
              method: 'GET',
              url: `api/ledger/${type}/${vocno}`
          };
          axios(config)
              .then((response) => {
                  console.log(response.data);
              let farr = response.data;
              let dt = 0;
              let ct = 0;
              if (farr.length > 0) {
                for (let i = 0; i < farr[0].Trans.length; i++) {
                    if (farr[0].Trans[i].NetDebit !== null) {
                        dt += farr[0].Trans[i].NetDebit;
                    }else{
                        ct += farr[0].Trans[i].NetCredit;
                    }
                }
                // let upd_date = <ConvertedDate date={farr[0].Date} />
                setParent({...parent, VocNo: farr[0].VocNo, Date: farr[0].Date, TType: farr[0].TType, Trans: farr[0].Trans});
                setDtotal(dt);
                setCtotal(ct);
              }
            });
      }
  }, [restrict, vocno]);

    return (
        <div>
            <style>
                {
                    `.test{
                        display: none!important;
                    }`
                }
            </style>
            <br/><br/><br/>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='main_area' id='mysection' style={{width: "80%", margin: "0 auto", padding: "10px", borderRadius: "3px", border:"1px solid lightgrey"}}>
                            <div style={{background:"#d9edf7", width: "100%", margin: "0 auto", padding:"15px", borderRadius: "3px", textAlign: "right"}}>
                                <button className='btn btn-primary' onClick={handlePrint}>Print</button>
                            </div>
                            <br/>
                            {/* conatiner start */}
                            <div className='container' ref={componentRef} style={{width:"80%", height: window.innerHeight}}>
                                <div className='row'>

                                    <div className='col-md-12' style={{textAlign: "left", margin: "-10px", padding:"0"}}>
                                        <div className='col-md-2' style={{paddig:"0", margin:"0", textAlign:"right"}}>
                                            <img src={CompanyLogo} alt="Company Logo" style={{width: "115px", height: "115px"}} />
                                        </div>
                                        <div className='col-md-10'>
                                            <div style={{fontSize: "30px"}}>{datacontext.firm[0] && datacontext.firm[0].label}</div>
                                            <div> <i className='fa fa-phone'></i> {datacontext.firm[0] && datacontext.firm[0].phone}</div>
                                            <div> <i className='fa fa-envelope'></i> {datacontext.firm[0] && datacontext.firm[0].Email}</div>
                                            <div> <i className='fa fa-location-arrow'></i> {datacontext.firm[0] && datacontext.firm[0].Address}</div>
                                        </div>
                                    </div>
                                    <div className='clearfix'></div>


                                    <div className='col-md-12' style={{textAlign: "center", margin: "10px 0 0 0"}}>
                                        <div className='bg-info' style={{fontSize:"16px", marginBottom: "", padding: "7px 0"}}>
                                            <b>
                                                {/* {parent && parent.TType === "JV" ? 
                                                    "JOURNAL VOUCHER"
                                                    : parent.TType === "CR" ?
                                                    "CASH RECEIPT"
                                                    : parent.TType === "CP" ?
                                                    "CASH PAYMENT"
                                                    : ''
                                                } */}
                                                {parent && parent.TType}
                                            </b>
                                        </div>
                                    </div>
                                    <div className='clearfix'></div>


                                    <div className='col-md-12' style={{margin: "0", padding: "0"}}>
                                        <div className='col-md-6' style={{margin:"0", textAlign: "left", fontSize: "12px"}}>Voucher No: {parent && parent.VocNo}</div>
            
                                        <div className='col-md-6' style={{margin:"0", textAlign:"right", fontSize: "12px"}}>
                                            Date: {parent && <ConvertedDate date={parent.Date} />}
                                        </div>
                                        <div className='clearfix'></div>
                                    </div>
                                    <div className='clearfix'></div>

                                    <br/>
                                    
                                    <div className="panel panel-default" style={{width: "97%", margin: "0px auto"}}>
                                        <table  className="table table-bordered" cellSpacing="0" style={{width: "100%"}}>
                                            <thead>
                                                <tr style={{fontSize: "12px"}}>
                                                    <th colSpan={1} className="bg-color text-center col-xs-1" style={{verticalAlign: "middle"}}>Code</th>
                                                    <th  className="bg-color text-left col-xs-2">Title</th>
                                                    <th  className="bg-color text-left col-xs-5">Narration</th>
                                                    <th  className="bg-color col-xs-1 text-right">Debit(RS.)</th>
                                                    <th  className="bg-color col-xs-1 text-right">Credit(RS.)</th>
                                                </tr>
                                            </thead>
                                            <tbody id="d">
                                                {parent && parent.Trans.map((item,i) => (
                                                    <tr key={i} className="entry_row" style={{fontSize: "12px"}}>
                                                        <td style={{textAlign: "center"}}>
                                                            <span style={{borderRadius:"2px", textAlign: "center", color: "#036"}}>{item.PartyId}</span>
                                                        </td>
                                                        <td style={{textAlign: "center"}}>
                                                            <div style={{borderRadius:"2px", textAlign: "left", color: "#036"}}>{item.PartyName}</div>
                                                        </td>
                                                        <td style={{textAlign:"left"}}>
                                                            <span style={{borderRadius:"2px", textAlign: "left", color: "#036"}}>{item.Description}</span>
                                                        </td>
                                                        <td style={{textAlign: "right"}}>
                                                            <span style={{borderRadius:"2px", color: "#036"}}>
                                                            <Currency value={item.NetDebit} />
                                                            </span>
                                                        </td>
                                                        <td style={{textAlign: "right"}}>
                                                            <span style={{borderRadius:"2px", color: "#036"}}>
                                                            <Currency value={item.NetCredit} />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                
                                                <tr style={{backgroundColor: "#f8f8f8", height: "30px", fontSize: "12px"}}>
                                                    <td colSpan="3" style={{textAlign: "left", fontWeight: "bold", textTransform: "capitalize"}}> {inWords(dtotal)} </td>
                                                    <td className="debitTotal" style={{textAlign: "right", fontWeight:"bold", color: "#042377"}} title="amount">
                                                        <Currency value={dtotal} />
                                                    </td>
                                                    <td className="debitTotal" style={{textAlign: "right", fontWeight:"bold", color: "#042377"}} title="amount">
                                                        <Currency value={ctotal} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='clearfix'></div>

                                <br/><br/>

                                    <div className='col-md-12' style={{padding: "0", margin: "0"}}>
                                        <div className='col-md-12' style={{borderBottom: "2px dotted #ccc", padding: "0", margin: "0"}}>
                                            <table style={{width: "100%"}}>
                                                <thead>
                                                    <tr><th></th><th></th><th></th><th></th></tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className='col-md-3' style={{textAlign: "left"}}>Prepared By</td>
                                                        <td className='col-md-3' style={{textAlign: "center"}}>Checked By</td>
                                                        <td className='col-md-3' style={{textAlign: "center"}}>Approved By</td>
                                                        <td className='col-md-3' style={{textAlign: "right"}}>Received By</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {/* <br/>
                                            <div className='col-md-3' style={{textAlign: "left", padding: "0"}}>
                                                <div>Prepared By</div>
                                            </div>
                                            <div className='col-md-3' style={{textAlign: "center"}}>
                                                <div>Checked By</div>
                                            </div>
                                            <div className='col-md-3' style={{textAlign: "center"}}>
                                                <div>Approved By</div>
                                            </div>
                                            <div className='col-md-3' style={{textAlign: "right", padding:"0"}}>
                                                <div>Received By</div>
                                            </div>
                                            <div className='clearfix'></div> */}
                                        </div>
                                        <div className='clearfix'></div>
                                    </div>
                                    <br/><br/><br/><br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
