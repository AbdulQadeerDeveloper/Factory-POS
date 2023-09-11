import React,{useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function PartyCategs(props) {

    // destructuring
    const {parentobj, setParentobj, partyCategs} = props;
    const contextdata = useContext(GlobalData);

    function HandleSelect(e) {
        console.log(e);
        setParentobj(e);
    }
    
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={ partyCategs ? partyCategs : contextdata.partyCategs}
                isMulti={true}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.PartyCategId ? "" : 'Select Party Categ'}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
