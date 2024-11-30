import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import EmailOnlyLogin from "./authOptions/EmailOnlyLogin";
import EmailPasswordLogin from "./authOptions/EmailPasswordLogin";
import GeographicLogin from "./authOptions/GeographicLogin";
import PasskeyLogin from "./authOptions/PasskeyLogin";

import "../../styles/LoginPage.css";

export default function LoginPage({ isTrackingEye, setIsTrackingEye }) {

    const [choseLoginDisplay, setChoseLoginDisplay] = useState(true);
    const [chosenOption, setChosenOption] = useState(null);
    const options = ["emailOnly", "emailPassword", "geographic", "passkey"];

    useEffect(() => {
        if (isTrackingEye) {
            window.webgazer.resume();
            // Hide the webgazer video container
            const webgazerVideoContainer = document.getElementById('webgazerVideoContainer');
            if (webgazerVideoContainer) {
                webgazerVideoContainer.style.display = 'none';
            }
        }

        return () => {
            if (isTrackingEye) {
                setIsTrackingEye(false);
                window.webgazer.pause();
            }
        };
    }, [isTrackingEye, setIsTrackingEye]);

    const optionToChoice = (option) => {
        switch (option) {
            case "emailOnly":
                setChosenOption(<EmailOnlyLogin />);
                break;
            case "emailPassword":
                setChosenOption(<EmailPasswordLogin />);
                break;
            case "geographic":
                setChosenOption(<GeographicLogin />);
                break;
            case "passkey":
                setChosenOption(<PasskeyLogin />);
                break;
            default:
                setChosenOption(null);
        }
    };

    const choiceToDescriptionText = (option) => {
        switch (option) {
            case "emailOnly":
                return "Email Only Login. This option requires you to enter your email address only. Afterwards you will receive an email with a code to login.";
            case "emailPassword":
                return "The classical Email and Password Login";
            case "geographic":
                return "Geographic Login: choose a location on the map and a phrase that you connect with that location";
            case "passkey":
                return "Passkey Login: Scan a QR code with your phone to login";
            default:
                return "No option selected";
        }
    };

    const chooseTwoLoginOptions = () => {
        const randomOption1 = Math.floor(Math.random() * 4);
        let randomOption2;
        do {
            randomOption2 = Math.floor(Math.random() * 4);
        } while (randomOption1 === randomOption2);
        const option1 = options[randomOption1];
        const option2 = options[randomOption2];
        return [option1, option2];
    };

    const handleLoginChoice = (option) => {
        optionToChoice(option);
        setChoseLoginDisplay(false);
    };

    const displayTwoLoginOptions = () => {
        const [option1, option2] = chooseTwoLoginOptions();

        return (
            <div>
                <button onClick={() => handleLoginChoice(option1)}>{choiceToDescriptionText(option1)}</button>
                <button onClick={() => handleLoginChoice(option2)}>{choiceToDescriptionText(option2)}</button>
            </div>
        );
    };

    return (
        <>
            {choseLoginDisplay && 
                <>
                    <p>Login Page</p>
                    <p>To continue, please select one of the authentication processes provided</p>
                    {displayTwoLoginOptions() }
                </>
            }

            {
                !choseLoginDisplay && chosenOption
            }

        </>
    );
}