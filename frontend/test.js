async function generate_wallets() {
    const xrpl = require('xrpl');
    const api = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await api.connect();

    const userWallet = xrpl.Wallet.generate();
    const destinationWallet = xrpl.Wallet.generate();
    console.log(userWallet.classicAddress);
    console.log(destinationWallet.classicAddress);

    api.disconnect();

}

generate_wallets();