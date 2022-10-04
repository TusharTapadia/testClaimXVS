import React, { useRef, useContext, useState, useEffect } from "react"
import Tippy from "@tippy.js/react"
import { PuffLoader } from "react-spinners"
import { toast } from "react-toastify"
import "./PortfolioBox.css"
import "tippy.js/dist/tippy.css"
import "react-toastify/dist/ReactToastify.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import DollarImg from "../../assets/img/dollar.svg"
import PeopleImg from "../../assets/img/people.svg"
import CrossImg from "../../assets/img/cross.svg"
import InfoImg from "../../assets/img/info.svg"

import AssestsLogo from "../../utils/assets_logo_helper.js"
import formatDecimal from "../../utils/formatDecimal"

function PortfolioBox({
    logo,
    title,
    portfolioName,
    creator,
    tippyContent,
    assetsImg,
    indexTokenBalance,
    rateOfToken,
    numberOfInvestors,
    currentBnbPrice,
    indexVaultBalance,
    tokens,
    returnRate,
    userCount
}) {

    const [ portfolioBoxFace, setPortfolioBoxFace ] = useState("front")
    const [loading, setLoading] = useState(false)
    const depositOrWithdrawalBtnRef = useRef() 

    const {
        isWalletConnected,
        isWrongNetwork,
        setShowConnectWalletModal
    } = useContext(GlobalContext)

    const {
        toggleCreateModal
    } = useContext(CreateModalContext)

    function flipPortfolioBoxFace() {
        if(portfolioBoxFace === "front")
            setPortfolioBoxFace("back")
        else
            setPortfolioBoxFace("front")
    }

    function toggleConnectWalletModal() {
        setShowConnectWalletModal((prevState) => !prevState)
    }

    // console.log(portfolioName ,indexTokenBalance);
    const loader = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 8000)
    }
    useEffect(() => {
        loader()
      
    }, [])
    // console.log("cal",(indexTokenBalance * rateOfToken * currentBnbPrice) );
    // console.log("rate",returnRate);
    // console.log("token",rateOfToken);
    // console.log("indexbal",indexTokenBalance);
    console.log("current",(indexTokenBalance * rateOfToken * currentBnbPrice) - returnRate);
    
    return (
        <div className="portfolio-box">
            {portfolioBoxFace === "front" ? (
                <div className="portfolio-box-front">
                    <div className="level1">
                        <img src={logo} alt="" />

                        <div className="portfolio-details">
                            <h1 className="portfolio-details-title">{title}</h1>
                            <p className="portfolio-details-creator fn-vsm">by {creator}</p>
                        </div>

                        <Tippy
                            placement="top"
                            animation="scale"
                            content={tippyContent}
                        >
                            <img
                                src={InfoImg}
                                alt=""
                                className="portfolio-box-front-info-img cursor-pointer"
                            />
                        </Tippy>
                    </div>

                    <img
                        className="portfolio-box-assets-img cursor-pointer"
                        src={assetsImg}
                        alt=""
                        title="Click to see assets allocation"
                        onClick={flipPortfolioBoxFace}
                    />

                    <div className="portfolio-box-user-amount">
                        <span>Amount</span>
                        <span
                            style={
                                formatDecimal(indexTokenBalance) > 0
                                    ? { color: "#564dd0" }
                                    : { color: "#b3b3b3" }
                            }
                        >{loading=== true ? 0 :formatDecimal(indexTokenBalance) === 0
                            ? "0"
                            : formatDecimal(indexTokenBalance)}{" "}
                            {portfolioName}
                        </span>
                    </div>

                    <div className="portfolio-box-user-balance">
                        <span>Value</span>
                        <span
                            style={
                                (indexTokenBalance * rateOfToken * currentBnbPrice) > 0
                                    ? { color: "#564dd0" }
                                    : { color: "#b3b3b3" }
                            }
                        >
                            $
                            {loading === true ?0 :
                            (indexTokenBalance == 0 ? "0" : (indexTokenBalance * rateOfToken * currentBnbPrice).toLocaleString("en-US", {
                                maximumFractionDigits: 2,
                            }))}
                        </span>
                    </div>

                    <div className="portfolio-box-user-return">
                        <span>Return</span>
                        <span
                            className={
                                loading===true ||indexTokenBalance == 0 ?{color: "#b3b3b3"}:((indexTokenBalance * rateOfToken * currentBnbPrice) - returnRate)> 0
                                    ? "greenText"
                                    : "redText"
                            }
                        >{loading===true ||indexTokenBalance == 0 ?null:((indexTokenBalance * rateOfToken * currentBnbPrice) - returnRate) > 0? "+":"-"}
                            ${loading === true || indexTokenBalance == 0  ? "0":(Math.abs(parseFloat(indexTokenBalance * rateOfToken * currentBnbPrice) - returnRate)).toFixed(2)} 
                            
                            {/* {returnRate} */}
                            </span>
                    </div>

                    <button
                        className="btn fn-md"
                        ref={depositOrWithdrawalBtnRef}
                        data-portfolio-name={portfolioName}
                        onClick={isWrongNetwork ? 
                            () => {
                                toast.warn("Connect to a supported network (BNB Chain)", {
                                    position: "top-center",
                                    autoClose: 3000,
                                    hideProgressBar: true,
                                    closeOnClick: false,
                                })
                            } : isWalletConnected ? () => toggleCreateModal(depositOrWithdrawalBtnRef.current) : toggleConnectWalletModal }
                    >
                        {formatDecimal(indexTokenBalance) > 0 ? "Deposit / Withdraw" : "Deposit"}
                    </button>

                    {/* <div className="portfolio-data">
                        <Tippy
                            placement="top"
                            animation="scale"
                            arrow={false}
                            content={"Total No. Of Investors"}
                        >
                            <div className="left">
                                <img src={PeopleImg} alt="" />
                                <span className="num-of-investors fn-sm c-grey">{numberOfInvestors}</span>
                            </div>
                        </Tippy>

                        <Tippy
                            placement="top"
                            animation="scale"
                            arrow={false}
                            content={"Amount Invested In Portfolio"}
                        >
                            <div className="right">
                                <img src={DollarImg} alt="" />
                                <span className="marketcap fn-sm c-grey">
                                    {parseFloat(indexVaultBalance).toFixed(2)}
                                </span>
                            </div>
                        </Tippy>
                    </div> */}
                </div>
            ) : (
                <div className="portfolio-box-back">
                    <img
                        src={CrossImg}
                        alt=""
                        id="portfolio-box-back-cross"
                        onClick={flipPortfolioBoxFace}
                    />

                    <div className="flex" style={{gap: "10px"}}>
                        <h2>Allocation</h2>
                        <Tippy
                                placement="top"
                                animation="scale"
                                content={tippyContent}
                            >
                                <img
                                    src={InfoImg}
                                    alt=""
                                    className="portfolio-box-front-info-img cursor-pointer"
                                    style={{marginTop: "5px"}}
                                />
                        </Tippy>
                    </div>

                    <div className="portfolio-box-back-assets">
                        {
                            tokens === null ? (
                                <div className="flex" style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                                    <PuffLoader color={"#564dd0"} loading={true} size={100} />
                                </div>
                            ) : (
                                tokens?.map(([tokenName, tokenSymbol, tokenWeight], index) => {
                                    return (
                                        <div className="portfolio-box-back-asset" key={index}>
                                            <img
                                                src={AssestsLogo[tokenSymbol]}
                                                alt=""
                                                className="portfolio-box-back-asset-icon"
                                            />
                                            <span className="portfolio-box-back-asset-name">
                                                {tokenName}
                                            </span>
                                            <span className="portfolio-box-back-asset-symbol">
                                                {tokenSymbol}
                                            </span>
                                            {tokenWeight === "0" ? (
                                                <span className="portfolio-box-back-asset-allocation">
                                                    0 %
                                                </span>
                                            ) : (
                                                <span className="portfolio-box-back-asset-allocation">
                                                    {tokenWeight.toLocaleString("en-US", {maximumFractionDigits: 1})}{" "}%
                                                </span>
                                            )}
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default PortfolioBox
