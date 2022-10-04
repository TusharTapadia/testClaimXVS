import React, {useContext, useEffect, useState} from "react"
import { Magic } from "magic-sdk"
import { ethers, providers } from "ethers"
import { toast } from "react-toastify"

import "./ConnectModal.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"


import VelvetImg from "../../assets/img/velvet.svg"
import MetamaskImg from "../../assets/img/metamask.webp"
import axiosHelper from "../../helper/axios-helper"
import axios from "axios"

const ConnectWalletModal = () => {

    const [email, setEmail] = useState("")

    const { 
        setCurrentAccount,
        setIsWalletConnected,
        setShowConnectWalletModal,
        showConnectWalletModal: show,
        setMagicProvider,
        currentAccount
    } = useContext(GlobalContext)

    function toggleConnectWalletModal() {
        setShowConnectWalletModal((prevState) => !prevState)
    }

    async function signinWithMagicLink(e) {
        e.preventDefault()
        try {
            const magic = new Magic("pk_live_5A41A4690CAFE701")
            const didToken = await magic.auth.loginWithMagicLink({
                email: email,
            })

            const provider = new providers.Web3Provider(magic.rpcProvider)
            setMagicProvider(provider)
            const signer = provider.getSigner()
            setCurrentAccount(await signer.getAddress())
            setIsWalletConnected(true)
            toggleConnectWalletModal()
        } catch (err) {
            console.log(err)
            console.log("some error while login with magic link")
        }
    }

    async function connectWalletWithMetamask() {
        try {
            const { ethereum } = window
            let width = window.innerWidth;
            if (!ethereum && width > 480) {
                toast.error("Get MetaMask -> https://metamask.io/", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                return
            }
            if (!ethereum && width <= 480) {
                window.open("https://metamask.app.link/dapp/app.velvet.capital/")
            }

            const account = await ethereum.request({ method: "eth_requestAccounts" })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signature = await signer.signMessage("Welcome to Velvet.Capital!\n\nClick to sign in and login to the app.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 30 days.");
            const address = await signer.getAddress();
            const response = await axios.post('https://defivas.xyz/login', {
                "address": address,
                "signature": signature
            });
           
            // try{
            // const result = await axiosHelper("http://139.59.23.167:2000/login", "POST", null, {
            //     "address": "0x56A889C45A2cE2167d9AC0084208F4e6199be42f",
            //     "signature": "0x59730f120ea6e6188522f4050328951697ea6e58a401acb64ca496612de7236f130489addba0cd87acbbf52944b1bbebecb211c9b791c52c912702f006e46ca11c"
            // });
            // console.log(result);}
            // catch(e){
            //     console.log(e);
            // }
            // console.log(signature,address);
            await localStorage.setItem("sign", response?.data?.data?.accessToken)
            setCurrentAccount(account[0])
            setIsWalletConnected(true)
            toggleConnectWalletModal()
            // checkNetwork()
        } catch (err) {
            console.log(err)
        }
    }

    if (!show) return null


    return (
        <>
            <div className="overlay" onClick={toggleConnectWalletModal}></div>
            <div className="connect-modal modal">
                <img
                    src={VelvetImg}
                    alt=""
                    className="connect-modal-velvet-logo horizontally-centred"
                />

                {/* <h2 className="connect-modal-title">Create wallet</h2> */}

                {/* <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    id="connect-modal-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> */}

                {/* <button className="btn fn-md connect-modal-signup-btn" onClick={ signinWithMagicLink }>
                    Sign In
                </button> */}
                <div
                    className="flex"
                    style={{ justifyContent: "space-between", alignItems: "center" }}
                >
                    <hr style={{ width: "20%", opacity: 0.4 }} />
                    <h2 className="connect-modal-title my-30">Connect wallet</h2>
                    <hr style={{ width: "20%", opacity: 0.4 }} />
                </div>

                <button className="connect-modal-metamask-btn " onClick={ connectWalletWithMetamask }>
                    <span> Connect with Metamask</span>
                    <img src={MetamaskImg} alt="" />
                </button>
                <p className="CreateWallet">Haven’t got a crypto wallet yet? <br/>
              <a href="https://metamask.io/" target="_blank">Create a wallet</a> </p>

                <p className="text-center fn-vsm c-grey termCondition">
                    By connecting you agree to our{" "}
                    <a
                        href="https://acrobat.adobe.com/link/track?uri=urn:aaid:scds:US:54249449-1664-4b64-a11e-feb9dbcbf507"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <b>Terms of use and Privacy Policy</b>
                    </a>
                </p>
            </div>
        </>
    )
}

export default ConnectWalletModal
