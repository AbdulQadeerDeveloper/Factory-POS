import React from 'react'
import GetNow from '../../Shared_Components/GetNow'

export default function ReportGetNow() {
    return (
        <div className="time">
            Report run at: {GetNow()}
        </div>
    )
}
