import React, { useContext } from 'react';
import Select from 'react-select';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';

export default function Parties(props) {

  // destructuring
  const { partyRef, parentobj, setParentobj, NextElemRef } = props;
  const contextdata = useContext(GlobalData);

  function HandleSelect(e) {
    // console.log(e);
    if (e === null) {
      e = { value: '', label: '' }
    }
    setParentobj({ ...parentobj, PartyId: e.value, PartyName: e.label });
  }

  function handleKeyDown(e, data) {
    if (e.key === "Enter" && data) {
      NextElemRef?.current && NextElemRef.current.focus();
    }
  }

  return (
    <div>
      <Select
        onKeyDown={(e) => handleKeyDown(e, parentobj.PartyName)}
        value={parentobj.PartyId === null ? "" : { value: parentobj.PartyId, label: parentobj.PartyName }}
        onChange={(e) => HandleSelect(e)}
        options={contextdata.parties && contextdata.parties.length > 0 ? contextdata.parties : ''}
        isLoading={false}
        ref={partyRef}
        isSearchable={true}
        placeholder={parentobj.PartyId === null ? "Select Party" : ''}
        isClearable={true}
        styles={MultiSelectStyling()}
      // autoFocus={true}
      />
    </div>
  );
}
