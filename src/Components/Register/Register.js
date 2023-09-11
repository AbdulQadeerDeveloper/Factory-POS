import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './../../logos.png';

function Register() {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(0);
    const [err, setErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        Username: null,
        Email: null,
        Password: null
    })
    function RegisterationAccess() {
        if (user.Username !== null && user.Email !== null && user.Password !== null) {
            localStorage.setItem('user', true);
            setErr("");
            navigate('/');
        }else{
            setErr("All Fields Are Required!");
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
                                    type="text"  
                                    placeholder='UserName' 
                                    className='form-control' 
                                    onChange={(e) => setUser({...user, Username: e.target.value})}
                                    value={user.Username !== null ? user.Username : ''} />
                                <br/>
                                <input 
                                    type="email" 
                                    placeholder='Email' 
                                    className='form-control' 
                                    onChange={(e) => setUser({...user, Email: e.target.value})}
                                    value={user.Email !== null ? user.Email : ''} />
                                <br/>
                                <input 
                                    type="password" 
                                    placeholder='Password' 
                                    className='form-control' 
                                    onChange={(e) => setUser({...user, Password: e.target.value})}
                                    value={user.Password !== null ? user.Password : ''} />
                                <br/>

                                <div className='SignIn_SignUp_Form_Bottom_Area'>
                                    <div className='SignIn_SignUp_Form_Left'>
                                        <button disabled={isLoading} onClick={RegisterationAccess} className='btn btn-info SignUp_SignIn_Btn'>{isLoading ? "Registering..." : "Sign Up" }</button>
                                    </div>
                                    <div className='SignIn_SignUp_Form_Right'>
                                        {/* <Link to="/forgot" className='forget_password'>Already have account??</Link> &nbsp; */}
                                        <span className='forget_password'>Already have account??</span> &nbsp;
                                        <Link to="/login" className='btn btn-info SignUp_SignIn_Btn'>Login</Link>
                                    </div>
                                    <div className='clearfix'></div>
                                </div>
                                <br/>
                                <div className='clearfix'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;