import React from "react";
import "./ToggleButton.css";
import { notoSansTCClass } from '../../app/layout.js';





const ToggleButton = ({Title='', isToggled=false, handleToggle}) => {
    

    return (
        <div className={`toggle-container ${notoSansTCClass}`}>
            <span className="toggle-label">{Title}</span>
            <div
                className={`toggle-switch ${isToggled ? "toggled" : ""}`}
                onClick={handleToggle}
            >
                <div className="toggle-knob"></div>
            </div>
        </div>
    );
};

export default ToggleButton;