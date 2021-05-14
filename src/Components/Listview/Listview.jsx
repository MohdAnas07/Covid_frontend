import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import './Listview.scss'
import Profile from '../Profile/Profile'
import Infocard from '../Infocard/Infocard'
import Searchbar from '../Searchbar/Searchbar'
import Logout from '../Logout/Logout'
import cookie from 'react-cookies'
import {patientAdmit} from '../../Api/patient.api'
import axios from 'axios'
import Heading from '../Heading/Heading'

export default function Listview() {
    const [state, setState] = useState([])
    useEffect(() => {
        axios({
            url: patientAdmit,
            method: 'GET',
            headers: {
              Authorization: `Token ${cookie.load('token')}`,
            },
          })
          .then((res) => {
            // localStorage.setItem('profileId', res.data.data.id);
            if (res.data.status === 404) {
              
            } else {
              setState(res.data.data.reverse())
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
    }, [])
    return (
        
        <div className="container pt-3">
            <Heading heading="G.T.R Base Hospital, Almora"/>
            <div className="row">
                <div className="col-md-9 col-9 col-sm-12">
                    <Searchbar />
                </div>
                <div className="col-md-1 col-3 col-sm-12"> 
                    <Logout />
                </div>
            </div>
            <hr className="mt-4"/>
            {/* Cards for Status for patient check */}
            <div className="row">
                <div className="col-md-4 col-sm-4 col-12 p-2 col-lg-4">
                    <Infocard name="Checked" data={state.length}/>
                </div>
                <div className="col-md-4 col-sm-4 col-12 p-2 col-lg-4">
                    <Infocard name="Not Checked" data="30"/>
                </div>
                <div className="col-md-4 col-sm-4 col-12 col-lg-4 p-2 text-center">
                    <Link to='/list'> 
                        <Button variant="primary" type="submit" className="searchbarcontainer log" >
                            All Patients 
                        </Button>
                    </Link>
                    <span className="p-1"></span>
                    <Link to='/home'> 
                        <Button variant="primary" type="submit" className="searchbarcontainer log " >
                            Home
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Cards for Status for patient check */}
            <div className="row py-3">
                <div className="col-md-9 col-sm-12 col-lg-9 col-12 profile">

                <Table responsive="md lg sm" className="">
                        <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
    
                            {cookie.load("staff")==="NURSE" ?<th>Health Update</th>: null}
                            <th>Admitted On</th>
                            <th>Status</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {state.map((i,index) => (
                        <tr>
                            <td>{i.patient_id}</td>
                            <td><Link to={`/patient/profile/${i.patient_id}`} className="text-primary text-center">{i.name}</Link></td>
                            {cookie.load("staff")==="NURSE"?      
                               <td> <a href={`/patient/healthcheck/${i.patient_id}/${i.name}`} className="text-primary text-center">Health Checkup</a></td>
                                     :null
                            }
                            <td>{i.created_on.split("T")[0]}</td>
                            <td>{i.patient_status==="A" ? "Active" : null}</td>
                            
                        </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                <div className="col-md-3 p-2  col-sm-12 col-lg-3 col-12">
                    <Profile/>
                    
                </div>
            </div>
           
        </div>
    )
}
