import React,{useState} from 'react'
import { Form, Button} from 'react-bootstrap' 
import {Redirect} from 'react-router-dom'
import {patientStatus, patientMigration, patientDeath} from '../../Api/patient.api'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import cookie from 'react-cookies'
export default function Statusform(props) {
  const {addToast} = useToasts()
  const initialState = {
      id: props.id,
      status: '',
      migrated_to: '',
      expired_on: '',
      reason: ''
  }
  const [state, setState] = useState(initialState)
  const handleSubmit = event => {
      if (state.status==="Referred"){
          state.status="M"
      }
      else if (state.status==="Death"){
        state.status="D"
      }
      else if(state.status==="Home Isolated"){
        state.status="H"
      }
      else{
          state.status="R"
      }
      event.preventDefault();
      const eData = { 
          patient_status: state.status
        }
      axios({
          url: patientStatus+`${state.id}/`,
          method: 'PATCH',
          data: eData,
          headers: {
            Authorization: `Token ${cookie.load('token')}`,
          },
        })
        .then(res=>{
          if (res.data.status===200){
            addToast(res.data.msg, { appearance: 'success' });
            setState({ redirect: true});
            if (state.status==="D" && state.reason.length!==0){
              const eda = { 
                reason: state.reason,
                patient_id: state.id,
                expired_on: state.expired_on
              }
              axios({
                url: patientDeath,
                method: 'POST',
                data: eda,
                headers: {
                  Authorization: `Token ${cookie.load('token')}`,
                },
              })
              .then(res=>{
                if (res.data.status===200){
                  addToast(res.data.msg, { appearance: 'success' });
                  setState({ redirect: true});
                }
                else if (res.data.status===400){
                  setState({ redirect: false});
                  addToast("Error occurred try again!!", { appearance: 'error' });
                }
              })
              .catch(error => {
                setState({ redirect: false});
                console.log(error)
                addToast('The server is not excepting any request at this moment!! Try again later', { appearance: 'error' });
              });
            }
            else if (state.status==="M" && (state.migrated_to.length!==0 || state.reason.length!==0)){
              const eda = { 
                migrated_to: state.migrated_to,
                reason: state.reason,
                patient_id: state.id
              }
              axios({
                url: patientMigration,
                method: 'POST',
                data: eda,
                headers: {
                  Authorization: `Token ${cookie.load('token')}`,
                },
              })
              .then(res=>{
                if (res.data.status===200){
                  addToast(res.data.msg, { appearance: 'success' });
                  setState({ redirect: true});
                }
                else if (res.data.status===400){
                  setState({ redirect: false});
                  addToast("Error occurred try again!!", { appearance: 'error' });
                }
              })
              .catch(error => {
                setState({ redirect: false});
                console.log(error)
                addToast('The server is not excepting any request at this moment!! Try again later', { appearance: 'error' });
              });
            }
          }
          else if (res.data.status===400){
            setState({ redirect: false});
            addToast("Error occurred try again!!", { appearance: 'error' });
          }
        })
        .catch(error => {
          setState({ redirect: false});
          console.log(error)
          addToast('The server is not excepting any request at this moment!! Try again later', { appearance: 'error' });
        });
        //  Facility change api
        
        
        
    }
    const handleChange = event =>{
      setState({ ...state, [event.target.name]: event.target.value,         
      });
    }

    if (state.redirect){
        return <Redirect to='/list' />
    }
    return (
        <div className="container">
            <Form className="loginform" onSubmit={handleSubmit} id="form">
                
                <Form.Group controlId='status'>
                    <Form.Control
                        as='select'
                        name='status'
                        required
                        onChange= { handleChange }
                    >
                        <option>Select Status</option>
                        <option>Referred</option>
                        <option>Recovered</option>
                        <option>Death</option>
                        <option>Home Isolated</option>
                        
                    </Form.Control>
                </Form.Group>
                {state.status==="Referred"?
                    <>
                    <Form.Group controlId='reason'>
                      <Form.Control
                          as='textarea'
                          name='reason'
                          required
                          placeholder="Cause of migration...."
                          rows="3"
                          onChange= { handleChange }
                      >                
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='migrated_to'>
                    <Form.Control
                        as='textarea'
                        name='migrated_to'
                        required
                        placeholder="Referred to...."
                        rows="4"
                        onChange= { handleChange }
                    >                
                    </Form.Control>
                    </Form.Group>
                    
                    </>
                    : null
                }
                {state.status==="Death"?
                    <>
                    <Form.Group controlId='ex'>
                      <Form.Control
                          type="date"
                          name='expired_on'
                          required
                          placeholder="YYYY-MM-DD"
                          onChange= { handleChange }
                      >                
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='reason'>
                      <Form.Control
                          as='textarea'
                          name='reason'
                          required
                          placeholder="Cause of Death...."
                          rows="3"
                          onChange= { handleChange }
                      >                
                      </Form.Control>
                    </Form.Group>
                    </>
                    : null
                }
                <Button variant="primary" type="submit" className="button my-2 p-2">
                    Submit
                </Button>
            </Form>
        </div>
    )
}
