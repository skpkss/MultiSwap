# MultiSwap with Uniswap

This project uses the core smart contracts of uniswap v3 to swap n (n>1) tokens to one single token.

Note: You should have sufficient balance of weth,usdc and uni tokens (atleast 0.0005 each)

Network used: Polygon Mainnet
              Sepolia Testnet

## Steps:

1. Initially, check the balance of WETH,USDC AND UNI.

2. After that in your terminal , run

   `node multicall.js`

3. After execution of this command,
      (i) Balance of weth and usdc should have reduced significantly.
      (ii) Balance of uni should be increased upon swapping.
