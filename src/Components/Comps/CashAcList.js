import React,{useContext} from 'react';
import { GlobalData } from '../GlobalData.js';
import Select from 'react-select';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling.js';

function CashInHand(props) {
    const contextdata = useContext(GlobalData)
    // destructuring
    const {childobj, setChildobj, NextElemRef} = props;
    
    function HandleSelect(e) {
      // console.log(e);
      if (e === null) {
        e = {value: '', label: ''}
      }
      setChildobj({ ...childobj, IssueTo: e.value, IssueToName: e.label });
      NextElemRef.current && NextElemRef.current.focus();
    }
    
    
    return (
        <div>
            <Select
                value={childobj.IssueToName === "" ? "" : { value: childobj.IssueTo, label: childobj.IssueToName }}
                onChange={(e) => HandleSelect(e)}
                options={contextdata.cashlist && contextdata.cashlist.length > 0 ? contextdata.cashlist : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={childobj.IssueToName === "" ? "Select Cash Account" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
                className="CPBIssueTo"
            />
        </div>
    );
}

export default CashInHand;