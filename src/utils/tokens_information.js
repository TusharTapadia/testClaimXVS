import { ethers } from "ethers"

const tokens = {
    //BEP-20 TOKEN ADDRESSES
    "0x26433c8127d9b4e9B71Eaa15111DF99Ea2EeB2f8" : ["Decentraland", "MANA", 0],
    "0x67b725d7e342d7B611fa85e859Df9697D9378B2e" : ["The Sandbox", "SAND", 0],
    "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0": ["Axie Infinity", "AXS", 0],
    "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5": ["BakeryToken", "BAKE", 0],
    "0xC762043E211571eB34f1ef377e5e8e76914962f9": ["ApeCoin", "APE", 0],
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": ["Bitcoin", "BTC", 0],
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": ["Ethereum", "ETH", 0],
    "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": ["XRP", "XRP", 0],
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": ["Cardano", "ADA", 0],
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": ["BNB", "BNB", 0], //WBNB
    "0x1CE0c2827e2eF14D5C4f29a091d735A204794041": ["Avalanche", "AVAX", 0],
    "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402": ["Polkadot", "DOT", 0],
    "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B": ["Tron", "TRX", 0],
    "0xbA2aE424d960c26247Dd6c32edC70B295c744C43": ["Dogecoin", "DOGE", 0],
    "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF": ["Solana", "SOL", 0],
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": ["PancakeSwap", "CAKE", 0],
    "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf": ["Bitcoin Cash", "BCH", 0],
    "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153": ["Filecoin", "FIL", 0]
}

function getTokenNameAndSymbol(tokenAddress) {
    if(tokens[tokenAddress]) {
        const tokenInf = tokens[tokenAddress]
        //.slice() because we want to return copy of array not the reference to original array
        return tokenInf.slice()
    }
    
    return null
}

async function getTokenNameAndSymbolFromContract(tokenAddress) {
    const provider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
    )

    const abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const tokenContract = new ethers.Contract(tokenAddress, abi, provider)
    let tokenName, tokenSymbol
    tokenName = await tokenContract.name()
    tokenSymbol = await tokenContract.symbol()

    return [tokenName, tokenSymbol, 0]
}

export {
    getTokenNameAndSymbol,
    getTokenNameAndSymbolFromContract
}