import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { Button, Table, Spinner } from 'react-bootstrap'
import Heading from '../Heading/Heading'
import HeadingSmall from '../HeadingSmall/HeadingSmall'
import { patientHealthProfile } from '../../Api/health.api'
import { patientProfile } from '../../Api/patient.api'
import axios from 'axios'
import cookie from 'react-cookies'
import {useToasts} from 'react-toast-notifications'
export default function Pprofile(props) {
    const {addToast} = useToasts()
    const [state, setState] = useState({})
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [test, setTest] = useState({})
    const [vaccine, setVaccine] = useState({})
    useEffect(() => {
        setLoading(true)
        axios({
            url: patientProfile+`${props.id}/${props.contact}/`,
            method: 'GET',
            
          })
          .then((res) => {
            if (res.data.status === 404) {
                addToast("Details Not Found!!", {appearance: "error"})
            } else {
                setLoading(false)
                setState(res.data.data)
                setTest(res.data.data.patient_covid_test)
                setVaccine(res.data.data.patient_vaccine_status)
                axios({
                    url: patientHealthProfile+`${props.id}/`,
                    method: 'GET',
                   
                    })
                    .then((res) => {
                    if (res.data.status === 404) {
                        setData(res.data.data)
                    } else {
                        setData(res.data.data)
                        
                    }
                    })
                    .catch((err) => {
                    // console.log(err.response);
                    });
             }
          })
          .catch((err) => {
            addToast("Details Not Found!!", {appearance: "error"})
            // console.log(err.response);
          });

    }, [props.id, addToast, props.contact])

    // console.log(test.is_tested)
    // console.log(vaccine)
    return (
        <div className="container p-2">
            <Heading  heading="Patient Profile"/>
            <div className="row my-4 px-1">
                <div className="col-md-6  col-sm-12 col-lg-6 col-12 mb-2 p-0">
                    <div className="card-body card profile h-100">
                        <HeadingSmall  heading="General Info"/>
                        <p className="card-title pl-3">Patient id: <span className="font-weight-bold">  &ensp; &ensp;{state.patient_id}</span></p>
                        <p className="card-title pl-3">Name: <span className="font-weight-bold">  &ensp; &ensp;{state.name} </span></p>
                        <p className="card-title pl-3">Status: <span className="font-weight-bold">  &ensp; &ensp;{state.patient_status==="A"? "Active": state.patient_status==="R" ? "Recoverd" : state.patient_status==="M" ? "Referred":"Home Isolated"} </span></p>
                        <p className="card-title pl-3">Gender: <span className="font-weight-bold">  &ensp; &ensp;{state.gender}</span></p>
                        <p className="card-title pl-3">Age: <span className="font-weight-bold">  &ensp; &ensp;{state.age}</span></p>
                        <p className="card-title pl-3">Patient Condition: <span className="font-weight-bold">  &ensp; &ensp;{state.health_condition==="1"? "Asymptomataic": state.health_condition==="2"? "Mild": state.health_condition==="3"? "Moderate": "Severe"}</span></p>
                        <p className="card-title pl-3">
                        Bed Number: <span className="font-weight-bold">  &ensp; &ensp;
                                {state.patient_bed?state.patient_bed.bed_id: null}
                                (
                                {state.patient_bed ? 
                                    state.patient_bed.bed_category==="1"? "General Bed": state.patient_bed.bed_category==="2"?
                                            "O2 Bed": state.patient_bed.bed_category==="3"? "ICU": "Vantilator":null

                                })</span>
                        </p>
                        <p className="card-title pl-3">Contact Number: <span className="font-weight-bold">  &ensp; &ensp;{state.contact_number}</span></p>
                        <p className="card-title pl-3">Address: <span className="font-weight-bold">  &ensp; &ensp;{state.address}</span></p>
                        <br />
                        {cookie.load("staff")==="DOCTOR"? 
                            <div className="card-body row">
                            <div className=" col-md-4 col-sm-4 col-4 col-lg-4  pl-5">
                                <Link to={`/patient/bedchange/${state.patient_id}`}>
                                    <Button variant="primary" type="submit" className="searchbarcontainer log">
                                        Change Bed
                                    </Button>
                                </Link>
                            </div>
                            <div className=" col-md-4 col-sm-4 col-4 col-lg-4  pl-5">
                                <Link to={`/patient/statuschange/${props.id}`}>
                                    <Button variant="primary" type="submit" className="searchbarcontainer log">
                                        Change Status
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        : null
                        }
                    </div>
                </div>
                <div className="col-md-1 col-lg-1"></div>
                <div className="col-md-5  col-sm-12 col-lg-5 col-12 mb-2 p-0">
                    <div className="card-body card profile h-100">
                        <HeadingSmall  heading="Covid Test Info"/>
                        <p className="card-title pl-3">Covid Tested: <span className="font-weight-bold">  &ensp; &ensp;{test.is_tested===true? "Yes": "No"} </span></p>
                        <p className="card-title pl-3">Covid Test Type: <span className="font-weight-bold">  &ensp; &ensp;{test.type==="1"? "Rapid-Antigen": test.type==="2" ? "RT-PCR" : test.type==="3" ? "TrueNat":"N/A"} </span></p>
                        <p className="card-title pl-3">Covid Test Result: <span className="font-weight-bold">  &ensp; &ensp;{test.result==="1"? "Positive": test.result==="2" ? "Negative" : test.result==="3" ? "Awaited": test.result==="4"? "Rejected":"N/A"} </span></p>
                        <br />
                        <br />
                        <br />

                        <HeadingSmall  heading="Covid Vaccine Info"/>
                        <p className="card-title pl-3">Vaccinated: <span className="font-weight-bold">  &ensp; &ensp;{vaccine.is_vaccinated===true ? "Yes": "No"} </span></p>
                        {vaccine.vaccine_status? vaccine.vaccine_status.map((i,index)=>{
                            return(
                                <p className="card-title pl-3">Dose {index+1}: <span className="font-weight-bold">  &ensp; &ensp;{i.type==="1" ? `Covishield/${i.vaccinated_on}`: i.type==="2"? `Covaxin/${i.vaccinated_on}`:"N/A"} </span></p>
                            )
                        })
                        : null
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12 col-12 p-2 profile">
                
                    <div className="pt-2">
                        <HeadingSmall  heading="Health Info"/>
                        <Table responsive="md" className="">
                        <thead>
                        <tr>
                            <th>Updated At (Date(Time))</th>
                            <th>Patient Condition</th>
                            <th>SPO2 (%)</th>
                            <th>Blood Pressure</th>
                            <th>Temperature (F)</th>
                            <th>Pulse Rate (BPM)</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? 
                            <tr>
                                <td>
                                    <span>Loading.....</span>
                                    <Spinner animation="border" size="lg" className=""/>
                                
                                </td>
                            </tr>
                            :
                        null
                        }
                        {typeof(data)==="string"? data: 
                            <>
                            {data.map((i,index) => (
                        <tr>
                             <td>
                                {i.created_on? i.created_on.split("T")[0]: "N/A"}
                                ({i.created_on? i.created_on.split("T")[1].split(":")[0]: "N/A"}: {i.created_on? i.created_on.split("T")[1].split(":")[1]: "N/A"})
                             </td>
                            <td>{i.patient_condition==="1"? "Asymptomataic" : i.patient_condition==="2" ? "Mild" : i.patient_condition==="3" ? "Moderate" : "Severe" }</td>
                            <td>{i.oxy_level}%</td>
                            <td>{i.blood_pres_systolic}/{i.blood_pres_diastolic}(mm hg)</td>
                            <td>{i.temperature}(F)</td>
                            <td>{i.pulse_rate}(BPM)</td>
                            
                            
                        </tr>
                        ))}
                            </>
                        }
                        </tbody>
                     </Table>
                    </div>


                    {cookie.load("token")? 
                    <div className="card-body row">
                        <div className=" col-md-3 col-sm-3 col-6 col-lg-3 text-center">
                            
                            <Link to='/home' className="p-2">
                                <Button variant="primary" type="submit" className="searchbarcontainer log">
                                    Home
                                </Button>
                            </Link>
                            <Link to='/list' className="p-2">
                                <Button variant="primary" type="submit" className="searchbarcontainer log">
                                Active Patients
                                </Button>
                            </Link>
                        </div>
                        
                       
                    </div>
                    : 
                <       Link to='/'>
                            <Button variant="primary" type="submit" className="searchbarcontainer log">
                                Back
                            </Button>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}
