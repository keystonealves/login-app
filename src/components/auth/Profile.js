import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from '../../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileEditValidation } from '../../helper/validade';
import convertToBase64 from "../../helper/convert";
import useFetch from "../../hooks/fetch.hook";
import { useAuthStore } from "../../store/store";
import { deleteUser, updateUser, getUsername } from "../../helper/helper";

import styles from '../../styles/Username.module.css';
import extend from '../../styles/Profile.module.css';


export default function Profile() {

    const [file, setFile] = useState();
    const [{ isLoading, apiData, serverError }] = useFetch();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    const formik = useFormik({
        initialValues : {
            firstName : apiData?.firstName || '',
            lastName : apiData?.lastName || '',
            email : apiData?.email || '',
            mobile : apiData?.mobile || '',
            username : apiData?.username || '',
            address : apiData?.address || '',
        },
        enableReinitialize: true,
        validate : profileEditValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            values = await Object.assign(values, { profile : file || apiData?.profile || ''})
            let updatePromise = updateUser(values);

            toast.promise(updatePromise, {
                loading: 'Atualizando informações...',
                success: <b>Informações atualizadas!</b>,
                error: <b>Não foi possível atualizar os dados!</b>,
            });
        }
    })

    /* formik não suporta upload de arquivos, será necessário criar um handler */
    // const onUpload = async e => {
    //     const base64 = await convertToBase64(e.target.files[0]);
    //     setFile(base64);
    // }

    const onUpload = async e => {
        const file = e.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10 MB em bytes
        if (file.size > maxSize) {
            // Se o arquivo for muito grande, exiba uma mensagem de erro ao usuário
            toast.error('A imagem selecionada é muito grande. Selecione um arquivo menor.');
            return;
        }
        const base64 = await convertToBase64(file);
        setFile(base64);
    }



    // create LOGOUT handler function
    function userLogout(){        
        localStorage.removeItem('token');
        navigate('/');
        toast('Usuário desconectado!');
    }


     // DELETE handler function
     const handlerDelete = async (e) => {
        e.preventDefault();
        const { userId } = await getUsername();

        setTimeout(() => {
            let deletePromise = deleteUser(userId);

            toast.promise(deletePromise, {
                loading: 'Excluindo conta...',
                success: <b>Conta excluída com sucesso!</b>,
                error: <b>Não foi possível excluir a conta, tente novamente em alguns instantes!</b>
            })
            
            deletePromise.then(function (){ navigate('/')});
        },2000)



    };



    if(isLoading) return <h1 className="text-2xl font-bold"></h1>;
    if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;



    return (
        <div className="container mx-auto">

            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    // Define default options
                    duration: 4000,
                
                    // Default options for specific types
                    success: {
                      duration: 4000
                    },
                  }}
                ></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={`${styles.glass} ${extend.glass}`} style={{width: "45%", height: "85%"}}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Perfil</h4>
                        <span className="py-2 text-sm w-2/3 text-center text-gray-500">
                            Atualize suas informações pessoais ou altere a imagem do perfil
                        </span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <label htmlFor="profile">
                                <img key={file || apiData?.profile} src={file ? file : apiData?.profile || avatar} className={`${styles.profile_img}`} alt="avatar" crossOrigin="" />

                            </label>

                            <input onChange={onUpload} type="file" id="profile" name="profile" accept="image/*"/>
                            
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">

                            <div className="name flex w-3/4 gap-6">
                                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder="Nome" />
                                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder="Sobrenome" />
                            </div>

                            <div className="name flex w-3/4 gap-6">
                                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder="Telefone/Whatsapp" />
                                <input {...formik.getFieldProps('username')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder="Usuário/apelido" />
                            </div>

                                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder="Email" />

                            <div className="name flex w-3/4 gap-6">
                                <input {...formik.getFieldProps('address')} className={styles.textbox_pwd} type="text" placeholder="Endereço" />
                            </div>


                            <div className="name flex w-3/4 gap-6">
                                <button type="submit" className={styles.btn}>Atualizar Informações</button>
                                <button onClick={userLogout} type="submit" className={styles.btn_logout}>Desconectar</button>
                            </div>

                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500 text-sm">Excluir sua conta? <Link onClick={(e) => {
                                e.preventDefault();
                                setShowDialog(true)
                            }} className="text-red-500" to="/">Excluir</Link></span>

                            {/* CONFIRMAÇÃO DA EXCLUSÃO */}
                            {showDialog && (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p className="text-red-500 p-2">Tem certeza de que deseja excluir sua conta?</p>
                                    <div className="name flex w-3/4 gap-6">
                                        <button onClick={() => setShowDialog(false)} className={styles.btn}>Não quero cancelar</button>
                                        <button onClick={handlerDelete} className={styles.btn_delete}>Excluir</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}