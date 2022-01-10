// Import Web3 JS library
const Web3 = require('web3');

// Import the ABI definition of the DemoContract
const artifact = require('../../build/contracts/DonarContract.json');

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

    getDonar: async function() {
        const _medical_id = await this.contractInstance.methods.getDonar().call();
        alert('Data is ' + _medical_id);

        console.log(_medical_id);
        await this.contractInstance.methods.getDonar(_medical_id).send({
            from: this.accounts[0]
        })
    },

    setDonars: async function() {
        const _firstname = document.getElementById('_firstname').value;
        const _lastname = document.getElementById('_lastname').value;
        const _age = document.getElementById('_age').value;
        const _gender = document.getElementById('_gender').value;
        const _medical_id = document.getElementById('_medical_id').value;
        const _blood_type = document.getElementById('_blood_type').value;
        const _organ = document.getElementById('_organ').value;
        const _location = document.getElementById('_location').value;

        console.log(_firstname, _lastname, _age, _gender, _medical_id, _blood_type, _organ, _location);
        await this.contractInstance.methods.addDonars(_firstname, _lastname, _age, _gender, _medical_id, _blood_type, _organ, _location).send({
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
