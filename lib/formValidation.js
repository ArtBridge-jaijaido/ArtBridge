export const ValidateFormData=(formData)=>{
    let errors = {};

    // 檢查是否有勾選角色
    if (!formData.role) {
        errors.role = '請選擇角色';
    }

    // 檢查是否有填寫暱稱
    if (!formData.nickname) {
        errors.nickname = '暱稱為必填項目';
    }else if (formData.nickname.length > 8) {
        errors.nickname = "請填寫暱稱（最多 8 字）";
    }

    // 檢查是否有填寫真實姓名
    if (!formData.realname) {
        errors.realname = '真實姓名為必填項目';
    }


    // 檢查是否有填寫Email
    if (!formData.email) {
        errors.email = 'Email為必填項目';
    }else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "請輸入有效的電子郵件地址";
    }

    // 檢查是否有填寫密碼
    if (!formData.password) {
        errors.password = '密碼為必填項目';
    } else if (formData.password.length < 6) {
        errors.password = "密碼長度至少 6 字";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}/.test(formData.password)) {
        errors.password = "密碼需包含大小寫字母和數字";
    }

    // 檢查是否有填寫手機號碼
    if (!formData.phone) {
        errors.phone = '手機號碼為必填項目';
        }else {
            const normalizedPhone = formData.phone.replace(/[-\s]/g, ""); // 去掉空格和連字符
            if (!/^09\d{8}$/.test(normalizedPhone)) {
                errors.phone = "請輸入有效的台灣手機號碼";
            }
        }
    

    // 檢查是否有填寫身分證
    if (!formData.id) {
        errors.id = '身分證字號為必填項目';
    }else if (!/^[A-Z][12]\d{8}$/.test(formData.id)) {
        errors.id = '請輸入有效的身分證字號';
    }

      // 檢查是否有上傳身分證正面
      if (!formData.frontImage) {
        errors.frontImage = "請上傳身分證正面圖片";
    }

    // 檢查是否有上傳身分證反面
    if (!formData.backImage) {
        errors.backImage = "請上傳身分證反面圖片";
    }

    // 檢查是否同意條款
    if (!formData.termsAccepted) {
        errors.termsAccepted = "請同意使用條款";
    }


    return errors;


}








