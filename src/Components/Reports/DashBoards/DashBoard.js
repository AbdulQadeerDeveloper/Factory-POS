import React, { useEffect, useState } from 'react'
import ProductsMulti from '../../Comps/ProductsMulti'
import ProdTypes from '../../Comps/ProdTypes'

export default function DashBoard() {
  const [prodTypeArray, setProdTypeArray] = useState([])

  const [prodArray, setProdArray] = useState([])
  

  useEffect(()=> {
    let prodTypes = '' 
    let prods = ''

    prodTypeArray.map(x=> {
      prodTypes += x.value + ','
    })

    prodArray.map(x=> {
      prods += x.value + ','
    })

    // console.log(prodTypes, prods)

  },[prodTypeArray, prodArray])

  return (
    <div style={{textAlign: "center", width: '80%', margin: "0 auto"}}>
      <div>Party Types
        <ProdTypes parentobj={prodTypeArray} setParentobj={setProdTypeArray}/>
      </div>
      <div> Products
        <ProductsMulti parentobj={prodArray} setParentobj={setProdArray} />
      </div>
    </div>
  )
}
