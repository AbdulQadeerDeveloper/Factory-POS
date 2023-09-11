import React,{useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';
export default function ProdCategs(props) {

    // destructuring
    const {parentobj, setParentobj} = props;
    const contextdata = useContext(GlobalData);

    function HandleSelect(e) {
        console.log(e);
        setParentobj(e);
    }
    
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={contextdata.prodTypes && contextdata.prodTypes.length > 0 ? contextdata.prodTypes : ''}
                isMulti={true}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.ProdTypeId ? "" : 'Select Product Type'}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
