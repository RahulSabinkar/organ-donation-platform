// Import Web3 JS library
const Web3 = require('web3');
const web3 = new Web3("HTTP://127.0.0.1:7545");

// Import the ABI definition of the DemoContract
const artifact = require('../../build/contracts/DonorContract.json');

//const netid = await web3.eth.net.getId()
const deployedContract = artifact.networks[5777];
const contractAddress = deployedContract.address;

const MIN_GAS = 1000000;

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
        });
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
        const donorCount = await this.contractInstance.methods.getCountOfDonors().call();
        const donorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
        let donor;

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
        const patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        const patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        let patient;

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

/*     transplantMatch: async function() {
        var patientIDs = contractInstance.methods.getAllPatientIDs().call();
        var donorIDs = contractInstance.methods.getAllDonorIDs().call();
        var patientCount = contractInstance.methods.getCountOfPatients().call();

        for (var i=0; i<= patientCount; i++) {
            var patientbloodtype = contractInstance.methods.getPatient(patient[i]).call().then(function(result){result[4];});
            var patientorgan = contractInstance.methods.getPatient(patient[i]).call().then(function(result){result[5];});

            for (var j=0; j<=contractInstance.methods.getCountOfDonors().call(); j++) {
                var donorbloodtype = contractInstance.methods.getPatient(donor[j]).call().then(function(result){result[4];});
                var donororgan = contractInstance.methods.getPatient(donor[j]).call().then(function(result){result[5];});
                if (patientbloodtype==donorbloodtype&&patientorgan==donororgan) {
                    // write patient[i] matches donor[j]
                    // pop.donor[j]: remove that medical ID from donor[j] array

                    break;
                }
            }
        }
    } */

}

window.App = App;

window.addEventListener("load", function() {
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );

  App.start();
});