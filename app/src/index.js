// Import Web3 JS library
const Web3 = require('web3');

// Import the ABI definition of the DemoContract
const artifact = require('../../build/contracts/DemoContract.json');

const contractAddress = '0xDA7f610510cc6B40a88cae2463D2455C7dF5041c';

const App = {
    web3: null,
    contractInstance: null,
    accounts: null,

    start: async function() {
        const { web3 } = this;
        // Get the accounts
        this.accounts = await web3.eth.getAccounts();

        console.log(this.accounts);

        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
    },

    getData: async function() {
        const data = await this.contractInstance.methods.getData().call();
        alert('Data is ' + data);
    },

    setData: async function() {
        const data = document.getElementById('data').value;
        console.log(data);
        await this.contractInstance.methods.setData(data).send({
            from: this.accounts[0]
        });
    }
}

window.App = App;

window.addEventListener("load", function() {
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );

  App.start();
});
