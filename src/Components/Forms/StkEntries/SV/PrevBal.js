import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../../AxiosInstance'
import Currency from '../../../Shared_Components/Currency'

export default function PrevBal({PartyId, eDate, CurBillNo, CurBillAmt}) {
  const [currentBal, setCurrentBal] = useState(0)
  useEffect(()=> {
    axios.get(`api/fin/getpartybal?partyid=${PartyId}&edate=${eDate}&vocno=${CurBillNo}`)
    .then(res => {
        console.log(res.data)
        setCurrentBal(res.data)
    })
  }, [PartyId, eDate, CurBillNo])
  return (
    <>
      <div className="time"><strong>PrevBal:</strong> <Currency value={ currentBal - Math.round(CurBillAmt,0) } /></div>
      <div className="time"><strong>CurBal: </strong> <Currency value= { currentBal } /></div>
    </>
  )
}
