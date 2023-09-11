import React from 'react'
import Header from '../Shared_Components/Header'
import { Container } from 'react-bootstrap'

export default function MainContainer({title, isLoading, children}) {
    return (
        <Container fluid style={{ width: '100%' }} className="mx-2">
            <div style={{ width: '100%' }}>
                <Header title={`${title}${isLoading ? "(Loading...)" : ""}`} isLoading={isLoading} />
            </div>
            {children}
        </Container>

    )
}
