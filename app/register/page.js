"use client";
import React, { useState } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import { ValidateFormData } from '@/lib/formValidation.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import { useNavigation } from '@/lib/functions.js';
import Link from "next/link";
import CustomButton from '@/components/CustomButton/CustomButton.jsx';
import LoadingButton from "@/components/LoadingButton/LoadingButton";
import DatePicker from "@/components/DatePicker/DatePicker";
import styles from "./registerButton.module.css";
import "./register.css"
import '@fortawesome/fontawesome-free/css/all.min.css';


const RegisterPage = () => {

    const [errors, setErrors] = useState({}); // error messages
    const { addToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigation();

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
        gender: "",
        birthday: "",
        termsAccepted: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("表單送出：", formData);

        // 驗證表單資料
        const validationErrors = ValidateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            addToast("error", "註冊失敗: 請檢查表單");
            return;
        }

        setIsSubmitting(true);


        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), 
            });

            const result = await response.json();
            if (response.ok) {
                addToast("success", "註冊成功，已發送驗證信至您信箱");
                navigate(`/emailValidation?email=${formData.email}`);
            } else {
                addToast("error", `註冊失敗: ${result.message}`);
            }
        } catch (error) {
            addToast("error", "註冊失敗");
        }

        finally {
            setIsSubmitting(false);
        }
    };



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
                            maxLength={20}

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

                {/* 右欄：手機號碼、性別、生日 */}
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

                    {/* 性別 dropdown */}
                    <div className="register-form-group register-form-group-gender">
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">請選擇性別</option>
                            <option value="male">男生</option>
                            <option value="female">女生</option>
                            <option value="preferNotToSay">不透漏</option>
                        </select>
                        {errors.gender && <span className="register-error-text">{errors.gender}</span>}
                    </div>

                    {/* 生日  */}
                    <div className="register-form-group register-form-group-birthday">
                        <DatePicker
                            value={formData.birthday}
                            onChange={(date) => setFormData((prev) => ({ ...prev, birthday: date }))}
                        />
                        {errors.birthday && <span className="register-error-text">{errors.birthday}</span>}
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
            <LoadingButton loadingText={"註冊中..."}   className={`${styles.registerArtistClientBtn} register-submit-buttom ${isSubmitting ? "register-is-loading" : ""}`} isLoading={isSubmitting} onClick={handleSubmit}>
                註冊
            </LoadingButton>
        </div>
    )
}

export default RegisterPage
