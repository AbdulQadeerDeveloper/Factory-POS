import React from 'react'

export default function ReportHead({ colspan, title }) {
  return (
    <tr className='no-border'>
      <td colSpan={colspan || "0"} className="firmname underline center" style={{ borderColor: 'transparent' }}>
        {title}
      </td>
    </tr>
  )
}
