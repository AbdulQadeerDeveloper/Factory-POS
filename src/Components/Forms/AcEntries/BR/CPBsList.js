import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { GlobalData } from '../../../GlobalData';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';
function CPBsList(props) {

    const contextdata = useContext(GlobalData)
    const { NarrationRef, childobj, setChildobj, CpbRef, cpblist, setCpblist } = props;

    
    const [options, setOptions] = useState([]);
    useEffect(() => {
        if (contextdata && contextdata.cpbballist.length > 0) {
            const results = contextdata.cpbballist.filter(x => x.IssueTo === childobj.PartyId);
            let op = [];
            if (op.length === 0) {
                for (let i = 0; i < results.length; i++) {
                    let partyobj = {
                        IssueTo: results[i].IssueTo,
                        PartyId: results[i].PartyId,
                        PartyName: results[i].PartyName,
                        CPB: results[i].CPB,
                        BalAmt: results[i].BalAmt,
                        CHQNo: results[i].CHQNo,
                        CPBDesc: results[i].CPBDesc,
                        value: results[i].CPBDesc,
                        label: results[i].CPBDesc
                    };
                    op.push(partyobj);
                }
                setOptions(op);
            } else {
                setOptions(op);
            }
        } else {
            return;
        }
    }, [contextdata, childobj.PartyId]);

    function HandleSelect(e) {
        // console.log(e);
        if (e === null) {
            e = {value: '', label: ''}
        }
        setCpblist({
            ...cpblist,
            id: 0,
            IssueTo: e.IssueTo,
            CPB: e.CPB,
            BalAmt: e.BalAmt,
            CHQNo: e.CHQNo,
            PartyId: e.PartyId,
            PartyName: e.PartyName,
            CPBDesc: e.CPBDesc,
            CpbAction: false,
            CpbDropdown: false
        });
        setChildobj({ ...childobj, NetCredit: e.BalAmt, CPB: e.CPB, Description: e.CPBDesc });
        if (e.IssueTo !== null) {
            NarrationRef.current && NarrationRef.current.focus();
        }
    }

    return (
        <>
            <td colSpan={1} className="jvCPB">
                <Select
                    value={cpblist.IssueTo === null ? "" : {
                            IssueTo: cpblist.IssueTo,
                            CPB: cpblist.CPB,
                            BalAmt: cpblist.BalAmt,
                            CHQNo: cpblist.CHQNo,
                            PartyId: cpblist.PartyId,
                            PartyName: cpblist.PartyName,
                            CPBDesc: cpblist.CPBDesc,
                            value: cpblist.CPBDesc,
                            label: cpblist.CPBDesc
                        }
                    }
                    onChange={(e) => HandleSelect(e)}
                    options={options}
                    ref={CpbRef}
                    isLoading={false}
                    isSearchable={true}
                    placeholder={cpblist.PartyName === "" ? "Select CPB" : ''}
                    isClearable={false}
                    isDisabled={cpblist.CpbAction}
                    menuIsOpen={cpblist.CpbDropdown}
                    styles={MultiSelectStyling()}
                    className="jvCPBInput"
                />
            </td>
        </>
    );
}

export default CPBsList