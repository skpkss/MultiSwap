let provider, signer, address;

const connectButton = document.getElementById('connectButton');
const swapButton = document.getElementById('swapButton');
const statusElement = document.getElementById('status');

connectButton.addEventListener('click', connectWallet);
swapButton.addEventListener('click', performSwap);

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            address = await signer.getAddress();
            statusElement.textContent = `Connected: ${address}`;
            swapButton.disabled = false;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            statusElement.textContent = 'Failed to connect wallet';
        }
    } else {
        statusElement.textContent = 'Please install MetaMask!';
    }
}

async function performSwap() {
    statusElement.textContent = 'Performing swap...';
    try {
        const response = await fetch('/swap', { method: 'POST' });
        const result = await response.json();
        if (result.success) {
            statusElement.textContent = 'Swap successful!';
        } else {
            statusElement.textContent = 'Swap failed: ' + result.error;
        }
    } catch (error) {
        console.error('Error performing swap:', error);
        statusElement.textContent = 'Error performing swap';
    }
}