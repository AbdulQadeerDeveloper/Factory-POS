import React,{useContext} from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

function CashInHand(props) {
    const contextdata = useContext(GlobalData)

    // destructuring
    const {parentobj, setParentobj, NextElemRef} = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
            e = {value: '', label: ''}
        }
        setParentobj({ ...parentobj, CashAcc: e.value, Cash:e.label });
        NextElemRef?.current && NextElemRef.current.focus();
    }
    
    
    return (
        <div>
            <Select
                value={parentobj.CashAcc === null ? "" : { value: parentobj.CashAcc, label: parentobj.Cash }}
                onChange={(e) => HandleSelect(e)}
                options={contextdata.cashlist && contextdata.cashlist.length > 0 ? contextdata.cashlist : ''}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.CashAcc === null ? "Select Cash Account" : ''}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}

export default CashInHand;