import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import queryString from 'query-string'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ConfirmPassword(props) {

    const [data, setData ] = useState({
        password : '' , passwordConfirm : '' 
    })
    const search = props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const token = params.get('token'); // bar
   // console.log(token)
    const onChangeInput = e =>{
        const {name, value} = e.target;
        setData({...data, [name]:value})
    }
    const resetSubmit = async e =>{
        e.preventDefault()
        if(data.password !== data.passwordConfirm){
       alert('Your password anf confirm must be same')}
        else if (data.password.length < 6 ) 
        alert('Your password must be more than 6 character')
        else  {
            await axios.post('http://localhost:5000/user/updatePassword', {newPassword : data.password, resetToken : token})
            .then(res => alert(res.data.msg))
        }
        
    }
    return (
        <div className="login-page">
        <form onSubmit={resetSubmit}>
            <h2>Input your password</h2>
            <input type="password" name="password" required
            placeholder="Password" value={data.password} onChange={onChangeInput} />
            <h2>Confirm your password</h2>
            <input type="password" name="passwordConfirm" required
            placeholder="confirm password" value={data.passwordConfirm} onChange={onChangeInput} />

            <div className="row">
                <button type="submit">Reset</button>
            </div>
        </form>
    </div>
    );
}

export default ConfirmPassword;