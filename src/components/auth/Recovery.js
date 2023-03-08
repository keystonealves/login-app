import React, { useEffect, useState } from "react";
import { toast, Toaster } from 'react-hot-toast';
import { generateOTP, verifyOTP } from "../../helper/helper";
import { useAuthStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

import styles from '../../styles/Username.module.css';

export default function Recovery() {


    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const navigate = useNavigate();

    useEffect(() => {

        generateOTP(username).then((OTP) => {
            if(OTP) return toast.success('Código enviado para seu email!')
            return toast.error('Ocorreu um problema ao gerar o seu código!')
        })

    },[username]);

    async function onSubmit(e){
        e.preventDefault();

        try {

            let { status } = await verifyOTP({ username, code: OTP })
            if(status === 201) {
                toast.success('Código verificado com sucesso!');
                navigate('/reset');
            }
        } catch (error) {
            return toast.error('Código inválido, verifique novamente seu email ou solicite um novo código!')
        }


    }

    // handler of resend OTP
    function resendOTP(){
        let sendPromise = generateOTP(username);

        toast.promise(sendPromise, {
            loading: 'Enviando código...',
            success: <b>Código enviado para seu email!</b>,
            error: <b>Não foi possível enviar o código, tente novamente em alguns instantes!</b>
        });

        sendPromise.then(OTP => {
            // console.log(OTP);
        })
    }

    return (
        <div className="container mx-auto">

            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Recuperar senha</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Informe o código enviado para recuperar sua senha
                        </span>
                    </div>

                    <form className="py-10" onSubmit={onSubmit}>

                        <div className="textbox flex flex-col items-center gap-6">

                            <div className="input text-center">
                                <span className="py-4 text-sm text-left text-gray-500">
                                    Digite o código de 6 dígitos enviado para o seu email.
                                </span>
                                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder="Código" />
                            </div>

                            <button type="submit" className={styles.btn}>Validar código</button>
                        </div>
                    </form>

                        <div className="text-center py-4">
                            <span className="text-gray-500 text-sm">Não recebeu o código? <button onClick={resendOTP} className="text-red-500">Enviar novamente</button></span>
                        </div>

                        <div className="mx-auto bg-yellow-200 rounded-xl px-6 text-center py-4 max-w-lg">
                            <h1 className="text-red-500 text-2xl font-bold">ATENÇÃO!</h1>
                            <span className="text-gray-500 text-sm">Essa funcionalidade está sendo demonstrada apenas para fins de testes e estudos, para encaminhar o código em produção para o email do usuário, será necessário uma implementação mais detalhada, em breve publicarei outros projetos com esta implementação melhorada!</span>
                        </div>

                </div>
            </div>
        </div>
    )
}