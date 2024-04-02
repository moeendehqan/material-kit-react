
import axios from 'axios'

const OnRun = 'http://127.0.0.1:8081'

const client = axios.create({baseURL:OnRun})



export const captcha = async () =>{
    const {data} = await client.get('/auth/captcha')
    return data
}


export const applyCaptcha = async (phone, input_captcha, encrypted_response) => {
    const { data } = await client.post('/auth/applycaptcha', { phone, input_captcha, encrypted_response });
    return data;
}

export const Login = async (phone, otp) => {
    const { data } = await client.post('/auth/login', { phone, otp });
    return data;
}

export const LoginByUid = async (uid) => {
    const { data } = await client.post('/auth/uid', { uid });
    return data;
}

export const GetLastNotifUser = async (uid) => {
    const { data } = await client.post('/notifivation/getlastuser', { uid });
    return data;
}

export const MarkAllNotifRead = async (uid) => {
    const { data } = await client.post('/notifivation/markallread', { uid });
    return data;
}