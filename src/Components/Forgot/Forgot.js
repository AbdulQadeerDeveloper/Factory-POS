import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './../../logos.png';

function Forgot() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(0);
    const [err, setErr] = useState("");
    const [user, setUser] = useState({
        Email: null
    })
    function ForgotAccess() {
        if (user.Email !== null) {
            setErr("");
            console.log("Email Sending!");
            // navigate('/');
        }else{
            setErr("Email Is Required!");
        }
    }
    useEffect(() => {
        setLoggedIn(1)
        if (loggedIn === 1) {
            if (localStorage.getItem('user')) {
                navigate('/');
            }
        }
    },[loggedIn])
    return (
        <div>
            <div className='form_main_wrapper'>
                <div className='col-md-4 col-md-offset-4'>
                    <div className='form_area'>
                        <div className='form_content'>
                            <div className='logo_img'>
                                <img src={logo} alt="Logo" />
                            </div>
                            <div className='form_inputs_area'>
                                <div className='error form_error text-warning'>{err}</div>
                                <input 
                                    type="email" 
                                    placeholder='Email' 
                                    className='form-control' 
                                    onChange={(e) => setUser({...user, Email: e.target.value})}
                                    value={user.Email !== null ? user.Email : ''} />
                                <br/>
                                <div className='col-md-12' style={{margin: "0", padding: "0"}}>
                                    <div className='submit' style={{textAlign:"right"}}>
                                        <Link to="/login" className='btn btn-info SignUp_SignIn_Btn'>Login</Link> &nbsp;
                                        <button type="button" onClick={ForgotAccess} className='btn btn-info SignUp_SignIn_Btn'>Get Email</button>
                                    </div>
                                </div>
                                <div className='clearfix'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgot