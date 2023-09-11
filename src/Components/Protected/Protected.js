import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import { GlobalData } from './../GlobalData';

function Protected(props) {
    const contextdata = useContext(GlobalData);
    const {Component} = props;
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(0);
    useEffect(() => {
        setLoggedIn(1)
        if (loggedIn === 1) {
            if (!localStorage.getItem('user')) {
                navigate('/login');
            }
            // if(!contextdata.menus.includes("Balance Sheet")) 
            // {
            //     alert("Un-Authorized Access");
            //     localStorage.clear();
            //     navigate('/login')
            // }

            // else{
            //     console.log(localStorage.getItem('user'));
            // }
            // let obj= JSON.parse(localStorage.getItem('user'));
            // console.log(obj);
        }
    },[loggedIn])
    return (
        <div>
            <Component />
        </div>
    );
}

export default Protected;