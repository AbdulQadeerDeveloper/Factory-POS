import React from 'react';
import Select from 'react-select';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function OrderBy(props) {

    const {parentobj, setParentobj } = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
          e = {value: '', label: ''}
        }
        setParentobj({ ...parentobj, value: e.value, label: e.label });
    }

    const options = [
        { value: 'Date, VocNo', label: 'Date'},
        { value: 'ProdTypeId, ProdName, PartyId', label: 'Product' },
        { value: 'PartyName, ProdName', label: 'Party' },
        { value: 'VocNo, SrNo', label: 'VocNo' },
        { value: 'PartyTypeId, PartyName, ProdName', label: 'Party Sum' },
        { value: 'ProdTypeId, ProdName, PartyName', label: 'Prod Sum' }
    ]

    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={options}
                defaultValue={options[0]}
                isLoading={false}
                isSearchable={false}
                placeholder={parentobj.value === "" || parentobj.value === null ? "Select Parent" : ''}
                isClearable={false}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
