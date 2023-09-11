import React from 'react';
import Currency from '../../../Shared_Components/Currency';

function Level5(props) {
    const {data, PartyTypeID} = props;
    return (
        <>
          {
                data.L5.filter(x => x.PartyTypeID === PartyTypeID).map((l5,m) =>(
                    <>
                    <tr key={m} style={{background: "whitesmoke", textAlign: "justify"}}>
                        <td>{l5.PartyID}</td>
                        <td>{l5.PartyName}</td>
                        <td><Currency value={l5.OpDr} /></td>
                        <td><Currency value={l5.OpCr} /></td>
                        <td><Currency value={l5.CurDr} /></td>
                        <td><Currency value={l5.CurCr} /></td>
                        <td><Currency value={l5.ClDr} /></td>
                        <td><Currency value={l5.ClCr} /></td>
                    </tr>
                    </>
                ))
            }  
        </>
    );
}

export default Level5;