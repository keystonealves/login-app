import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


// Make API requests


// To get username from Token
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject('Token de autenticação inválido!');
    let decode = jwt_decode(token);
    return decode;
}

// Authenticate function
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error: "Usuário não existe!"}
    }
}


// get user details
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Senha incorreta!"}
    }
}


// Register user function
export async function registerUser(credentials){
    try {
        const { data: {msg}, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        // send email
        if(status === 201){
            await axios.post(`/api/registerMail`, { username, userEmail: email, text: msg})
        }

        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({ error })
    }
}


// Login function
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password });
            
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Senha incorreta!" })
    }
}


// Update user function
export async function updateUser(response){
    try {

        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, { headers: { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data });


    } catch (error) {
        return Promise.reject({ error: "Não foi possível atualizar os dados!" })
    }
}


// Delete user function
export async function deleteUser(id){
    try {

        const token = await localStorage.getItem('token');
        const data = await axios.delete('/api/deleteUser', { params : { id }, headers: { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data });


    } catch (error) {
        return Promise.reject({ error: "Não foi possível excluir o usuário!" })
    }
}


// generate OTP
export async function generateOTP(username){
    try {

        const { data: { code }, status } = await axios.get('/api/generateOTP', { params : { username } })

        // send mail with the OTP
        if(status === 201) {
            let { data: { email }} = await getUser({ username });
            let text = `Seu código para recuperação de senha é ${code}`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Código para recuperação de senha."})
        }

        return Promise.resolve(code);

    } catch (error) {
        return Promise.reject({ error })
    }
}


// Verify OTP
export async function verifyOTP({ username, code }){
    try {

        const { data, status } = await axios.get('/api/verifyOTP', { params: {username, code}});

        return { data, status };

    } catch (error) {
        return Promise.reject(error)
    }
}


// Reset Password
export async function resetPassword({ username, password }){
    try {

        const { data, status } = await axios.put('/api/resetPassword', { username, password });

        return Promise.resolve({ data, status });

    } catch (error) {
        return Promise.reject({ error })
    }
}