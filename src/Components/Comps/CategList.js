import React,{useContext} from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData.js';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling.js';

export default function CategList(props) {

    const contextdata = useContext(GlobalData)
    const {parentobj, setParentobj, CategRef, NextElemRef } = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
          e = {value: '', label: ''}
        }
        setParentobj({ ...parentobj, CategId: e.value, CategName: e.label });
        NextElemRef?.current && NextElemRef.current.focus()
    }

    function handleKeyDown(e, data) {
      if (e.key === "Enter" && data)
        NextElemRef?.current && NextElemRef.current.focus();
    }


    return (
        <div>
            <Select
                onKeyDown={(e)=> handleKeyDown(e, parentobj?.CategName)}
                value={parentobj?.CategName === "" || parentobj?.CategName === null ? "" : { value: parentobj?.CategId, label: parentobj?.CategName }}
                onChange={(e) => HandleSelect(e)}
                ref={CategRef}
                options={contextdata.digCateg && contextdata.digCateg.length > 0 ? contextdata.digCateg : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj?.CategName === "" || parentobj?.CategName === null ? "Select Categ" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}