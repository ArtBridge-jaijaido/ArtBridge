"use client";
import React, { useState } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { ValidateFormData } from '@/lib/formValidation.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import Link from "next/link";
import CustomButton from '@/components/CustomButton/CustomButton.jsx';
import styles from "./registerButton.module.css";
import "./register.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

const RegisterPage = () => {



    const [errors, setErrors] = useState({}); // 錯誤訊息
    const { addToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const handleRoleSelect = (role) => {

        setFormData((prev) => ({
            ...prev,
            role,
        }));
    };

    const [formData, setFormData] = useState({
        role: "",
        nickname: "",
        realname: "",
        email: "",
        password: "",
        phone: "",
        id: "",
        frontImage: null,
        backImage: null,
        termsAccepted: false
    });

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: file,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {

        console.log("表單送出：", formData);
        e.preventDefault();
        const validationErrors = ValidateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            addToast("error", "註冊失敗: 請檢查表單");
            return;
        } else {
            addToast("success", "註冊成功");
            setErrors({});
        }


    }



    return (
        <div className={`register-page ${notoSansTCClass}`}>
            <div className="register-top-part-container">
                <div className="register-logo">LOGO</div>
                <div className="register-ArtistClientButtons-container">
                    <CustomButton
                        title="繪師"
                        className={`${styles.registerArtistClientBtn} ${formData.role === "artist" ? styles.active : ""
                            }`}
                        onClick={() => handleRoleSelect("artist")}
                    />
                    <CustomButton
                        title="委託方"
                        className={`${styles.registerArtistClientBtn} ${formData.role === "client" ? styles.active : ""
                            }`}
                        onClick={() => handleRoleSelect("client")}
                    />
                </div>
            </div>

            {/* 單一個表單（左右兩欄） */}
            <form className="register-form-container">
                {/* 左欄：暱稱、真實姓名、Email、密碼、同意條款 */}
                <div className="register-form-column left-column">
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="暱稱 (至多 8 個字)"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                        />
                        {errors.nickname && <span className="register-error-text">{errors.nickname}</span>}
                    </div>
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="真實姓名"
                            name="realname"
                            value={formData.realname}
                            onChange={handleChange}
                        />
                        {errors.realname && <span className="register-error-text">{errors.realname}</span>}
                    </div>
                    <div className="register-form-group">
                        <input type="email"
                            placeholder="電子郵件"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}


                        />
                        {errors.email && <span className="register-error-text">{errors.email}</span>}
                    </div>
                    <div className="register-form-group ">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="密碼"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}


                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="register-show-password-btn"
                        >
                            {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                        </button>
                        {errors.password && <span className="register-error-text">{errors.password}</span>}
                    </div>

                </div>

                {/* 右欄：手機號碼、身分證、身分證正面、身分證反面 */}
                <div className="register-form-column right-column">
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="手機號碼"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}

                        />
                        {errors.phone && <span className="register-error-text">{errors.phone}</span>}
                    </div>
                    <div className="register-form-group">
                        <input type="text"
                            placeholder="身分證 (對外顯示不會公開)"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}

                        />
                        {errors.id && <span className="register-error-text">{errors.id}</span>}
                    </div>
                    <div className="register-file-container">
                        {/* 身分證正面 */}
                        <label className="register-file-box">
                            {formData.frontImage ? (
                                <img src={URL.createObjectURL(formData.frontImage)} alt="正面預覽" className="register-preview-image" />
                            ) : (
                                <span>身分證正面</span>
                            )}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, "frontImage")}
                                hidden
                            />
                        </label>

                        {/* 身分證反面 */}
                        <label className="register-file-box">
                            {formData.backImage ? (
                                <img src={URL.createObjectURL(formData.backImage)} alt="反面預覽" className="register-preview-image" />
                            ) : (
                                <span>身分證反面</span>
                            )}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, "backImage")}
                                hidden
                            />
                        </label>
                    </div>

                </div>
            </form>
            <div className="register-bottom-part-container">
                <div className="register-form-agree">
                    <input type="checkbox"
                        id="agree"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                    />
                    <label>我已同意繪夢工坊<span>網站服務條款</span></label>
                    {errors.termsAccepted && <span className="register-error-text">{errors.termsAccepted}</span>}
                </div>

                <div className="register-alreadyHasAccount">
                    <span>已經有帳號？</span>
                    <Link href="/login">登入</Link>
                </div>
            </div>
            <CustomButton title="註冊" className={styles.registerArtistClientBtn} onClick={handleSubmit} />
        </div>
    )
}

export default RegisterPage
