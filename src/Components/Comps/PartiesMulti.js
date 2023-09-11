import React,{useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function PartiesMulti(props) {

    // destructuring
    const {parentobj, setParentobj, parties} = props;
    const contextdata = useContext(GlobalData);

    function HandleSelect(e) {
        console.log(e);
        setParentobj(e);
    }
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={ parties ? parties : contextdata.parties }
                isMulti={true}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.value ? "" : 'Select Parties'}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
