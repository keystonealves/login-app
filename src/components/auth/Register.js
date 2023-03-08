import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../../helper/validade';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import convertToBase64 from "../../helper/convert";
import { registerUser } from "../../helper/helper";

import styles from '../../styles/Username.module.css';


export default function Register() {

    const navigate = useNavigate();
    const [file, setFile] = useState();

    const formik = useFormik({
        initialValues : {
            email : '',
            username : '',
            password : '',
            showPassword: false
        },
        validate : registerValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            values = await Object.assign(values, { profile : file || '' });
            let registerPromisse = registerUser(values);
            toast.promise(registerPromisse, {
                loading: 'Criando cadastro...',
                success: <b>Registro criado com sucesso!</b>,
                error: <b>Não foi possível criar o cadastro, tente novamente mais tarde!</b>
            });

            registerPromisse.then(function (){ navigate('/')});
        }
    })

    /* formik não suporta upload de arquivos, será necessário criar um handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }



    return (
        <div className="container mx-auto">

            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass} style={{width: "45%", height: "85%"}}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Criar cadastro</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Preencha os dados e se preferir selecione uma foto de perfil
                        </span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <label htmlFor="profile">
                                <img src={file || avatar} className={styles.profile_img} 
                                alt="avatar" />
                            </label>

                            <input onChange={onUpload} type="file" id="profile" name="profile" />
                            
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                                <input
                                    {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder="Informe seu email*"
                                />
                                <input
                                    {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Crie um usuário/apelido*"
                                />

                            <div className="relative w-3/4">
                                <input
                                    {...formik.getFieldProps('password')}
                                    className={styles.textbox_pwd}
                                    type={formik.values.showPassword ? "text" : "password"}
                                    placeholder="Crie uma senha*"
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

                            <button type="submit" className={styles.btn}>Criar cadastro</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500 text-sm">Já tem cadastro? <Link className="text-red-500" to="/">Entrar</Link></span>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}