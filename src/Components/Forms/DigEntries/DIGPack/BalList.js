import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from '../../../AxiosInstance';
import { GlobalData } from '../../../GlobalData';
import MultiSelectStyling from '../../../Shared_Components/MultiSelectStyling';

export default function BalList(props) {
    const contextdata = useContext(GlobalData);

    const { childobj, setChildobj, PQtyRef, ProductRef, parentobj, NextElemRef, eDate } = props;
    const [options, setOptions] = useState([]);
    // const [restrict, setRestrict] = useState(0)
    // const [filteredOptions, setfilteredOptions] = useState([]);


    useEffect(() => {

        if (parentobj.PartyId !== null && parentobj.FirmId !== null) {
            var config = {
                method: 'GET',
                url: `api/digtrans/prodbal?edate=${eDate}`
            };
            axios(config)
                .then((response) => {
                    if (response.status === 200) {
                        let farr = response.data;
                        // console.log(parentobj.PartyId);
                        // console.log(parentobj.FirmId);
                        // console.log(config.url);
                        // console.log(farr.length);
                        let op = [];
                        if (op.length === 0) {
                            for (let i = 0; i < farr.length; i++) {
                                let prodobj = { ProductId: farr[i].ProductId, Demand: farr[i].Demand, CurBal: farr[i].PBAL, PQty: farr[i].PQty, PUnit: farr[i].PUnit, Packing: farr[i].Packing, Qty: farr[i].BAL, Unit: farr[i].Unit, Rate: farr[i].Rate, GSTPer: farr[i].GSTPer, AdvPer: farr[i].AdvPer, value: farr[i].ProdName, label: farr[i].ProdName };
                                op.push(prodobj);
                            }
                            setOptions(op);
                        } else {
                            setOptions(op);
                        }
                    }
                });
            // let farr = options.filter(x => x.FirmId === parentobj.FirmId && x.PartyId === parentobj.PartyId);
        } else {
            return;
        }
    }, [parentobj.PartyId, parentobj.FirmId])


    function HandleSelect(e) {
        // console.log(e);
        setChildobj({
            ...childobj,
            ProdName: e.value,
            ProductId: e.ProductId,
            Demand: e.Demand,
            CurBal: e.CurBal,
            PQty: null,
            PUnit: e.PUnit,
            Packing: e.Packing,
            Qty: e.Qty,
            Unit: e.Unit,
            Rate: e.Rate,
            GSTPer: e.GSTPer,
            AdvPer: e.AdvPer
        });
        PQtyRef?.current && PQtyRef.current.focus();
    }

    function handleKeyDown(e, data) {
        if (e.key === "Enter" && e.currentTarget.innerText) {
          NextElemRef?.current && NextElemRef.current.focus();
        }
      }
    
    return (
        <div>
            <Select
                onKeyDown={(e) => handleKeyDown(e, childobj.PartyName)}
                value={childobj.ProdName === null ? "" : { ProductId: childobj.ProductId, Demand: childobj.Demand, CurBal: childobj.CurBal, PQty: childobj.PQty, PUnit: childobj.PUnit, Packing: childobj.Packing, Qty: childobj.Qty, Unit: childobj.Unit, Rate: childobj.Rate, GSTPer: childobj.GSTPer, AdvPer: childobj.AdvPer, value: childobj.ProdName, label: childobj.ProdName }}
                onChange={(e) => HandleSelect(e)}
                ref={ProductRef}
                options={options}
                isLoading={false}
                isSearchable={true}
                isDisabled={parentobj.PartyId !== null && parentobj.FirmId !== null ? false : true}
                placeholder="Select Product"
                isClearable={false}
                styles={MultiSelectStyling()}
                className="IGPProducts"
            />
        </div>
    );
}
