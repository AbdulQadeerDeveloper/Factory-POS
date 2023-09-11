import ConvertedDate from "../../../Shared_Components/ConvertedDate";
import Currency from "../../../Shared_Components/Currency";

const Statement = ({opQty, opAmt, tmparray}) => {

    // destructuring
    console.log("from trans", opQty, opAmt)

    let runningQty = opQty || 0;
    let runningAmt = opAmt || 0;
    let inQtyTot = 0;
    let outQtyTot = 0;

    let inAmtTot = 0;
    let outAmtTot = 0;

    function NewWindowOpen(ttype, vocno) {
        let url = `${ttype}/${vocno}`
        window.open(url, "_blank")
    }

    return (
        <div>
            <div className="panel panel-default transactions_section">
                <table className="table table-bordered" cellSpacing="0" style={{ width: "100%" }}>
                    <thead>
                        <tr className="acstat_th_statement" style={{ fontSize: "12px" }}>
                            <th className="bg-color text-center col-xs-1" style={{ verticalAlign: "middle" }}>VocNo</th>
                            <th className="bg-color text-center col-xs-1">TType</th>
                            <th className="bg-color text-center col-xs-1">ID</th>
                            <th className="bg-color text-center col-xs-1">Date</th>
                            <th className="bg-color text-left col-xs-4">Description</th>
                            <th className="bg-color col-xs-1 text-center">InQty</th>
                            <th className="bg-color col-xs-1 text-center">OutQty</th>
                            <th className="bg-color col-xs-1 text-center">BalQty</th>
                            <th className="bg-color col-xs-1 text-center">Rate</th>
                            <th className="bg-color col-xs-1 text-center">CRate</th>
                            <th className="bg-color col-xs-1 text-center">SRate</th>
                            <th className="bg-color col-xs-1 text-center">InAmt</th>
                            <th className="bg-color col-xs-1 text-center">OutAmt</th>
                            <th className="bg-color col-xs-1 text-center">BalAmt</th>
                        </tr>
                    </thead>
                    <tbody id="d">
                        <tr style={{ backgroundColor: "#f8f8f8", height: "30px" }}>
                            <td colSpan="4" style={{ textAlign: "right" }}>Opening Balance:</td>
                            <td colSpan="4" className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                {<Currency value={Math.abs(opQty)} />}
                            </td>
                            <td colSpan="6" className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                {<Currency value={Math.abs(opAmt)} />}
                            </td>
                        </tr>
                        {

                            tmparray && tmparray.map((data, i) => {
                                runningQty += data.BalQty
                                runningAmt += data.BalAmt

                                data.InQty > 0 ? inQtyTot += data.InQty : outQtyTot += data.OutQty  // running inQtyTot, outQtyTot
                                data.InAmt > 0 ? inAmtTot += data.InAmt : outAmtTot += data.OutAmt  // running inQtyTot, outQtyTot

                                return (
                                    <tr key={i} className="entry_row statement_row" style={{ fontSize: "" }}>
                                        <td style={{ textAlign: "center" }}>
                                            <span onClick={(e) => NewWindowOpen(data.TType, data.VocNo)} style={{ borderRadius: "2px", textAlign: "right", color: "#036", textDecoration: "underline", cursor: "pointer" }}>
                                                {data.VocNo}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span style={{ borderRadius: "2px", textAlign: "right", color: "#036" }}>
                                                {data.TType}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {data.Id}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span style={{ borderRadius: "2px", textAlign: "right", color: "#036" }}>
                                                <ConvertedDate date={data.Date} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            <span style={{ borderRadius: "2px", textAlign: "left", color: "#036" }}>
                                                {data.Description}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                                                <Currency value={data.InQty} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetCredit !== null ? data.NetCredit.toLocaleString() : ''} */}
                                                <Currency value={data.OutQty} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span>
                                                <Currency value={runningQty} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                                                <Currency value={data.Rate} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                                                <Currency value={data.CRate} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                                                <Currency value={data.SRate} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetDebit !== null ? data.NetDebit.toLocaleString() : ''} */}
                                                <Currency value={data.InAmt} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ borderRadius: "2px", color: "#036" }}>
                                                {/* {data.NetCredit !== null ? data.NetCredit.toLocaleString() : ''} */}
                                                <Currency value={data.OutAmt} />
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span>
                                                <Currency value={runningAmt} />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr style={{ backgroundColor: "#f8f8f8", fontWeight: "bold", height: "30px" }}>
                            <td colSpan="5" style={{ textAlign: "right" }}> Total:</td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                {/* {inQtyTot.toLocaleString()} */}
                                <Currency value={inQtyTot} />
                            </td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                {/* {outQtyTot.toLocaleString()} */}
                                <Currency value={outQtyTot} />
                            </td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                <Currency value={runningQty} />
                            </td>
                            <td colSpan="3" style={{ textAlign: "right" }}> Total:</td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                <Currency value={inAmtTot} />
                            </td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                <Currency value={outAmtTot} />
                            </td>
                            <td className="debitTotal" style={{ textAlign: "right", color: "#042377" }} title="amount">
                                <Currency value={runningAmt} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='clearfix'></div>
        </div>
    );
}

export default Statement;