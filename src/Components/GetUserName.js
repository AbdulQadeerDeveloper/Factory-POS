import React from 'react'
import axios from './AxiosInstance'
export default function GetUserName() {

    axios.get("api/login/getusername")
    .then(res=> {
        console.log({dt: res.data})
    })
    .catch(err=> {
        alert(err.message);
    })
  return (
    <div>GetUserName</div>
  )
}
