import React,{useContext} from 'react';
import { GlobalData } from '../GlobalData.js';
import Select from 'react-select';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling.js';

function BanksList(props) {
    const contextdata = useContext(GlobalData);
    // destructuring
    const {childobj, setChildobj, BankRef, NextElemRef} = props;
    
    function HandleSelect(e) {
      // console.log(e);
      if (e === null) {
        e = {value: '', label: ''}
      }
      setChildobj({ ...childobj, BankId: e.value, BankName: e.label });
      NextElemRef?.current && NextElemRef.current?.focus();
    }
    
    return (
        <div>
            <Select
                value={childobj.BankName === "" ? "" : { value: childobj.BankId, label: childobj.BankName }}
                ref={BankRef}
                onChange={(e) => HandleSelect(e)}
                options={contextdata.banks && contextdata.banks.length > 0 ? contextdata.banks : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={childobj.BankName === "" ? "Select Bank" : ''}
                isClearable={true}
                // autoFocus={true}
                styles={MultiSelectStyling()}
                className="CPBBankInput"
            />
        </div>
    );
}

export default BanksList;