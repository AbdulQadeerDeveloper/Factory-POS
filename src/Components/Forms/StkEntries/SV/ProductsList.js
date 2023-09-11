import React from 'react';
import Select from 'react-select';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';

function ProductsList(props) {

    const { childobj, setChildobj, NextElemRef, ProductRef, ProdList } = props;

    function HandleSelect(e) {
        console.log(e);
        console.log(ProdList);
        if (e === null) {
            e = { value: '', label: '' }
            setChildobj({
                ...childobj,
                ProductId: null,
                ProdName: '',
                CurBal: null,
                PUnit: null,
                Packing: null,
                Unit: null,
                Qty: null,
                PQty: null,
                Rate: null,
                GSTPer: null,
                AdvPer: null,
                ComPer: null,
            });
        } else {
            setChildobj({
                ...childobj,
                ProdName: e.value,
                ProductId: e.ProductId,
                CurBal: e.CurBal,
                PUnit: e.PUnit,
                Packing: e.Packing,
                Unit: e.Unit,
            });
            NextElemRef.current && NextElemRef.current.focus();
        }
    }

    function handleKeyDown(e, data) {
        if (e.key === "Enter" && data) {
          NextElemRef?.current && NextElemRef.current.focus();
          
        }
      }
  
  
    return (
        <div>
            <Select
                onKeyDown={(e)=> handleKeyDown(e, childobj?.ProdName)}
                value={childobj.ProdName === "" || childobj.ProdName === null ? "" : {value: childobj.ProductId, label: childobj.ProdName, CurBal: childobj.CurBal, PUnit: childobj.PUnit, Packing: childobj.Packing, Unit: childobj.Unit }}
                onChange={(e) => HandleSelect(e)}
                ref={ProductRef}
                options={ProdList ? ProdList : []}
                isLoading={false}
                isSearchable={true}
                placeholder={childobj.ProdName === "" || childobj.ProdName === null ? "Select Product" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
                className="IGPProducts"
            />
        </div>
    );
}

export default ProductsList;