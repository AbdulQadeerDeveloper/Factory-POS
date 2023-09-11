import React from 'react';
import Currency from '../../../Shared_Components/Currency';
import Level3 from './Level3';

function Level2(props) {
    const {data, MHeadID} = props;
    
    // console.log(data.L2);
    return (
        <>
            {
                data.L2.filter(x => x.MHeadID === MHeadID).map((l2,j) =>(
                    <>
                    <tr key={j} style={{background: "antiquewhite", textAlign: "justify"}}>
                        <td>{l2.HeadID}</td>
                        <td>{l2.Head}</td>
                        <td><Currency value={l2.OpDr} /></td>
                        <td><Currency value={l2.OpCr} /></td>
                        <td><Currency value={l2.CurDr} /></td>
                        <td><Currency value={l2.CurCr} /></td>
                        <td><Currency value={l2.ClDr} /></td>
                        <td><Currency value={l2.ClCr} /></td>
                    </tr>
                    <Level3 data={data} HeadID={l2.HeadID} />
                    </>
                ))
            }
        </>
    );
}

export default Level2;