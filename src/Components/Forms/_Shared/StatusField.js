import React from 'react'
import { Badge } from 'react-bootstrap'

export default function StatusField({Status}) {
  return (
    <>
            <div className="caption_voc">Status:</div>
            <div className="field_small_status ml-2">
              {Status === 0 && <Badge bg="danger" style={{width: "120px", fontSize: "12px", color: "white"}}>UnPosted</Badge>}
              {Status === 1 && <Badge bg="warning" style={{width: "120px", fontSize: "12px", color: "white"}}>Posted</Badge>}
              {Status === 2 && <Badge bg="primary" style={{width: "120px", fontSize: "12px", color: "white"}}>Audited</Badge>}
              {Status === 3 && <Badge bg="success" style={{width: "120px", fontSize: "12px", color: "white"}}>Approved</Badge>}
            </div>
    </>
  )
}
