import React, { useContext } from "react"
import "./ProgressModal.css"

import Spinner from "../Spinner/Spinner"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import BnbImg from "../../assets/cryptoLogo/bnb.png"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"
import Logo from "../../assets/toggeleLogo/logo.png"

const ProgressModal = () => {
    const {
        setProgressModalInf,
        progressModalInf: {
            show,
            transactionType,
            asset1Name,
            asset1Amount,
            asset2Name,
            asset2Amount,
        },
    } = useContext(CreateModalContext)
    const { currentBnbPrice, indexTokensRate } = useContext(GlobalContext)

    const tokensImg = {
        BNB: BnbImg,
        META: MetaverseLogo,
        TOP5: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        TOP7: VelvetCapitalLogo,
        VTOP10: VenusLogo,
    }

    function toggleProgressModal() {
        if (show) setProgressModalInf((prevState) => ({ ...prevState, show: false }))
        else setProgressModalInf((prevState) => ({ ...prevState, show: true }))
    }

    if (!show) return null

    return (
        <div>
            <div className="overlay" onClick={() => toggleProgressModal()}></div>
            <div className="modal progress-modal">
                <div className="processLogo"> 
                <img src={Logo} alt="" style={{ width: "50px" }} />
                </div>
                <div className="progress-modal-details flex">
                    <img
                        src={StraightLine}
                        alt=""
                        style={{ position: "absolute", zIndex: -1, width: "46%" }}
                    />
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", right: "-20%", top: "-18%" }}
                        />
                        <img src={tokensImg[asset1Name]} alt="" style={{ width: "50px" }} />
                    </div>
                    <div>
                        <Spinner />
                    </div>
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", left: "-20%", top: "-18%" }}
                        />
                        <img src={tokensImg[asset2Name]} alt="" style={{ width: "50px" }} />
                    </div>
                </div>

                <div className="progress-modal-tokens-amount flex"> 
                    <div style={{ marginLeft: "2%"}}>
                        <p className="c-purple">
                            {parseFloat(asset1Amount).toFixed(4)} {asset1Name}
                        </p>
                        <p className="text-center fn-sm c-grey">
                            ~${" "}
                            {transactionType === "deposit"
                                ? (asset1Amount * currentBnbPrice).toLocaleString("en-US", {
                                      maximumFractionDigits: 1,
                                  })
                                : (
                                      asset1Amount *
                                      indexTokensRate[asset1Name] *
                                      currentBnbPrice
                                  ).toLocaleString("en-US", {
                                      maximumFractionDigits: 1,
                                  })}
                        </p>
                    </div>

                    <p className="c-purple" style={{ marginRight: "1%", alignSelf: "flex-start" }}>
                        ~
                        {transactionType === "deposit"
                            ? (asset1Amount / indexTokensRate[asset2Name]).toFixed(4) +
                              " " +
                              asset2Name
                            : (asset1Amount * indexTokensRate[asset1Name]).toFixed(4) +
                              " " +
                              asset2Name}
                    </p>
                </div>

                <p className="text-center c-purple font-semibold TransactionProcess" style={{ fontSize: "30px" }}>
                    Transaction in progress...
                </p>

                <p className="text-center c-purple confirmMetamask"  style={{ fontSize: "16px", marginTop: "45px" }}>
                    (please press <b>"Confirm"</b> in your Metamask wallet)
                </p>
            </div>
        </div>
    )
}

export default ProgressModal
