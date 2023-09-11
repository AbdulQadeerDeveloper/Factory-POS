import React from 'react';
import Select from 'react-select';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';

export default function UsersList({userObject, setUserObject, users} ) {

    // destructuring

    function HandleSelect(e) {
        console.log(e);
        setUserObject(e);
    }
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={users}
                defaultValue={users[0]}
                isMulti={false}
                isLoading={false}
                isSearchable={false}
                placeholder={userObject.UserName ? "" : 'Select User'}
                isClearable={false}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
