import React, { useContext, useEffect } from 'react';
import Select from 'react-select';
import { GlobalData } from '../../../GlobalData';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';
import CPBsList from './CPBsList';
function GetPartiesList(props) {

    const contextdata = useContext(GlobalData)
    const { PartyRef, NarrationRef, childobj, setChildobj, CpbRef, cpblist, setCpblist } = props;

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
          e = {value: '', label: ''}
        }
        let cpbcheck = e.label.substring(0, 5);
        if (cpbcheck === "CPB -") {
            // setCpbAction(false);
            setCpblist({...cpblist, CpbAction: false, CpbDropdown: true})
        } else {
            setCpblist({...cpblist, CpbAction: true, CpbDropdown: false})
            NarrationRef.current && NarrationRef.current.focus();
        }
        setChildobj({ ...childobj, PartyId: e.value, PartyName: e.label });
        // if (e.value !== "") {
        //     setCpbAction(false);
        // }
    }
    useEffect(() => {
        CpbRef.current && CpbRef.current.focus();
    }, [cpblist.CpbAction, CpbRef])


    return (
        <>
            <td colSpan="4" className='jvParties'>
                <Select
                    value={childobj.PartyName === "" ? "" : { value: childobj.PartyId, label: childobj.PartyName }}
                    onChange={(e) => HandleSelect(e)}
                    options={contextdata.parties &&  contextdata.parties.length > 0 ? contextdata.parties : ''}
                    ref={PartyRef}
                    isLoading={false}
                    isSearchable={true}
                    style={{height: "20px!important"}}
                    placeholder={childobj.PartyName === "" ? "Select Party" : ''}
                    isClearable={true}
                    styles={MultiSelectStyling()}
                    className="jvPartiesInput"
                />
            </td>
            <CPBsList
                childobj={childobj}
                setChildobj={setChildobj}
                CpbRef={CpbRef}
                NarrationRef={NarrationRef}
                cpblist={cpblist}
                setCpblist={setCpblist}
                className="customstyle" />
        </>
    );
}

export default GetPartiesList