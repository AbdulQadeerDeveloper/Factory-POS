import React from 'react';
import Select from 'react-select';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function OrderByCPB(props) {

    const {orderObject, setOrderObject } = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
          e = {value: '', label: ''}
        }
        setOrderObject({value: e.value, label: e.label });
    }

    const options = [
        {value: 'Date,CPB', label: 'Date'},
        {value: 'ChqDate', label: 'ChqDate'},
        {value: 'PartyName', label: 'Party'},
        {value: 'CPB', label: 'CPB'},
        {value: 'BankName', label: 'Bank'},
        {value: 'BalAmt', label: 'Balance'},
        {value: 'IssueToName', label: 'IssueTo'}
    ]

    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={options}
                defaultValue={options[0]}
                isLoading={false}
                isSearchable={false}
                isClearable={false}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
