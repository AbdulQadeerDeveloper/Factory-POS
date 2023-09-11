import React from 'react';
import Currency from '../../../Shared_Components/Currency';
import Level5 from './Level5';

function Level4(props) {
    const {data, PartyCategID} = props;
    // console.log(data);

    return (
        <>
          {
                data.L4.filter(x => x.PartyCategID === PartyCategID).map((l4,l) =>(
                    <>
                    <tr key={l} style={{background: "lightgrey", textAlign: "justify"}}>
                        <td>{l4.PartyTypeID}</td>
                        <td>{l4.PartyType}</td>
                        <td><Currency value={l4.OpDr} /></td>
                        <td><Currency value={l4.OpCr} /></td>
                        <td><Currency value={l4.CurDr} /></td>
                        <td><Currency value={l4.CurCr} /></td>
                        <td><Currency value={l4.ClDr} /></td>
                        <td><Currency value={l4.ClCr} /></td>
                    </tr>
                    <Level5  data={data} PartyTypeID={l4.PartyTypeID} />
                    </>
                ))
            }  
        </>
    );
}

export default Level4;