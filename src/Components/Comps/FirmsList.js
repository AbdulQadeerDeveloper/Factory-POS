import React,{useContext} from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData.js';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling.js';

function FirmsList(props) {

    const contextdata = useContext(GlobalData)
    const {parentobj, setParentobj, FirmRef, NextElemRef } = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
          e = {value: '', label: ''}
        }
        setParentobj({ ...parentobj, FirmId: e.value, FirmName: e.label });
        NextElemRef?.current && NextElemRef.current.focus()
    }

    function handleKeyDown(e, data) {
      if (e.key === "Enter" && data)
        NextElemRef?.current && NextElemRef.current.focus();
    }


    return (
        <div>
            <Select
                onKeyDown={(e)=> handleKeyDown(e, parentobj?.FirmName)}
                value={parentobj?.FirmName === "" || parentobj?.FirmName === null ? "" : { value: parentobj?.FirmId, label: parentobj?.FirmName }}
                onChange={(e) => HandleSelect(e)}
                ref={FirmRef}
                options={contextdata.firm && contextdata.firm.length > 0 ? contextdata.firm : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj?.FirmName === "" || parentobj?.FirmName === null ? "Select Firm" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}

export default FirmsList;