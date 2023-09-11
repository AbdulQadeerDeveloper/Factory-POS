import React from 'react';
import Select from 'react-select';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';

export default function SelUserRoles({userRoleObject, setUserRoleObject, userRoles} ) {

    // destructuring

    function HandleSelect(e) {
        console.log(e);
        setUserRoleObject(e);
    }
    
    return (
        <div>
            <Select
                onChange={(e) => HandleSelect(e)}
                options={userRoles}
                defaultValue={userRoles[0]}
                isMulti={false}
                isLoading={false}
                isSearchable={false}
                placeholder={userRoleObject.RoleName ? "" : 'Select Role'}
                isClearable={false}
                styles={MultiSelectStyling()}
                // autoFocus={true}
            />
        </div>
    );
}
