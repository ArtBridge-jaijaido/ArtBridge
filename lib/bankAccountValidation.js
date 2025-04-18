export const validateBankAccount = ({ accountName, bankCode, bankNumber }) => {
    const errors = {};
  
    if (!accountName || accountName.trim().length < 2) {
      errors.accountName = "戶名至少需2個字";
    }
  
    if (!/^\d{3}$/.test(bankCode)) {
      errors.bankCode = "銀行代碼應為3位數字";
    }
  
    if (!/^\d{9,14}$/.test(bankNumber)) {
      errors.bankNumber = "銀行帳戶應為9-14位數字";
    }
  
    return errors;
  };