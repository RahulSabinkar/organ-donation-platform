// Import Web3 JS library
const Web3 = require('web3');
const web3 = new Web3("HTTP://127.0.0.1:7545");

// Import the ABI definition of the DemoContract
const artifact = require('../../build/contracts/DonorContract.json');

// const netid = await web3.eth.net.getId()
const deployedContract = artifact.networks[5777];
const contractAddress = deployedContract.address;

const MIN_GAS = 1000000;

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}
function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
    }
}

let table = document.querySelector("table");

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

    setDonors: async function() {
        const fullname = document.getElementById('donorFullName').value;
        const age = document.getElementById('donorAge').value;
        const gender = document.getElementById('donorGender').value;
        const medical_id = document.getElementById('donorMedicalID').value;
        const blood_type = document.getElementById('donorBloodType').value;
        const organ = document.getElementById('donorOrgan').value;
        const weight = document.getElementById('donorWeight').value;
        const height = document.getElementById('donorHeight').value;

        console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
        const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        })
    },
    getDonor: async function() {
        const medical_id = document.getElementById('inputDonorMedicalID').value;
        await this.contractInstance.methods.getDonor(medical_id).call().then(function(result){
            console.log(result);
            document.getElementById("getDonorFullName").innerHTML = "First Name: " + result[0];
            document.getElementById("getDonorAge").innerHTML = "Age: " + result[1];
            document.getElementById("getDonorGender").innerHTML = "Gender: " + result[2];
            document.getElementById("getDonorBloodType").innerHTML = "Blood Type: " + result[3];
            document.getElementById("getDonorOrgan").innerHTML = "Organ: " + result[4];
            document.getElementById("getDonorWeight").innerHTML = "Weight: " + result[5];
            document.getElementById("getDonorHeight").innerHTML = "Height: " + result[6];
        });
    },
    setPatients: async function() {
        const fullname = document.getElementById('patientFullName').value;
        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;
        const medical_id = document.getElementById('patientMedicalID').value;
        const blood_type = document.getElementById('patientBloodType').value;
        const organ = document.getElementById('patientOrgan').value;
        const weight = document.getElementById('patientWeight').value;
        const height = document.getElementById('patientHeight').value;

        console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
        const gas = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },
    getPatient: async function() {
        const medical_id = document.getElementById('inputPatientMedicalID').value;
        await this.contractInstance.methods.getPatient(medical_id).call().then(function(result){
            console.log(result);
            document.getElementById("getPatientFullName").innerHTML = "Full Name: " + result[0];
            document.getElementById("getPatientAge").innerHTML = "Age: " + result[1];
            document.getElementById("getPatientGender").innerHTML = "Gender: " + result[2];
            document.getElementById("getPatientBloodType").innerHTML = "Blood Type: " + result[3];
            document.getElementById("getPatientOrgan").innerHTML = "Organ: " + result[4];
            document.getElementById("getPatientWeight").innerHTML = "Weight: " + result[5];
            document.getElementById("getPatientHeight").innerHTML = "Height: " + result[6];
        });
    },
    getCountOfDonors: async function() {
        const data = await this.contractInstance.methods.getCountOfDonors().call();
        alert('Data is ' + data);
    },
    getCountOfPatients: async function() {
        const data = await this.contractInstance.methods.getCountOfPatients().call();
        alert('Data is ' + data);
    },
    getAllDonorIDs: async function() {
        const data = await this.contractInstance.methods.getAllDonorIDs().call();
        alert('Data is ' + data);
    },
    getAllPatientIDs: async function() {
        const data = await this.contractInstance.methods.getAllPatientIDs().call();
        alert('Data is ' + data);
    },
    viewDonors: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        const donorCount = await this.contractInstance.methods.getCountOfDonors().call();
        const donorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
        let donor;

        for (let i=0; i<donorCount; i++) {
            await this.contractInstance.methods.getDonor(donorIDs[i]).call().then(function(result) {
                console.log(result);
                donor = [
                    { Index: i+1, FullName: result[0], Age: result[1], Gender: result[2], MedicalID: donorIDs[i], BloodType: result[3], Organ: result[4], Weight: result[5], Height: result[6]},
                ];

                let data = Object.keys(donor[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, donor);
            });
        }
    },
    viewPatients: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        const patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        const patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        let patient;

        for (let i=0; i<patientCount; i++) {
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result) {
                console.log(result);
                patient = [
                    { Index: i+1, FullName: result[0], Age: result[1], Gender: result[2], MedicalID: patientIDs[i], BloodType: result[3], Organ: result[4], Weight: result[5], Height: result[6]},
                ];

                let data = Object.keys(patient[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, patient);
            });
        }
    },

    transplantMatch: async function() {
        var patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        var donorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
        var patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        var donorCount = await this.contractInstance.methods.getCountOfDonors().call();
        let match;

        let flag = true;

        for (var i=0; i<patientCount; i++) {
            var patientbloodtype;
            var patientorgan;
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result){
                patientbloodtype=result[3];
                patientorgan=result[4];
            });
            for (var j=0; j<donorCount; j++) {
                var donorbloodtype;
                var donororgan;
                await this.contractInstance.methods.getDonor(donorIDs[j]).call().then(function(result){
                    donorbloodtype = result[3];
                    donororgan = result[4];
                });
                if (patientbloodtype==donorbloodtype && patientorgan==donororgan) {
                    // write patientIDs[i] matches donor[j]
                    match = [
                        { PatientID: patientIDs[i], DonorID: donorIDs[j] },
                    ];

                    let data = Object.keys(match[0]);
                    if (flag){
                        generateTableHead(table, data);
                        flag = false;
                    }
                    generateTable(table, match);
                    // pop.donorIDs[j]: remove that medical ID from donorIDs[j] array
                    [donorIDs[j], donorIDs[donorCount]] = [donorIDs[donorCount], donorIDs[j]];
                    donorCount--;
                    break;
                }
            }
        }
    }

}

window.App = App;

window.addEventListener("load", function() {
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );

  App.start();
});