import React, { useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function SaleManList(props) {

    const { parentobj, setParentobj, SalemanRef, NextElemRef } = props;
    const contextdata = useContext(GlobalData);


    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
            e = { value: '', label: '' }
        }
        setParentobj({
            ...parentobj,
            SaleManId: e.value,
            SaleManName: e.label
        });
        NextElemRef.current && NextElemRef.current.focus();
    }

    function handleKeyDown(e) {
        if (e.key === "Enter")
            NextElemRef?.current && NextElemRef.current.focus();
    }

    return (
        <div>
            <Select
                onKeyDown={handleKeyDown}
                value={parentobj.SaleManName === null ? "" : { value: parentobj.SaleManId, label: parentobj.SaleManName }}
                onChange={(e) => HandleSelect(e)}
                ref={SalemanRef}
                options={contextdata.salemanlist && contextdata.salemanlist.length > 0 ? contextdata.salemanlist : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.SaleManName === null ? "Select SaleMan" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
            />
        </div>
    );
}