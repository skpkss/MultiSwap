# MultiSwap with Uniswap

This project uses the core smart contracts of uniswap v3 to swap n (n>1) tokens to one single token.

## Dependencies
  dotenv
  ethers
  express

1.Note: You should have sufficient balance of weth,usdc and uni tokens (atleast 0.0005 each)

2.Network used: 1>Polygon Mainnet (preferred)
              2>Sepolia Testnet

3. In .env file, please enter your wallet address,secret key, and infura url(https://polygon-mainnet.infura.io/v3/YOUR_API_KEY)

## Steps:

1. Initially, check the balance of WETH,USDC AND UNI.

2. After that in your terminal , run

   `npm start`

   Server will start running on port 3000

4. After execution of this command,
      (i) Balance of weth and usdc should have reduced significantly.
      (ii) Balance of uni should be increased upon swapping.
