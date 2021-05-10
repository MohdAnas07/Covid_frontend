// import dependencies

import React from 'react'

// import components

// import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../../Components/Footer/Footer'
import { Container } from 'react-bootstrap'
import Covid from '../../Components/Covid/Covid'
// import styles

import './Home.scss'

export default function Home() {
    document.title = "Frontline | Home"
    return (
        <>
            {/* <NavBar/> */}
            <Covid />
            <div className="container-fluid p-0 m-0">
                <Footer />  
            </div>
            
        </>
    )
}
