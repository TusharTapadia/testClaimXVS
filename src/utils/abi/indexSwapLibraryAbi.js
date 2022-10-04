const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_oracle",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_weth",
				"type": "address"
			},
			{
				"internalType": "contract TokenMetadata",
				"name": "_tokenMetadata",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "t",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "_getTokenAmountInUSD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountInUSD",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "_getTokenPriceUSDETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountInBNB",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IIndexSwap",
				"name": "_index",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "tokenBalanceInUSD",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "vaultBalance",
				"type": "uint256"
			}
		],
		"name": "calculateSwapAmounts",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IIndexSwap",
				"name": "_index",
				"type": "address"
			}
		],
		"name": "getTokenAndVaultBalance",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenXBalance",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "vaultValue",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IIndexSwap",
				"name": "_index",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "t",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "weth",
				"type": "bool"
			}
		],
		"name": "getTokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenMetadata",
		"outputs": [
			{
				"internalType": "contract TokenMetadata",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export { abi }