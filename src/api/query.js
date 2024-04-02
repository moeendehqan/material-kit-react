import { useQuery, useMutation, useQueryClient } from 'react-query';

import * as api from './api';

export const useCaptcha = () => useQuery(['captcha'], api.captcha);



export const useApplyCaptcha = (phone, input_captcha, encrypted_response) =>{
    const queryClient = useQueryClient();
    return useMutation(()=>api.applyCaptcha(phone, input_captcha, encrypted_response),{
        onSuccess: async () => {
            await queryClient.refetchQueries('applyCaptcha');
        },
    })
}


export const useLogin = (phone, otp) =>{
    const queryClient = useQueryClient();
    return useMutation(()=>api.Login(phone, otp),{
        onSuccess: async () => {
            await queryClient.refetchQueries('login');
        },
    })
}


export const useLoginByUid = (uid) =>{
    const queryClient = useQueryClient();
    return useMutation(()=>api.LoginByUid(uid),{
        onSuccess: async () => {
            await queryClient.refetchQueries('loginuid');
        },
    })
}

export const useGetLastNotifUser = (uid) =>{
    const queryClient = useQueryClient();
    return useMutation(()=>api.GetLastNotifUser(uid),{
        onSuccess: async () => {
            await queryClient.refetchQueries('allnotifuser');
        },
    })
}