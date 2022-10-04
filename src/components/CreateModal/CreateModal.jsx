import React, { useState, useContext, useEffect} from "react"
import { providers, Contract, BigNumber, utils } from "ethers"
import { toast } from "react-toastify"
import "./CreateModal.css"
import "react-toastify/dist/ReactToastify.css"
import Web3 from "web3"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"
import GlobalContext from "../../context/GlobalContext/GlobalContext"

import CrossImg from "../../assets/img/cross.svg"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import BnbImg from "../../assets/cryptoLogo/bnb.png"
import Logo from "../../assets/toggeleLogo/logo.png"

import {abi as indexSwapAbi } from "../../utils/abi/IndexSwapAbi"
import  { SactionedAbi } from "../../utils/abi/Sanctioned"
import { abi as NewIndexSwapAbi } from "../../utils/abi/newIndexSwapAbi"
import * as constants from "../../utils/constants.js"
import formatDecimal from "../../utils/formatDecimal"

const CreateModal = () => {
    const [amount, setAmount] = useState("")
    const [hasEnoughFunds, setHasEnoughFunds] = useState(true)
    const [transactionType, setTransactionType]= useState("deposit")

    const {
        createModalPortfolioName: portfolioName,
        showCreateModal: show,
        toggleCreateModal: toggleModal,
        setProgressModalInf,
        setSuccessOrErrorModalInf
    } = useContext(CreateModalContext)

    const {
        currentAccount,
        bnbBalance,
        setBnbBalance,
        currentBnbPrice,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        indexTokensRate,
        currentSafeGasPrice,
        setCurrentSafeGasPrice,
        setIsWrongNetwork
    } = useContext(GlobalContext)

    const TOP5_CONTRACT_ADDRESS = constants.TOP5_CONTRACT_ADDRESS
    const META_CONTRACT_ADDRESS = constants.META_CONTRACT_ADDRESS
    const TOP10_CONTRACT_ADDRESS = constants.TOP10_CONTRACT_ADDRESS
    const YIELD_BY_VENUS_CONTRACT_ADDRESS = constants.YIELD_BY_VENUS_CONTRACT_ADDRESS
    
    const createModalTitle = {
        META: "Metaverse",
        TOP5: "TOP5",
        TOP10: "TOP10",
        VTOP10: "Yield By Venus",
    }
    
    const indexTokenImg = {
        META: MetaverseLogo,
        TOP5: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        VTOP10: VenusLogo,
    }
    
    const gasRequiredForInvest = {
        META: 1_220_000,
        TOP5: 1_989_398,
        TOP10: 3_915_074,
        VTOP10: 6_843_335,
    }
    
    const gasRequiredForWithdraw = {
        META: 950_000,
        TOP5: 1_897_063,
        TOP10: 3_986_186,
        VTOP10: 6_908_502,
    }
    
    let portfolioInvestGasFee, portofolioWithdrawGasFee
    if (currentSafeGasPrice) {
        portfolioInvestGasFee = parseFloat(
            utils.formatEther(utils.parseUnits(currentSafeGasPrice, "gwei")) *
            gasRequiredForInvest[portfolioName] *
            currentBnbPrice
            ).toFixed(2)
            portofolioWithdrawGasFee = parseFloat(
                utils.formatEther(utils.parseUnits(currentSafeGasPrice, "gwei")) *
                gasRequiredForWithdraw[portfolioName] *
                currentBnbPrice
                ).toFixed(2)
    } 

    function checkHasEnoughFunds(amount, fund) {
        if (parseFloat(amount) > parseFloat(fund)) setHasEnoughFunds(false)
        else setHasEnoughFunds(true)
    }

    function toggleTransactionType() {
        if(transactionType === 'deposit') 
            // formatDecimal(userIndexTokensBalance[portfolioName]) > 0 && setTransactionType('withdraw')
            setTransactionType('withdraw')
        else
            setTransactionType('deposit')
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

    async function checkNetwork() {
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
            const provider = getProviderOrSigner()
            const { chainId } = await provider.getNetwork()
            if (chainId !== 56) {
                    //switch network to bscmain
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
                    const { chainId } = await provider.getNetwork()
                    if(chainId === 56) setIsWrongNetwork(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function getIndexTokenBalanceAndBnbBalance(accountAddress, index) {
        const provider = new providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

        let contractAddress
        switch(index) {
            case "META":
              contractAddress = META_CONTRACT_ADDRESS
              break
            case "TOP5":
              contractAddress = TOP5_CONTRACT_ADDRESS
              break
            case "TOP10":
                contractAddress = TOP10_CONTRACT_ADDRESS
                break
            case "VTOP10":
                contractAddress = YIELD_BY_VENUS_CONTRACT_ADDRESS
                break
            default:
              return
        }

        const indexContract = new Contract(
            contractAddress,
            indexSwapAbi,
            provider
        )
        const indexTokenBalance = utils.formatEther(await indexContract.balanceOf(accountAddress))

        setUserIndexTokensBalance((prevState) => ({
            ...prevState,
            [index]: indexTokenBalance
        }))

        //Updating User BNB balance after deposit and withdrawal
        const bnbBalance = utils.formatEther(await provider.getBalance(accountAddress))
        setBnbBalance(bnbBalance)

    }

    function closeModal() {
        setAmount("")
        setHasEnoughFunds(true)
        setTransactionType("deposit")
        toggleModal()
    }
    const blockList = async()=>{
        const web3 = new Web3("https://bsc-dataseed.binance.org/")
        try{
        const contract = new web3.eth.Contract(SactionedAbi, "0x40c57923924b5c5c5455c48d93317139addac8fb")
        let result= await contract.methods.isSanctioned(currentAccount).call();
        return result
        }catch(e){
            console.log(e);
        }
    }
    // useEffect(async() => {
    //     let blockListAddressCheck= await blockList();
    //     console.log(blockListAddressCheck,"blockListAddressCheck");
    // }, [])
    
    async function invest(portfolioName, amountToInvest) {
        if(transactionType === "deposit" && parseFloat(amount) < 0.01 ){
            toast.error("Amount Should be Greater then or Equal to 0.01 BNB", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }else if(transactionType === "deposit" && parseFloat(amount) > 25 ){
            toast.error("Amount Should be less then or Equal to 25 BNB", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
        else{
        closeModal()
        let blockListAddressCheck= await blockList();
        console.log(blockListAddressCheck);
        if (!blockListAddressCheck){
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            switch(portfolioName) {
                case "META":
                    contract = new Contract(META_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "TOP5": 
                    contract = new Contract(TOP5_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "TOP10":
                    contract = new Contract(TOP10_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "VTOP10":
                    contract = new Contract(YIELD_BY_VENUS_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                default:
                    break
            }

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "deposit",
                asset1Name: "BNB",
                asset1Amount: utils.formatEther(amountToInvest),
                asset2Name: portfolioName,
                asset2Amount: utils.formatEther(amountToInvest),
            })

            let txHash
            let tx
            if (portfolioName === "VTOP10")
                tx = await contract.investInFund(
                    "200",
                    {
                        value: amountToInvest.toString(),
                        gasLimit: gasRequiredForInvest.VTOP10,
                    })
            else if (portfolioName === "TOP10") 
                tx = await contract.investInFund("200",{
                    value: amountToInvest.toString(),
                    gasLimit: gasRequiredForInvest.TOP10,
                })
            else tx = await contract.investInFund("200",{ value: amountToInvest.toString(), gasLimit: gasRequiredForInvest.TOP5 })
            txHash = tx.hash
            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "deposit",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 1,
                    })

                    getIndexTokenBalanceAndBnbBalance(currentAccount, portfolioName)
                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "deposit",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 0,
                    })
                    console.log(err)
                })
        } catch (err) {
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error("Insufficient BNB Balance", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } 
            else if(err.code === 4001) {
                toast.error("User Denied To Sign Transaction", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
        }else{
        toast.error("Your address is blocked from transacting on this site", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        }
    }
    }

    async function withdraw(portfolioName, amountToWithdraw) {
        closeModal()
        try {
            await checkNetwork()
            const signer = getProviderOrSigner(true)
            let contract
            switch(portfolioName) {
                case "META":
                    contract = new Contract(META_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "TOP5": 
                    contract = new Contract(TOP5_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "TOP10":
                    contract = new Contract(TOP10_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                case "VTOP10":
                    contract = new Contract(YIELD_BY_VENUS_CONTRACT_ADDRESS, indexSwapAbi, signer)
                    break
                default:
                    break
            }

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "withdraw",
                asset1Name: portfolioName,
                asset1Amount: utils.formatEther(amountToWithdraw),
                asset2Name: "BNB",
                asset2Amount: utils.formatEther(amountToWithdraw),
            })

            let txHash
            let tx
            if (portfolioName === "VTOP10")
                tx = await contract.withdrawFund(amountToWithdraw.toString(), "200",false ,{
                    gasLimit: gasRequiredForWithdraw.VTOP10,
                })
            else if (portfolioName === "TOP10")
                tx = await contract.withdrawFund(amountToWithdraw.toString(), "200",false,{
                    gasLimit: gasRequiredForWithdraw.TOP10,
                })
            else
                tx = await contract.withdrawFund(amountToWithdraw.toString(), "200",false,{
                    gasLimit: gasRequiredForWithdraw.TOP5
                })
            txHash = tx.hash
            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "withdraw",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 1,
                    })

                    getIndexTokenBalanceAndBnbBalance(currentAccount, portfolioName)

                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "withdraw",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 0,
                    })
                    console.log(err)
                })
        } catch (err) {
            //hiding progress Modal - transaction is completed
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error(`Insufficient ${portfolioName} Balance`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else if (err.code === 4001) {
                toast.error("User Denied To Sign Transaction", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
    }

    useEffect(() => {
       //fetching current safe gas price
       fetch(
        "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=AJ4KP2CIWV6DWF2SSPQ5SX16C9YZ78B2B4"
    )
        .then((res) => res.json())
        .then((data) => {
            const safeGasPrice = data.result.SafeGasPrice
            setCurrentSafeGasPrice(safeGasPrice)
        })
        .catch((err) => console.log(err))
    }, [])
    
    if (!show) return null
console.log(amount ==! "" || parseFloat(amount) < 0.01)
    return (
        <>
            <div
                className="overlay"
                onClick={closeModal}
            ></div>
            <div className="modal create-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="create-modal-cancle"
                    className="cursor-pointer"
                    onClick={closeModal}
                />

                {/* <div className="create-modal-details">
                    <img src={indexTokenImg[portfolioName]} alt="" id="create-modal-logo" />
                    <span>{createModalTitle[portfolioName]}</span>
                </div> */}
                <div className="create-modal-details-mobile">
                    <img src={Logo} alt="" id="create-modal-logo" />
                </div>
                <div className="create-modal-action-tab flex">
                    <div
                        className={`cursor-pointer ${transactionType === "withdraw" ? "unactive" : undefined}`}
                        onClick={() => {
                            toggleTransactionType()
                            checkHasEnoughFunds(amount.toString(), bnbBalance)
                        }}
                    >
                        <span className={transactionType === "withdraw" ? "unactive" : undefined}>
                            Deposit
                        </span>
                        {/* <div
                            className={`line ${transactionType === "deposit" && "active"}`}
                        ></div> */}
                    </div>
                    <div
                        className={`${formatDecimal(userIndexTokensBalance[portfolioName]) > 0 ? "cursor-pointer" : "cursor-pointer"} ${transactionType === "deposit" ? "unactive" : undefined}` }
                        onClick={() => {
                            toggleTransactionType()
                            checkHasEnoughFunds(amount.toString(), userIndexTokensBalance[portfolioName])
                        }}
                    >
                        <span className={transactionType === "deposit" ? "unactive" : undefined}>
                            Withdraw
                        </span>
                        {/* <div
                            className={`line ${transactionType === "withdraw" ? "active" : ""}`}
                        ></div> */}
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="create-modal-asset-dropdown flex">
                                <>
                                    <img src={transactionType === "deposit" ? BnbImg : indexTokenImg[portfolioName]} alt="" />
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            color: "#262626",
                                        }}
                                    >
                                        {transactionType === "deposit" ? "BNB" : portfolioName}
                                    </span>
                                </>
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        {hasEnoughFunds ? (
                            <>
                                <span className={amount ==! "" || parseFloat(amount) < 0.01 ?"c-red fn-vsm":(amount ==! "" || parseFloat(amount) > 25 ?"c-red fn-vsm":"fn-vsm")}>{amount ==! "" || parseFloat(amount) < 0.01 ? "Minimum amount is 0.01 BNB":(amount ==! "" || parseFloat(amount) > 25 ? "MAX in one transaction is 25 BNB ": "Amount")}</span>
                                {
                                    transactionType === "withdraw" && (
                                        <span
                                        className="create-modal-max-btn cursor-pointer"
                                        onClick={() => setAmount(userIndexTokensBalance[portfolioName])}
                                        >
                                            Max
                                        </span>
                                    )
                                }
                            </>
                        ) : (
                            <span className="c-red fn-sm">Not enough funds</span>
                        )}
                        <span className="fn-sm create-modal-amount-input-balance">
                           <p>~ $ 
                            {transactionType === "deposit"
                                ? (amount * currentBnbPrice).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })
                                : (amount * indexTokensRate[portfolioName] * currentBnbPrice ).toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })}</p>
                                  
                        </span>
                        
                        <input
                            type="number"
                            className={`${hasEnoughFunds  ? "block" : "block borderRed"} ${amount ==! "" || parseFloat(amount) < 0.01 ?"borderRed":(amount ==! "" || parseFloat(amount) > 25 ?"borderRed":null)}`}
                            placeholder={
                                transactionType === "deposit"
                                    ? "max " + formatDecimal(bnbBalance) + " BNB"
                                    : "max " +
                                      formatDecimal(userIndexTokensBalance[portfolioName]) +
                                      " " +
                                      portfolioName
                            }
                            value={amount === "0" ? undefined : amount}
                            onChange={(e) => {
                                e.target.value <= 1000000000 && setAmount(e.target.value)
                                if (transactionType === "deposit") {
                                    checkHasEnoughFunds(e.target.value, bnbBalance)
                                } else {
                                    checkHasEnoughFunds(e.target.value, userIndexTokensBalance[portfolioName])
                                }
                            }}
                        />
                    </div>
                </div>

                <p className="c-grey fn-sm" style={{ textAlign: "right", marginTop: "8px", marginBottom: "25px" }}>
                    Estimated Gas Fee:{" "}
                        $
                        {transactionType === "deposit"
                            ? portfolioInvestGasFee
                            : portofolioWithdrawGasFee}
                </p>

                {transactionType === "deposit" ? (
                    <p className="create-modal-inf font-normal fn-sm text-center c-purple">
                        You will get ~ {(amount.toString() / indexTokensRate[portfolioName]).toFixed(4)} {portfolioName} tokens representing
                        your basket
                    </p>
                ) : (
                    <p className="create-modal-inf font-normal fn-sm text-center c-purple">
                        You will get ~ {(amount.toString() * indexTokensRate[portfolioName]).toFixed(4)} BNB
                    </p>
                )}

                <button
                    className="create-modal-action-btn btn fn-md"
                    data-portfolio-name={portfolioName}
                    disabled={!hasEnoughFunds || parseFloat(amount.toString()) === 0}
                    style={hasEnoughFunds && parseFloat(amount.toString()) > 0 && amount.toString() !== "" ? { opacity: 1 } : { opacity: 0.5 }}
                    onClick={
                        transactionType === "deposit"
                            ? () => {
                                setAmount("")
                                invest(
                                    portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                            : () => {
                                setAmount("")
                                withdraw(
                                    portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                    }
                >
                    {transactionType === "deposit"
                        ? "Deposit"
                        : "Withdraw"}
                </button>

            </div>
        </>
    )
}

export default CreateModal
