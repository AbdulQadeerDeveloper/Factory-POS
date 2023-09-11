import React, { useContext } from 'react';
import Select from 'react-select';
import axios from './../AxiosInstance';
import { GlobalData } from '../GlobalData';
import MultiSelectStyling from '../Shared_Components/MultiSelectStyling';
function GetPartiesList(props) {

  const contextdata = useContext(GlobalData)
  const { PartyRef, NextElemRef, childobj, setChildobj, DueRef, DateRef } = props;

  function HandleSelect(e) {
    console.log(e);
    if (e === null) {
      e = { value: '', label: '' }
    }
    setChildobj({ ...childobj, PartyId: e.value, PartyName: e.label });
    if (e.value !== "") {
      NextElemRef?.current && NextElemRef.current.focus();

      if (DueRef?.current) {
        axios.get(`api/party/getpartydata?partyid=${e.value}&edate=${DateRef.current.value}`)
          .then((res) => {
            DueRef.current.value = res.data[0].CrDays;
            setChildobj({ ...childobj, Due: res.data[0].CrDays, PartyId: e.value, PartyName: e.label })
          })
      }
    }
  }


  function handleKeyDown(e, data) {
    if (e.key === "Enter" && data) {
      NextElemRef?.current && NextElemRef.current.focus();
    }
  }

  return (
    <div>
      <Select
        onKeyDown={(e) => handleKeyDown(e, childobj.PartyName)}
        value={childobj.PartyName === "" || childobj.PartyName === null ? "" : { value: childobj.PartyId, label: childobj.PartyName }}
        onChange={(e) => HandleSelect(e)}
        options={contextdata.parties && contextdata.parties.length > 0 ? contextdata.parties : ''}
        ref={PartyRef}
        isLoading={false}
        isSearchable={true}
        placeholder={childobj.PartyName === "" || childobj.PartyName === null ? "Select Party" : ''}
        isClearable={true}
        styles={MultiSelectStyling()}
      />
    </div>
  );
}

export default GetPartiesList