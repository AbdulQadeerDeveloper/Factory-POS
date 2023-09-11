import React,{useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function ProductsMulti(props) {

    // destructuring
    const {parentobj, setParentobj, products} = props;
    const contextdata = useContext(GlobalData);

    function HandleSelect(e) {
        console.log(e);
        setParentobj(e);
    }
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={ products ? products : contextdata.products }
                isMulti={true}
                isLoading={false}
                isSearchable={true}
                placeholder={parentobj.value ? "" : 'Select Products'}
                isClearable={true}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
