import React from 'react';
import Currency from '../../../Shared_Components/Currency';
import Level4 from './Level4';

function Level3(props) {
    const {data, HeadID} = props;
    
    // console.log(data);
    return (
        <>
            {
                data.L3.filter(x => x.HeadID === HeadID).map((l3,k) =>(
                    <>
                    <tr key={k} style={{background: "lightyellow", textAlign: "justify"}}>
                        <td>{l3.PartyCategID}</td>
                        <td>{l3.PartyCateg}</td>
                        <td><Currency value={l3.OpDr} /></td>
                        <td><Currency value={l3.OpCr} /></td>
                        <td><Currency value={l3.CurDr} /></td>
                        <td><Currency value={l3.CurCr} /></td>
                        <td><Currency value={l3.ClDr} /></td>
                        <td><Currency value={l3.ClCr} /></td>
                    </tr>
                    <Level4 data={data} PartyCategID={l3.PartyCategID} />
                    </>
                ))
            }
        </>
    );
}

export default Level3;