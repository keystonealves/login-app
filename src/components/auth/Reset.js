import React, { useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../../helper/validade';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { resetPassword } from "../../helper/helper";
import { useAuthStore } from "../../store/store";
import { useNavigate, Navigate } from "react-router-dom";
import useFetch from '../../hooks/fetch.hook';


import styles from '../../styles/Username.module.css';
import { useStore } from "zustand";

export default function Reset() {

    const { username } = useAuthStore(state => state.auth);
    const navigate = useNavigate();
    const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');



    const formik = useFormik({
        initialValues : {
            password : '',
            confirm_pwd : '',
            showPassword: false
        },
        validate : resetPasswordValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            
            let resetPromise = resetPassword({ username, password: values.password });

            toast.promise(resetPromise, {
                loading: 'Alterando senha...',
                success: <b>Senha alterada com sucesso!</b>,
                error: <b>Não foi possível alterar a senha, tente novamente em alguns instantes!</b>
            });

            resetPromise.then(function(){navigate('/password')})
        }
    })


    if(isLoading) return <h1 className="text-2xl font-bold"></h1>;
    if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
    if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

    return (
        <div className="container mx-auto">

            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Alterar senha!</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Digite uma nova senha
                        </span>
                    </div>

                    <form className="py-10" onSubmit={formik.handleSubmit}>

                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="relative w-3/4">
                                <input
                                    {...formik.getFieldProps('password')}
                                    className={styles.textbox_pwd}
                                    type={formik.values.showPassword ? "text" : "password"}
                                    placeholder="Nova senha"
                                />

                                <button
                                    type="button"
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
                                    onClick={() => formik.setFieldValue("showPassword", !formik.values.showPassword)}
                                >
                                    {formik.values.showPassword ? (
                                        <EyeOffIcon className="h-6 w-6 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-6 w-6 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="relative w-3/4">
                                <input
                                    {...formik.getFieldProps('confirm_pwd')}
                                    className={styles.textbox_pwd}
                                    type={formik.values.showPassword ? "text" : "password"}
                                    placeholder="Repita a senha"
                                />

                                <button
                                    type="button"
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 focus:outline-none"
                                    onClick={() => formik.setFieldValue("showPassword", !formik.values.showPassword)}
                                >
                                    {formik.values.showPassword ? (
                                        <EyeOffIcon className="h-6 w-6 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-6 w-6 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <button type="submit" className={styles.btn}>Alterar senha</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}