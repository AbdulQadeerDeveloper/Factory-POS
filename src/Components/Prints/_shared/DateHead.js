import React from 'react'
import ConvertDateInput from '../../Shared_Components/ConvertDateInput'

export default function DateHead({colspan = "9", parentobj}) {
    return (
        <tr className='no-border'>
            <td colSpan={colspan} className="center normal">
                <span className="bold">From:</span> {ConvertDateInput(parentobj.SDate, false)}&nbsp;{" "}
                <span className="bold">To:</span>{" "}
                {ConvertDateInput(parentobj.EDate, false)}{" "}
            </td>
        </tr>
    )
}
