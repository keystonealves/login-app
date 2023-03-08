import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../../helper/validade';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import useFetch from "../../hooks/fetch.hook";
import { useAuthStore } from "../../store/store";
import { verifyPassword } from "../../helper/helper";

import styles from '../../styles/Username.module.css';


export default function Password() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

    const formik = useFormik({
        initialValues : {
            password : '',
            showPassword: false
        },
        validate : passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            
            let loginPromisse = verifyPassword({ username, password: values.password })
            toast.promise(loginPromisse, {
                loading: 'Conferindo dados...',
                success: <b>Login realizado com sucesso!</b>,
                error: <b>Senha incorreta!</b>
            });

            loginPromisse.then(res => {
                let { token } = res.data;
                localStorage.setItem('token', token);

                navigate('/profile');
            })
        }
    })

    if(isLoading) return <h1 className="text-2xl font-bold"></h1>;
    if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;



    return (
        <div className="container mx-auto">


            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Olá {apiData?.firstName || apiData?.username}!</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Digite sua senha
                        </span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="relative w-3/4">
                                <input
                                    {...formik.getFieldProps('password')}
                                    className={styles.textbox_pwd}
                                    type={formik.values.showPassword ? "text" : "password"}
                                    placeholder="Senha"
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

                            <button type="submit" className={styles.btn}>Entrar</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500 text-sm">Esqueceu sua senha? <Link className="text-red-500" to="/recovery">Recupere</Link></span>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}