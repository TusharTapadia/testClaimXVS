import { useContext } from "react"
import { providers } from "ethers"
import { toast } from "react-toastify"

import GlobalContext from "../context/GlobalContext/GlobalContext"

// const {
//     setIsWrongNetwork
// } = useContext(GlobalContext)

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

function checkMetamask() {
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
        throw new Error("Metamask Not Installed")
    }
    return ethereum
}

async function checkNetwork() {
    try {
        const ethereum = checkMetamask()
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

export { checkMetamask, checkNetwork }