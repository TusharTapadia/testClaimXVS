import React, { useEffect, useContext } from "react"
import { ethers, providers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/App.css"
import Web3 from "web3"
/* Components */
import Header from "./components/Header/Header.jsx"
import ConnectWalletModal from "./components/ConnectModal/ConnectModal.jsx"
import CreateModal from "./components/CreateModal/CreateModal.jsx"
import SuccessOrErrorMsgModal from "./components/SuccessOrErrorMsgModal/SuccessOrErrorMsgModal.jsx"
import ProgressModal from "./components/ProgressModal/ProgressModal"

import PortfolioBoxesContainer from "./containers/PortfolioBoxesContainer/PortfolioBoxesContainer"

import CreateModalState from "./context/CreateModal/CreateModalState"
import GlobalContext from "./context/GlobalContext/GlobalContext"
import HeaderContainer from "./components/HeaderContainer/HeaderContainer"
import axios from "axios"

function App() {
    const {
        setCurrentAccount,
        setIsWalletConnected,
        setIsWrongNetwork,
        setCurrentBnbPrice,
        currentAccount,
    } = useContext(GlobalContext)

    async function checkIfWalletConnected() {
        try {
            const { ethereum } = window
            let width = window.innerWidth
            if (!ethereum && width > 480) {
                toast.error(`${"Get MetaMask -> https://metamask.io/"}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                window.open("https://metamask.io/download/", "_blank")
                return
            }
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0])
                setIsWalletConnected(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function getProviderOrSigner(needSigner = false) {
        try {
            const { ethereum } = window
            if (ethereum) {
                const provider = new providers.Web3Provider(ethereum)
                if (needSigner) return provider.getSigner()

                return provider
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(window.location.href)
        checkIfWalletConnected()

        //fetching bnb price in BUSD
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBBUSD")
            .then((res) => res.json())
            .then((data) => {
                const price = data.price
                setCurrentBnbPrice(price)
            })
            .catch((err) => console.log(err))

        //checking isWrongNetwork or not
        const provider = getProviderOrSigner()
        console.log(provider)
        if (provider) {
            provider.getNetwork().then(({ chainId }) => {
                if (chainId === 56) setIsWrongNetwork(false)
                else setIsWrongNetwork(true)
            })
        }
    }, [])

    return (
        <div className="App">
            <Header />

            <ConnectWalletModal />

            <CreateModalState>
                <CreateModal />

                <ProgressModal />

                <SuccessOrErrorMsgModal />

                <HeaderContainer />

                <PortfolioBoxesContainer />
            </CreateModalState>

            <ToastContainer />
        </div>
    )
}

export default App
