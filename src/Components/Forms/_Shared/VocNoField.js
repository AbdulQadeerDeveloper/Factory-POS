import React from 'react'

export default function VocNoField({VocNoRef, GetVocDetail, setParentobj, parentobj, handleMouseUp, PlusMinusVoc, getMaxVocNo }) {
    return (
        <>
            <div className="caption_voc">VocNo:</div>
            <div className="field_voc">
                <input
                    className="form-control field_voc_input"
                    ref={VocNoRef}
                    onKeyDown={(e) => GetVocDetail(e)}
                    onMouseUp={handleMouseUp}
                    onChange={(e) =>
                        setParentobj({ ...parentobj, VocNo: e.target.value })
                    }
                    value={parentobj.VocNo}
                    autoComplete="off"
                />
            </div>
            <div className="plus">
                <button className="maxvoc" onClick={() => PlusMinusVoc("plus")}>
                    +
                </button>
            </div>
            <div className="minus">
                <button className="maxvoc" onClick={() => PlusMinusVoc("minus")}>
                    -
                </button>
            </div>
            <div className="maxvoucher_voc">
                <button
                    className="maxvoc"
                    onClick={(e) => getMaxVocNo(e)}
                    style={{ padding: "0px!important" }}
                >
                    MxVoc
                </button>
            </div>
        </>
    )
}
