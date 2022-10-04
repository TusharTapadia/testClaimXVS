import React, {useContext} from "react"
import { providers } from "ethers"
import Tippy from "@tippy.js/react"
import { toast } from "react-toastify"
import "./Header.css"
import "../../styles/utils.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import Mark from "../../assets/toggeleLogo/mark.png"
import Ok from "../../assets/toggeleLogo/ok.png"
import GhostLogo from "../../assets/img/ghost-logo.png"
import Logo from "../../assets/img/headerlogo.png"
import WalletNotConnectedImg from "../../assets/img/wallet-notconnected.png"
import WalletConnectedImg from "../../assets/img/wallet-connected.png"
import ArrowUPImg from "../../assets/img/chevron-down (1).svg"
import ArrowDownImg from "../../assets/img/chevron-down.svg"
import ExitImg from "../../assets/img/exit.svg"
import CopyImg from "../../assets/img/copyicon.png"
import WrongNetworkImg from "../../assets/img/wrong-network.svg"
import { useEffect } from "react"
import { useState } from "react"

const Header = () => {

    const [showHeaderDropdownMenu, setShowHeaderDropdownMenu] = useState(false)
    const [active, setActive] = useState(false)

    const { 
        currentAccount,
        isWalletConnected, 
        setIsWalletConnected,
        isWrongNetwork,
        setIsWrongNetwork,
        setShowConnectWalletModal,
        bnbBalance,
        currentBnbPrice, 
        userIndexTokensBalance,
        indexTokensRate,
        totalUserBalanceInDollar, setTotalUserBalanceInDollar
    } = useContext(GlobalContext)

    async function switchToMainnet() {
        try {
            const { ethereum } = window
            if (!ethereum) {
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

            //switch network to bsc-mainnet
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x38",
                        rpcUrls: ["https://bsc-dataseed.binance.org/"],
                        chainName: "BSC Main",
                        nativeCurrency: {
                            name: "Binance",
                            symbol: "BNB",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://bscscan.com"],
                    },
                ],
            })
            const provider = new providers.Web3Provider(ethereum)
            const { chainId } = await provider.getNetwork()
            if (chainId === 56) {
                setIsWrongNetwork(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function copyWalletAddress(portfolioName) {
        console.log(currentAccount)
        navigator.clipboard.writeText(currentAccount)
    }

    function disconnectWallet() {
        setIsWalletConnected(false)
        toggleHeaderDropdownMenu()
    }

    function toggleHeaderDropdownMenu() {
        setShowHeaderDropdownMenu((prevState) => !prevState)
    }

    function toggleConnectWalletModal() {
        setShowConnectWalletModal((prevState) => !prevState)
    }

    useEffect(() => {
        let totalUserBalanceInBnb = 0;
        for( const token in userIndexTokensBalance ) {
            if( parseFloat(userIndexTokensBalance[token]) !== 0 )
                totalUserBalanceInBnb += parseFloat(userIndexTokensBalance[token] * indexTokensRate[token])
        }
        setTotalUserBalanceInDollar( (totalUserBalanceInBnb * currentBnbPrice).toLocaleString('en-US', {
            maximumFractionDigits: 1
        }) )

    }, [userIndexTokensBalance, indexTokensRate])

    return (
        <>
        {/* {!active?
        <div className={`alertBox`}>
        <img src={Mark} alt=""/>
        <p> <span>This product is in a beta stage,</span> <br/> By using it you acknowledge that you're doing it at your own risk and any losses incurred while using this product are your own responsibility</p>
        <img src={Ok} onClick={()=>setActive(true)} className="okBtn" alt=""/>
        </div>
        :null
        } */}
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && (
                <div className="header-investor-data hide-for-mobile">
                    <div>
                        <span className="header-investor-data-title fn-sm">Value (USD)</span>
                        <span className="header-investor-data-balance fn-lg text-right">
                            ${totalUserBalanceInDollar}
                        </span>
                    </div>

                    <div>
                        <span className="header-investor-data-title fn-sm">Return</span>
                        <span className="header-investor-data-return fn-lg c-green text-right">-</span>
                    </div>
                </div>
            )}

            {isWrongNetwork && (
                <>
                    <div className="header-wrong-network-rounded-box flex">
                        <img src={WrongNetworkImg} alt="" style={{ width: "19px" }} />
                        <p>Wrong Network</p>
                    </div>

                    <div className="header-wrong-network-modal">
                        <h2
                            className="font-semibold c-red"
                            style={{ fontSize: "18px", margin: "8px 0" }}
                        >
                            Wrong Network
                        </h2>
                        <p style={{ fontSize: "14px"}}>
                            Please connect to a supported network (BNB Chain)
                        </p>
                        <button
                            className="btn header-wrong-network-modal-btn"
                            onClick={switchToMainnet}
                        >
                            Switch to BNB chain
                        </button>
                    </div>
                </>
            )}

            {!isWalletConnected ? (
                <button className={isWrongNetwork ? "connect-btn border-red" : "connect-btn"} onClick={() => toggleConnectWalletModal()}>
                    <img
                        src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg}
                        alt=""
                    />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button
                    className={isWrongNetwork ? "connect-btn border-red" : "connect-btn"}
                    onClick={toggleHeaderDropdownMenu}
                >
                    <img
                        src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg}
                        alt=""
                    />
                    <span className="fn-sm">
                        {currentAccount.slice(0, 4) + "..." + currentAccount.slice(-3)}
                    </span>
                    <img
                        src={showHeaderDropdownMenu ? ArrowUPImg : ArrowDownImg}
                        className="connect-btn-icon"
                        alt=""
                    />
                </button>
            )}

            {showHeaderDropdownMenu && (
                <div className="header-dropdown-menu">
                    <div className="header-dropdown-menu-wallet-address pr-10">
                        <p className="fn-vsm">Wallet Address</p>
                        <div className="walletAddressDiv">
                             <span className="c-purple font-semibold">
                            {currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)}
                        </span>
                        <Tippy
                            placement="top"
                            animation="scale"
                            content="Copied!"
                            hideOnClick={false}
                            trigger="click"
                            onShow={(instance) => {
                                setTimeout(() => {
                                    instance.hide()
                                }, 1000)
                            }}
                        >
                            <img
                                className="cursor-pointer"
                                src={CopyImg}
                                alt=""
                                style={{ width: "18px", marginLeft: "10px" }}
                                onClick={copyWalletAddress}
                            />
                        </Tippy>
                        </div>

                    </div>
                    <hr style={{ opacity: 0.5 }} />
                    <div className="header-dropdown-menu-wallet-balance">
                        <p className="fn-vsm">Wallet balance</p>
                        <span className="c-purple font-semibold">
                            $
                            {(bnbBalance * currentBnbPrice).toLocaleString("en-US", {
                                maximumFractionDigits: 1,
                            })}
                        </span>
                    </div>
                    <hr style={{ opacity: 0.5 }} />
                    <div className="cursor-pointer disconnectBtn" onClick={disconnectWallet}>
                        <span className="fn-sm">Disconnect</span>
                        <img src={ExitImg} alt="" />
                    </div>
                </div>
            )}
        </div>
        </>
    )
}

export default Header
