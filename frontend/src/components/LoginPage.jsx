import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function LoginPage({isTrackingEye}) {

    useEffect(() => {
        if(isTrackingEye) {
            window.webgazer.resume();
        }

        return () => {
            if(isTrackingEye) {
                window.webgazer.end();
            }
        };
    }, [])

    return(
        <>
            <p>Login Page</p>
        </>
    )
}