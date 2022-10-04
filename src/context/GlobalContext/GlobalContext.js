import React, { createContext, useState } from "react"

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [isWrongNetwork, setIsWrongNetwork] = useState(false)
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    const [bnbBalance, setBnbBalance] = useState("0")
    const [currentBnbPrice, setCurrentBnbPrice] = useState("0")
    const [currentSafeGasPrice, setCurrentSafeGasPrice] = useState(null)
    const [magicProvider, setMagicProvider] = useState(null)

    const [totalUserBalanceInDollar, setTotalUserBalanceInDollar] = useState("0")

    const [userIndexTokensBalance, setUserIndexTokensBalance] = useState({
        TOP5: "0",
        META: "0",
        VTOP10: "0",
        TOP10: "0",
    })

    const [indexTokensRate, setIndexTokensRate] = useState({
        TOP5: 0,
        META: 0,
        VTOP10: 0,
        TOP10: 0,
    })

    const states = {
        currentAccount,
        setCurrentAccount,
        isWalletConnected,
        setIsWalletConnected,
        isWrongNetwork,
        setIsWrongNetwork,
        magicProvider,
        setMagicProvider,
        showConnectWalletModal,
        setShowConnectWalletModal,
        currentBnbPrice,
        setCurrentBnbPrice,
        currentSafeGasPrice,
        setCurrentSafeGasPrice,
        bnbBalance,
        setBnbBalance,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        indexTokensRate,
        setIndexTokensRate,
        totalUserBalanceInDollar,
        setTotalUserBalanceInDollar,
    }

    return <GlobalContext.Provider value={states}>{children}</GlobalContext.Provider>
}

export default GlobalContext
