import React, { useState, useContext, useEffect } from "react"
import { providers, Contract, utils, ethers, BigNumber } from "ethers"
import axios from "axios"
import "./PortfolioBoxesContainer.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import PortfolioBox from "../../components/PortfolioBox/PortfolioBox"

import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"
import VenusAssestsImg from "../../assets/img/venusAssets2.png"
import Top10AssestsImg from "../../assets/img/top-10.png"
import BluechipAssetsImg from "../../assets/img/bluechipassets.png"
import MetaverseAssetsImg from "../../assets/img/metaverseassets.png"

import { abi as indexSwapAbi } from "../../utils/abi/IndexSwapAbi"
import { abi as indexSwapLibraryAbi } from "../../utils/abi/indexSwapLibraryAbi"
import { abi as priceOracleAbi } from "../../utils/abi/priceOracleAbi"
import * as constants from "../../utils/constants.js"
import {
    getTokenNameAndSymbol,
    getTokenNameAndSymbolFromContract,
} from "../../utils/tokens_information.js"

import {
    TOP5_IndexSwapLibrary,
    TOP10_IndexSwapLibrary,
    venus_IndexSwapLibrary,
} from "../../utils/constants.js"

var resp

const PortfolioBoxesContainer = () => {
    const TOTAL_WEIGHT = 10_000

    const [indexesVaultBalance, setIndexesVaultBalance] = useState({
        TOP5: "0",
        META: "0",
        VTOP10: "0",
        TOP10: "0",
    })
    const [indexTokensTotalSupply, setIndexTokensTotalSupply] = useState({
        TOP5: "0",
        META: "0",
        VTOP10: "0",
        TOP10: "0",
    })

    const [metaTokens, setMetaTokens] = useState(null)
    const [top5Tokens, setTop5Tokens] = useState(null)
    const [vtop10Tokens, setVtop10Tokens] = useState(null)
    const [top10Tokens, setTop10Tokens] = useState(null)
    const [userCount, setUserCount] = useState(0)
    const [top5ReturnRate, setTop5ReturnRate] = useState(0)
    const [venus10ReturnRate, setVenus10ReturnRate] = useState(0)
    const [top10Data, setTop10Data] = useState(0)
    const [active, setActive] = useState(1)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
        console.log(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
        console.log(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe || isRightSwipe) console.log("swipe", isLeftSwipe ? "left" : "right")
        if (isLeftSwipe && active < 3) {
            setActive(active + 1)
        }
        if (isRightSwipe && active > 1) {
            setActive(active - 1)
        }
        // add your conditional logic here
    }
    const {
        currentAccount,
        isWalletConnected,
        setBnbBalance,
        currentBnbPrice,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        indexTokensRate,
        setIndexTokensRate,
    } = useContext(GlobalContext)

    const { createModalPortfolioName } = useContext(CreateModalContext)

    const TOP5_CONTRACT_ADDRESS = constants.TOP5_CONTRACT_ADDRESS
    const META_CONTRACT_ADDRESS = constants.META_CONTRACT_ADDRESS
    const TOP10_CONTRACT_ADDRESS = constants.TOP10_CONTRACT_ADDRESS
    const YIELD_BY_VENUS_CONTRACT_ADDRESS = constants.YIELD_BY_VENUS_CONTRACT_ADDRESS
    const PRICE_ORACLE_CONTRACT_ADDRESS = constants.PRICE_ORACLE_CONTRACT_ADDRESS
    var bnbPrice

    const provider = new providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

    async function getUserBnbAndTokenBalance(accountAddress) {
        //call this function only if wallet is connected

        // getUserData(accountAddress);

        const bnbBalance = utils.formatEther(await provider.getBalance(accountAddress))
        setBnbBalance(bnbBalance)

        //Getting User META Balance
        const metaContract = new Contract(META_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const metaBalance = utils.formatEther(await metaContract.balanceOf(accountAddress))

        //Getting User TOP5 Balance
        const top5Contract = new Contract(TOP5_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top5Balance = utils.formatEther(await top5Contract.balanceOf(accountAddress))

        //Getting User TOP10 Balance
        const top10Contract = new Contract(TOP10_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top10Balance = utils.formatEther(await top10Contract.balanceOf(accountAddress))

        //Getting User Venus Index Balance
        const venusIndexContract = new Contract(
            YIELD_BY_VENUS_CONTRACT_ADDRESS,
            indexSwapAbi,
            provider
        )
        const vtop10Balance = utils.formatEther(await venusIndexContract.balanceOf(accountAddress))

        setUserIndexTokensBalance((prevState) => ({
            META: metaBalance,
            TOP5: top5Balance,
            TOP10: top10Balance,
            VTOP10: vtop10Balance,
        }))
    }

    async function getIndexVaultBalance() {
        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

        const priceOracle = new Contract(PRICE_ORACLE_CONTRACT_ADDRESS, priceOracleAbi, provider)
        bnbPrice = utils.formatEther(
            await priceOracle.getPriceTokenUSD(
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                "1000000000000000000"
            )
        )

        // Getting META Vault Balance
        const metaLibraryContract = new Contract(
            "0xDbA4eB79812F716255aF0b35d756E3F5eB015667",
            indexSwapLibraryAbi,
            provider
        )
        const metaVaultBalance = utils.formatEther(
            (await metaLibraryContract.getTokenAndVaultBalance(META_CONTRACT_ADDRESS))[1]
        )

        //Getting TOP5 Vault Balance
        const top5LibraryContract = new Contract(
            TOP5_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const top5VaultBalance = utils.formatEther(
            (await top5LibraryContract.getTokenAndVaultBalance(TOP5_CONTRACT_ADDRESS))[1]
        )

        //Getting TOP10 Vault Balance
        const top10LibraryContract = new Contract(
            TOP10_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const top10VaultBalance = utils.formatEther(
            (await top10LibraryContract.getTokenAndVaultBalance(TOP10_CONTRACT_ADDRESS))[1]
        )

        //Getting Venus Vault Balance
        const venusIndexLibraryContract = new Contract(
            venus_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const vtop10VaultBalance = utils.formatEther(
            (
                await venusIndexLibraryContract.getTokenAndVaultBalance(
                    YIELD_BY_VENUS_CONTRACT_ADDRESS
                )
            )[1]
        )

        setIndexesVaultBalance((prevState) => ({
            META: metaVaultBalance,
            TOP5: top5VaultBalance,
            TOP10: top10VaultBalance,
            VTOP10: vtop10VaultBalance,
        }))
        return {
            metaVaultBalance: metaVaultBalance,
            top5VaultBalance: top5VaultBalance,
            top10VaultBalance: top10VaultBalance,
            vtop10VaultBalance: vtop10VaultBalance,
        }
    }

    async function getTokensTotalSupply() {
        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")
        //Getting META Token Total Supply
        const metaContract = new Contract(META_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const metaTotalSupply = utils.formatEther(await metaContract.totalSupply())

        //Getting TOP5 Token Total Supply
        const top5Contract = new Contract(TOP5_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top5TotalSupply = utils.formatEther(await top5Contract.totalSupply())

        //Getting TOP10 Token Total Supply
        const top10Contract = new Contract(TOP10_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top10TotalSupply = utils.formatEther(await top10Contract.totalSupply())

        //Getting VTOP10 Token Total Supply
        const vtop10Contract = new Contract(YIELD_BY_VENUS_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const vtop10TotalSupply = utils.formatEther(await vtop10Contract.totalSupply())

        setIndexTokensTotalSupply({
            TOP5: top5TotalSupply,
            META: metaTotalSupply,
            TOP10: top10TotalSupply,
            VTOP10: vtop10TotalSupply,
        })

        return {
            top5TotalSupply: top5TotalSupply,
            metaTotalSupply: metaTotalSupply,
            top10TotalSupply: top10TotalSupply,
            vtop10TotalSupply: vtop10TotalSupply,
        }
    }

    async function getSingleIndexVaultBalance(index) {
        if (!index) return

        const provider = new providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

        const portfolioNameToContractAddress = {
            META: META_CONTRACT_ADDRESS,
            TOP5: TOP5_CONTRACT_ADDRESS,
            TOP10: TOP10_CONTRACT_ADDRESS,
            VTOP10: YIELD_BY_VENUS_CONTRACT_ADDRESS,
        }

        const portfolioNameToLibraryContractAddress = {
            META: "0xDbA4eB79812F716255aF0b35d756E3F5eB015667",
            TOP5: TOP5_IndexSwapLibrary,
            TOP10: TOP10_IndexSwapLibrary,
            VTOP10: "0xBB6609Ec7C06B968637B2E1924642e1e68A652B7",
        }

        const indexLibraryContract = new Contract(
            portfolioNameToLibraryContractAddress[index],
            indexSwapLibraryAbi,
            provider
        )
        const indexVaultBalance = utils.formatEther(
            (
                await indexLibraryContract.getTokenAndVaultBalance(
                    portfolioNameToContractAddress[index]
                )
            )[1]
        )

        // console.log(typeof(indexVaultBalance))

        setIndexesVaultBalance((prevState) => ({
            ...prevState,
            [index]: indexVaultBalance,
        }))
    }

    async function getTokensAddressAndWeight() {
        //function to get Tokens Address and their weight in a Index
        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")

        //Getting META Index Tokens Addresses and Weight
        const metaContract = new Contract(META_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const metaTokensAddress = await metaContract.getTokens()
        let metaTokensInformation = []
        for (const tokenAddress of metaTokensAddress) {
            const tokenInf = getTokenNameAndSymbol(tokenAddress)
            if (tokenInf === null) {
                const inf = await getTokenNameAndSymbolFromContract(tokenAddress)
                metaTokensInformation.push(inf)
            } else {
                metaTokensInformation.push(tokenInf)
            }
        }

        for (const [i, tokenAddress] of metaTokensAddress.entries()) {
            const result = await metaContract.getRecord(tokenAddress)
            let allocation = (result.denorm.toString() / TOTAL_WEIGHT) * 100
            // console.log(new Date(result.lastDenormUpdate * 1000).toDateString()) //Last Rebalanced Date
            metaTokensInformation[i][2] = allocation.toFixed(1)
        }
        setMetaTokens(metaTokensInformation)

        //Getting TOP5 Index Tokens Addresses and Weight
        const top5Contract = new Contract(TOP5_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top5TokensAddress = await top5Contract.getTokens()
        let top5TokensInformation = []
        for (const tokenAddress of top5TokensAddress) {
            const tokenInf = getTokenNameAndSymbol(tokenAddress)
            if (tokenInf === null) {
                const inf = await getTokenNameAndSymbolFromContract(tokenAddress)
                top5TokensInformation.push(inf)
            } else {
                top5TokensInformation.push(tokenInf)
            }
        }

        const top5LibraryContract = new Contract(
            TOP5_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const top5VaultBalance = utils.formatEther(
            (await top5LibraryContract.getTokenAndVaultBalance(TOP5_CONTRACT_ADDRESS))[1]
        )
        var top5TokenBalance = (
            await top5LibraryContract.getTokenAndVaultBalance(TOP5_CONTRACT_ADDRESS)
        )[0]

        for (let i = 0; i < top5TokenBalance.length; i++) {
            let allocation = (utils.formatEther(top5TokenBalance[i]) / top5VaultBalance) * 100
            top5TokensInformation[i][2] = allocation.toFixed(2)
        }
        setTop5Tokens(top5TokensInformation)

        //Getting TOP10 Index Tokens Addresses and Weight
        const top10Contract = new Contract(TOP10_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const top10TokensAddress = await top10Contract.getTokens()
        let top10TokensInformation = []
        for (const tokenAddress of top10TokensAddress) {
            const tokenInf = getTokenNameAndSymbol(tokenAddress)
            if (tokenInf === null) {
                const inf = await getTokenNameAndSymbolFromContract(tokenAddress)
                top10TokensInformation.push(inf)
            } else {
                top10TokensInformation.push(tokenInf)
            }
        }

        const top10LibraryContract = new Contract(
            TOP10_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const top10VaultBalance = utils.formatEther(
            (await top10LibraryContract.getTokenAndVaultBalance(TOP10_CONTRACT_ADDRESS))[1]
        )
        var top10TokenBalance = (
            await top10LibraryContract.getTokenAndVaultBalance(TOP10_CONTRACT_ADDRESS)
        )[0]

        // console.log(top10TokenBalance)
        for (let i = 0; i < top10TokenBalance.length; i++) {
            let allocation = (utils.formatEther(top10TokenBalance[i]) / top10VaultBalance) * 100
            top10TokensInformation[i][2] = allocation.toFixed(2)
        }
        setTop10Tokens(top10TokensInformation)

        //Getting VenusTop10 Index Tokens Addresses and Weight
        const venusContract = new Contract(YIELD_BY_VENUS_CONTRACT_ADDRESS, indexSwapAbi, provider)
        const venusIndexTokensAddress = await venusContract.getTokens()
        let venusIndexTokensInformation = []
        for (const tokenAddress of venusIndexTokensAddress) {
            const tokenInf = getTokenNameAndSymbol(tokenAddress)
            if (tokenInf === null) {
                const inf = await getTokenNameAndSymbolFromContract(tokenAddress)
                venusIndexTokensInformation.push(inf)
            } else {
                venusIndexTokensInformation.push(tokenInf)
            }
        }

        const venusIndexLibraryContract = new Contract(
            venus_IndexSwapLibrary,
            indexSwapLibraryAbi,
            provider
        )
        const vtop10VaultBalance = utils.formatEther(
            (
                await venusIndexLibraryContract.getTokenAndVaultBalance(
                    YIELD_BY_VENUS_CONTRACT_ADDRESS
                )
            )[1]
        )

        var vtop10TokenBalance = (
            await venusIndexLibraryContract.getTokenAndVaultBalance(YIELD_BY_VENUS_CONTRACT_ADDRESS)
        )[0]

        for (let i = 0; i < vtop10TokenBalance.length; i++) {
            let allocation = (utils.formatEther(vtop10TokenBalance[i]) / vtop10VaultBalance) * 100
            venusIndexTokensInformation[i][2] = allocation.toFixed(1)
        }
        setVtop10Tokens(venusIndexTokensInformation)
    }

    async function getUserRetrunData() {
        let token = localStorage.getItem("sign")
        console.log(token)
        let response = await axios.post("https://defivas.xyz/return", { address: currentAccount })
        setTop5ReturnRate(response?.data?.data?.top5Data?.data)
        setVenus10ReturnRate(response?.data?.data?.venus10Data?.data)
        setTop10Data(response?.data?.data?.top10Data?.data)
        // console.log(response?.data?.data?.top5Data);
    }
    async function userCounts() {
        let response = await axios.get("https://defivas.xyz/users")
        setUserCount(response?.data?.data)
    }
    useEffect(() => {
        getSingleIndexVaultBalance(createModalPortfolioName)
    }, [userIndexTokensBalance])

    useEffect(() => {
        userCounts()
        if (isWalletConnected) {
            getUserBnbAndTokenBalance(currentAccount)
            getUserRetrunData()
        }
    }, [currentAccount])

    useEffect(() => {
        const asyncGetIndexVaultBalanceAndIndexTokenTotalSupply = async () => {
            const { top5VaultBalance, metaVaultBalance, top10VaultBalance, vtop10VaultBalance } =
                await getIndexVaultBalance()
            const { top5TotalSupply, metaTotalSupply, vtop10TotalSupply, top10TotalSupply } =
                await getTokensTotalSupply()

            let top5TokenRate = parseFloat(top5VaultBalance / bnbPrice / top5TotalSupply)
            let metaTokenRate = parseFloat(metaVaultBalance / metaTotalSupply)
            let top10TokenRate = parseFloat(top10VaultBalance / bnbPrice / top10TotalSupply)
            let vtop10TokenRate = parseFloat(vtop10VaultBalance / bnbPrice / vtop10TotalSupply)

            // console.log("Top 5 Vault Balance",top5VaultBalance)
            // console.log("Top 5 Token Supply",top5TotalSupply)
            // console.log("Top 5 Token Rate",top5TokenRate)

            if (isNaN(top5TokenRate)) top5TokenRate = 1
            if (isNaN(metaTokenRate)) metaTokenRate = 1
            if (isNaN(top10TokenRate)) top10TokenRate = 1
            if (isNaN(vtop10TokenRate)) vtop10TokenRate = 1

            setIndexTokensRate({
                TOP5: top5TokenRate,
                META: metaTokenRate,
                VTOP10: vtop10TokenRate,
                TOP10: top10TokenRate,
            })
        }
        asyncGetIndexVaultBalanceAndIndexTokenTotalSupply()
        getTokensAddressAndWeight()
    }, [])

    return (
        <>
            <div
                className="container portfolioBoxContainer"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* <div className={active === 1 ? "activeBox" : "nullBox"}>
                    <PortfolioBox
                        logo={VelvetCapitalLogo}
                        title="Blue Chip"
                        portfolioName="TOP5"
                        creator="Velvet"
                        tippyContent="Top 5 cryptocurrencies by total market capitalization excluding stablecoins, equally weighted, rebalanced every 2 weeks"
                        assetsImg={BluechipAssetsImg}
                        indexTokenBalance={userIndexTokensBalance["TOP5"]}
                        rateOfToken={indexTokensRate["TOP5"]}
                        returnRate={top5ReturnRate}
                        numberOfInvestors={userCount?.top5Users}
                        currentBnbPrice={currentBnbPrice}
                        indexVaultBalance={indexesVaultBalance["TOP5"]}
                        tokens={top5Tokens}
                    />
                </div> */}

                {/* <PortfolioBox
                    logo={MetaverseLogo}
                    title="Metaverse"
                    portfolioName="META"
                    creator="Test"
                    tippyContent="Top 5 cryptocurrencies from the Metaverse sector available on BNB Chain, equally weighted, rebalanced every 2 weeks"
                    assetsImg={MetaverseAssetsImg}
                    indexTokenBalance={userIndexTokensBalance["META"]}
                    rateOfToken={indexTokensRate['META']}
                    numberOfInvestors="8,471"
                    currentBnbPrice={currentBnbPrice}
                    indexVaultBalance={indexesVaultBalance["META"]}
                    tokens={metaTokens}
                /> */}
                <div className={active === 2 ? "activeBox" : "nullBox"}>
                    <PortfolioBox
                        logo={VenusLogo}
                        title="Yield By Venus"
                        portfolioName="VTOP10"
                        creator="Velvet"
                        tippyContent="10 cryptocurrencies earning additional interest from lending using Venus protocol, equally weighted, rebalanced every 2 weeks"
                        assetsImg={VenusAssestsImg}
                        indexTokenBalance={userIndexTokensBalance["VTOP10"]}
                        rateOfToken={indexTokensRate["VTOP10"]}
                        returnRate={venus10ReturnRate}
                        numberOfInvestors={userCount?.venus10Users}
                        currentBnbPrice={currentBnbPrice}
                        indexVaultBalance={indexesVaultBalance["VTOP10"]}
                        tokens={vtop10Tokens}
                    />
                </div>
                {/* <div className={active === 3 ? "activeBox" : "nullBox"}>
                    <PortfolioBox
                        logo={VelvetCapitalLogo2}
                        title="Top10"
                        portfolioName="TOP10"
                        creator="Velvet"
                        tippyContent="Top 10 cryptocurrencies by total market capitalization excluding stablecoins, equally weighted, rebalanced every 2 weeks"
                        assetsImg={Top10AssestsImg}
                        indexTokenBalance={userIndexTokensBalance["TOP10"]}
                        rateOfToken={indexTokensRate["TOP10"]}
                        numberOfInvestors={userCount?.top10Users}
                        returnRate={top10Data}
                        currentBnbPrice={currentBnbPrice}
                        indexVaultBalance={indexesVaultBalance["TOP10"]}
                        tokens={top10Tokens}
                    />
                </div> */}
            </div>
            <div className="bullets">
                <div
                    className={`dotBtn ${active === 1 ? "active" : null}`}
                    onClick={() => setActive(1)}
                ></div>
                <div
                    className={`dotBtn ${active === 2 ? "active" : null}`}
                    onClick={() => setActive(2)}
                ></div>
                <div
                    className={`dotBtn ${active === 3 ? "active" : null}`}
                    onClick={() => setActive(3)}
                ></div>
            </div>
        </>
    )
}

export default PortfolioBoxesContainer
