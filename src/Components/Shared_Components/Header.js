import React from 'react'


export default function Header({ title, isLoading }) {
    return (
        <>
            <div className='bg-info panel_heading'>
                <div>{title}{isLoading ? "(Loading...)" : ""}</div>
            </div>
        </>
    )
}
