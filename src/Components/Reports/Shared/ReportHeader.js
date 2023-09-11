import React from 'react'
import { Row } from 'react-bootstrap'
// import { Toggle } from 'rsuite';
// import '../../../styles.css';


export default function ReportHeader({ title, isLoading, showFilters, setShowFilters }) {
    return (
        <Row className='bg-info panel_heading'>
            <div className='col-md-6'>{title}{isLoading ? "(Loading...)" : ""}</div>
            <div className='col-md-6' style={{ textAlign: 'right' }}>
                <button onClick={() => setShowFilters(p => !p)}>{showFilters === false ? "Show" : "Hide"} Filters</button>
                {/* <Toggle onClick={() => setShowFilters(p => !p)} size="md" defaultChecked={showFilters} checkedChildren="Show" unCheckedChildren="Hide" /> */}
            </div>
        </Row>
    )
}
