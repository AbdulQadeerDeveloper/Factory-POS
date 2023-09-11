import React, { useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData.js';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling.js';

function ProductsList(props) {

  const contextdata = useContext(GlobalData)
  const { childobj, setChildobj, ProductRef, NextElemRef } = props;

  function HandleSelect(e) {
    console.log(e);
    if (e === null) {
      e = {value: '', label: ''}
      setChildobj({
        ...childobj,
        ProductId: null,
        ProdName: '',
        PUnit: null,
        Packing: null,
        Unit: null,
        Qty: null,
        PQty: null,
        Rate: null,
        GSTPer: null,
        AdvPer: null
      });
    }else{
      setChildobj({
        ...childobj,
        ProductId: e.value,
        ProdName: e.label,
        PUnit: e.PUnit,
        Packing: e.Packing,
        Unit: e.Unit
      });
      NextElemRef?.current && NextElemRef.current.focus();
    }
  }


  return (
    <div>
      <Select
        value={childobj?.ProdName === "" || childobj?.ProdName === null ? "" : { value: childobj?.ProductId, label: childobj?.ProdName, PUnit: childobj?.PUnit, Packing: childobj?.Packing, Unit: childobj?.Unit }}
        onChange={(e) => HandleSelect(e)}
        ref={ProductRef}
        options={contextdata.products &&  contextdata.products.length > 0 ? contextdata.products : ''}
        isLoading={false}
        isSearchable={true}
        placeholder={childobj?.ProdName === "" || childobj?.ProdName === null ? "Select Product" : ''}
        isClearable={true}
        styles={MultiSelectStyling()}
        // className="POProducts"
      // autoFocus={true}
      />
    </div>
  );
}

export default ProductsList;