import { VALIDATION_RULES } from '../constants/config';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  return passwordRegex.test(password);
};

export const validateName = (name) => {
  return name.length >= VALIDATION_RULES.NAME_MIN_LENGTH && 
         name.length <= VALIDATION_RULES.NAME_MAX_LENGTH;
};

export const validateAddress = (address) => {
  return address.length > 0 && address.length <= VALIDATION_RULES.ADDRESS_MAX_LENGTH;
};

export const validateForm = (formData, isLogin = false) => {
  const errors = {};
  
  if (!isLogin) {
    if (!validateName(formData.name)) {
      errors.name = `Name must be between ${VALIDATION_RULES.NAME_MIN_LENGTH} and ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`;
    }
    if (!validateAddress(formData.address)) {
      errors.address = `Address is required and must not exceed ${VALIDATION_RULES.ADDRESS_MAX_LENGTH} characters`;
    }
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Password: 8-16 chars, 1 uppercase, 1 special character';
  }
  
  return errors;
};
