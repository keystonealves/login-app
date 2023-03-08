import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from '../../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validade';
import { useAuthStore } from "../../store/store";
import gif from '../../assets/gif.gif'

import styles from '../../styles/Username.module.css';

export default function Username() {


    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername);

    const formik = useFormik({
        initialValues : {
            username : ''
        },
        validate : usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            setUsername(values.username);
            navigate('/password');
        }
    })



    return (
        <div className="container mx-auto">

            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Olá!</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Digite seu usuário
                        </span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            {/* <img src={avatar} className={styles.profile_img} alt="avatar" /> */}
                            <img src={gif} className="mx-auto h-56" alt="avatar" />
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
                            <button type="submit" className={styles.btn}>Vamos lá!</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500 text-sm">Ainda não é membro? <Link className="text-red-500" to="/register">Crie sua conta</Link></span>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}