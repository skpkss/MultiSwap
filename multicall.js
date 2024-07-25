const express = require('express');
const app = express();
const { ethers } = require('ethers');
require('dotenv').config();

const ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_SECRET = process.env.WALLET_SECRET;
const INFURA_TEST_URL = process.env.INFURA_TEST_URL;

const { abi: V3SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json');
const { abi: PeripheryPaymentsABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IPeripheryPayments.sol/IPeripheryPayments.json");
const { abi: MulticallABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IMulticall.sol/IMulticall.json");

// For Polygon Mainnet
const V3SwapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
const WETHAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
const USDCAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const UNIADDRESS = '0xb33EaAd8d922B1083446DC23f610c2567fB5180f';

//For Sepolia testnet
// const V3SwapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
// const WETHAddress = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
// const USDCAddress = '0xf08A50178dfcDe18524640EA6618a1f965821715';
// const UNIADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

const swapRouterContract = new ethers.Contract(
    V3SwapRouterAddress,
    V3SwapRouterABI.concat(PeripheryPaymentsABI).concat(MulticallABI)
);

const provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL);
const wallet = new ethers.Wallet(WALLET_SECRET);
const signer = wallet.connect(provider);

async function main() {
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    const params1 = {
        tokenIn: WETHAddress,
        tokenOut: UNIADDRESS,
        fee: 3000,
        recipient: ADDRESS,
        deadline: deadline,
        amountIn: ethers.utils.parseEther('0.0001'),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    };

    const encData1 = swapRouterContract.interface.encodeFunctionData("exactInputSingle", [params1]);

    const params2 = {
        tokenIn: USDCAddress,
        tokenOut: UNIADDRESS,
        fee: 3000,
        recipient: ADDRESS,
        deadline: deadline,
        amountIn: ethers.utils.parseEther('0.0001'),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    };

    const encData2 = swapRouterContract.interface.encodeFunctionData("exactInputSingle", [params2]);

    const calls = [encData1, encData2];
    const encMultiCall = swapRouterContract.interface.encodeFunctionData("multicall", [calls]);

    const txArgs = {
        to: V3SwapRouterAddress,
        from: ADDRESS,
        data: encMultiCall
    };

    const tx = await signer.sendTransaction(txArgs);
    console.log('tx', tx);
    const receipt = await tx.wait();
    console.log('receipt', receipt);
}

// New Express route to handle swap requests
app.post('/swap', async (req, res) => {
    try {
        await main();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve static files (HTML and JS)
app.use(express.static('.'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
