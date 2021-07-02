import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'


function ForgetPassword(){


    const [email, setEmail ] = useState('')

    const onChangeInput = e =>{
        console.log(e.target.value)
        setEmail(e.target.value)}
    const resetSubmit = async e=>{
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/user/password-recovery', {email})
            .then(res=> alert(res.data.msg));
            
         
        }
        catch (err) {
            alert(err)
        }
    }
    return (
        <div className="login-page">
        <form onSubmit={resetSubmit}>
            <h2>Input your email</h2>
            <input type="email" name="email" required
            placeholder="Email" value={email} onChange={onChangeInput} />

            <div className="row">
                <button type="submit">Submit</button>
                <Link to="/register">Register</Link>
            </div>
        </form>
    </div>
    )
}


export default ForgetPassword