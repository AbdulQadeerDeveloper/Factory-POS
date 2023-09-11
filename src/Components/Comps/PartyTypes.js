import React,{useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function PartyTypes(props) {

    // destructuring
    const {parentobj, setParentobj, partyTypes} = props;
    const contextdata = useContext(GlobalData);

    function HandleSelect(e) {
        console.log(e);
        setParentobj(e);
    }
    
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={ partyTypes ? partyTypes : contextdata.partyTypes}
                isMulti={true}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.PartyTypeId ? "" : 'Select Party Type'}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
