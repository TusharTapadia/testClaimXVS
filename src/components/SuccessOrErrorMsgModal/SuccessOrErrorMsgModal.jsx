import React, { useContext } from "react"
import "./SuccessOrErrorMsgModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"
import GlobalContext from "../../context/GlobalContext/GlobalContext"

import CrossImg from "../../assets/img/cross.svg"
import SuccessImg from "../../assets/img/success-mark.svg"
import ErrorImg from "../../assets/img/error-mark.svg"
import BnbImg from "../../assets/cryptoLogo/bnb.png"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"
import Logo from "../../assets/toggeleLogo/logo.png"

import * as constants from "../../utils/constants.js"

const SuccessOrErrorMsgModal = () => {
    const {
        setSuccessOrErrorModalInf,
        successOrErrorModalInf: { show, portfolioName, transactionType, amount, txHash, status },
    } = useContext(CreateModalContext)

    const { currentBnbPrice, indexTokensRate } = useContext(GlobalContext)

    const tokensAddress = {
        TOP5: constants.TOP5_CONTRACT_ADDRESS,
        META: constants.META_CONTRACT_ADDRESS,
        TOP10: constants.TOP10_CONTRACT_ADDRESS,
        VTOP10: constants.YIELD_BY_VENUS_CONTRACT_ADDRESS,
    }

    const indexTokensImg = {
        META: MetaverseLogo,
        TOP5: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        VTOP10: VenusLogo,
    }

    function toggleSuccessOrErrorMsgModal() {
        if (show){ 
            setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: false }))
            window.location.reload()
        }
        else setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: true }))
    }

    async function addTokenToWallet(tokenAddress, tokenSymbol) {
        try {
            //adding token to metamask wallet
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: 18,
                    },
                },
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (!show) return null

    return (
        <>
            <div className="overlay" onClick={toggleSuccessOrErrorMsgModal}></div>
            <div className="modal success-or-error-msg-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="success-or-error-msg-modal-cancle"
                    className="cursor-pointer"
                    onClick={toggleSuccessOrErrorMsgModal}
                />
                <div className="withdrawLogo">
                 <img src={Logo} alt="" style={{ width: "50px" }} className="" />
                 </div>
                {status === 1 ? (
                    <>
                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType === "deposit"
                                            ? BnbImg
                                            : indexTokensImg[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>

                            <div>
                                <img src={SuccessImg} alt="" style={{ width: "64px" }} />
                            </div>

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType !== "deposit"
                                            ? BnbImg
                                            : indexTokensImg[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>

                        <div className="success-or-error-msg-modal-tokens-amount flex">
                            <div style={{ paddingLeft: "6%" }}>
                                <p className="c-purple">
                                    {parseFloat(amount).toFixed(4)}{" "}
                                    {transactionType === "deposit" ? "BNB" : portfolioName}
                                </p>
                                <p className="text-center fn-sm c-grey">
                                    ~${" "}
                                    {(transactionType === "deposit"
                                        ? amount * currentBnbPrice
                                        : amount * indexTokensRate[portfolioName] * currentBnbPrice
                                    ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                </p>
                            </div>

                            <p
                                className="c-purple"
                                style={{ paddingRight: "3%", alignSelf: "flex-start" }}
                            >
                                ~
                                {(transactionType === "deposit"
                                    ? amount / indexTokensRate[portfolioName]
                                    : amount * indexTokensRate[portfolioName]
                                ).toFixed(4)}{" "}
                                {transactionType === "deposit" ? portfolioName : "BNB"}
                            </p>
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px", margin: "20px 0" }}
                        >
                            Success!
                        </h2>

                        {transactionType === "deposit" && (
                            <>
                                <button
                                    className="c-purple text-center fn-md cursor-pointer tokenWallet"
                                    onClick={() =>
                                        addTokenToWallet(
                                            tokensAddress[portfolioName],
                                            portfolioName
                                        )
                                    }
                                    style={{ marginBottom: "10%" }}
                                >   Add token to the wallet
                                </button>
                            </>
                        )}

                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={ toggleSuccessOrErrorMsgModal}
                            style={transactionType === "withdraw" ? { marginTop: "5%" } : {}}
                        >
                            Back to portfolios
                        </button>
                    </>
                ) : (
                    <>
                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType === "deposit"
                                            ? BnbImg
                                            : indexTokensImg[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>

                            <div>
                                <img src={ErrorImg} alt="" style={{ width: "64px" }} />
                            </div>

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType !== "deposit"
                                            ? BnbImg
                                            : indexTokensImg[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>

                        <div className="success-or-error-msg-modal-tokens-amount flex">
                            <div style={{ paddingLeft: "6%" }}>
                                <p className="c-purple">
                                    {parseFloat(amount).toFixed(4)}{" "}
                                    {transactionType === "deposit" ? "BNB" : portfolioName}
                                </p>
                                <p className="text-center fn-sm c-grey">
                                    ~${" "}
                                    {(transactionType === "deposit"
                                        ? amount * currentBnbPrice
                                        : amount * indexTokensRate[portfolioName] * currentBnbPrice
                                    ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                </p>
                            </div>

                            <p
                                className="c-purple"
                                style={{ paddingRight: "3%", alignSelf: "flex-start" }}
                            >
                                ~
                                {(transactionType === "deposit"
                                    ? amount / indexTokensRate[portfolioName]
                                    : amount * indexTokensRate[portfolioName]
                                ).toFixed(4)}{" "}
                                {transactionType === "deposit" ? portfolioName : "BNB"}
                            </p>
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px", marginTop: "30px" }}
                        >
                            Error!
                        </h2>

                        <p
                            className="success-or-error-msg-modal-message c-purple text-center fn-md"
                            style={{ margin: "20px 0" }}
                        >
                            Looks like this transaction has failed, it happens sometimes due to
                            network congestion, please try again
                        </p>

                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={toggleSuccessOrErrorMsgModal}
                        >
                            Try again
                        </button>
                    </>
                )}

                <a
                    className="success-or-error-msg-modal-blockexplorer-link"
                    href={`https://bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <p className="text-center font-semibold c-grey"> View Txn On Bscscan </p>
                </a>
            </div>
        </>
    )
}

export default SuccessOrErrorMsgModal
