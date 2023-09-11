import axios from '../../AxiosInstance'
import React, { useEffect, useState } from 'react'

export default function LegStat({ ttype, vocno }) {
    const [data, setData] = useState([])

    useEffect(() => {
        if (vocno==='0') return;
        axios.get(`api/fin/legstat/${ttype}/${vocno}`)
            .then(res => {
                setData(res.data)
                console.log(res.data)
            })
            .catch(err => {
                alert(err.Message)
            })
    }, [ttype, vocno])
    return (
        <div style={{ textAlign: "center !important", margin: "auto", width: "400px", fontWeight: "lighter" }}>
        <table className='table table-bordered table-condensed'>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>By User</th>
                        <th>At Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(x => (
                        <tr>
                            <td>{x.Status}</td>
                            <td>{x.EntryUser}</td>
                            <td>{x.EntryDate}</td>
                        </tr>
                    ))
                    }

                </tbody>
            </table>
        </div>
    )
}
