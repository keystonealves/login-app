import toast from 'react-hot-toast';
import { authenticate } from './helper';



/* validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({},values);

    if(values.username){
        //check user exist or not
        const { status } = await authenticate(values.username);

        if(status !== 200) {
            errors.exist = toast.error('Usuário não encontrado!');
        }
    }
    
    return errors;
}




/* validate password */
export async function passwordValidate(values) {    
    const errors = passwordVerify({},values);
    
    return errors;
}





/* validate reset password */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({},values);
    
    if(values.password !== values.confirm_pwd) {
        errors.exist = toast.error("As senhas não conferem!")
    }
    
    return errors;
}




/* validate register form */
export async function registerValidation(values) {    
    const errors = usernameVerify({},values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    
    return errors;
}


/* validate register form TO PROFILE*/
export async function profileEditValidation(values) {    
    const errors = usernameVerify({},values);
    // passwordVerify(errors, values);
    emailVerify(errors, values);
    
    return errors;
}




/* validate profile page */
export async function profileValidation(values) {    
    const errors = emailVerify({},values);
    usernameVerify(errors, values);
    passwordVerify(errors, values);
    
    return errors;
}




/* *********************************************************************** */




/* validate password */
function passwordVerify(errors = {}, values) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password) {
        errors.password = toast.error("Informe uma senha.")
    } else if(values.password.includes(" ")) {
        errors.password = toast.error("Senha não confere.")
    } else if(values.password.length <= 3 ) {
        errors.password = toast.error("Senha deve ter mais que 3 caracteres.")
    } else if(!specialChars.test(values.password)) {
        errors.password = toast.error("Senha deve conter pelo menos um caracter especial.")
    }

    if (values.showPassword && !values.password) {
        errors.showPassword = toast.error("Informe uma senha.")
    }

    return errors;
}




/* validate username */
function usernameVerify(error = {}, values) {
    if(!values.username) {
        error.username = toast.error("Informe um usuário");
    } else if(values.username.includes(" ")){
        error.username = toast.error("Usuário não informado!");
    }
    
    return error;
}



/* validate email */
function emailVerify(error = {}, values) {
    if(!values.email) {
        error.email = toast.error("Informe um email");
    } else if(values.email.includes(" ")){
        error.email = toast.error("Email não informado");
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Formato de email inválido");
    }
    
    return error;
}