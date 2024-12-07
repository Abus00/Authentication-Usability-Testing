import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import EmailOnlyLogin from "./authOptions/EmailOnlyLogin";
import EmailPasswordLogin from "./authOptions/EmailPasswordLogin";

import "../../styles/loginStyles/LoginPage.css";

export default function LoginPage({ isTrackingEye, setIsTrackingEye }) {

    const [choseLoginDisplay, setChoseLoginDisplay] = useState(true);
    const [chosenOption, setChosenOption] = useState(null);
    const options = ["emailOnly", "emailPassword"];

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
            default:
                return "No option selected";
        }
    };

    const chooseTwoLoginOptions = () => {
        const randomOption1 = Math.floor(Math.random() * options.length);
        let randomOption2;
        do {
            randomOption2 = Math.floor(Math.random() * options.length);
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