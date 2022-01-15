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

        let checkValues = false;

        if (fullname=="")
            document.getElementById("donorValuesCheck").innerHTML = "Enter your name";
        else if (age.length==0)
            document.getElementById("donorValuesCheck").innerHTML = "Enter your age";
        else if (age<18)
            document.getElementById("donorValuesCheck").innerHTML = "You must be over 18 to register";
        else if(medical_id.length==0)
            document.getElementById("donorValuesCheck").innerHTML = "Enter your Medical ID";
        else if(organ.length==0)
            document.getElementById("donorValuesCheck").innerHTML = "Enter organ name";
        else if(weight.length==0)
            document.getElementById("donorValuesCheck").innerHTML = "Enter your weight";
        else if(weight<20 || weight>200)
            document.getElementById("donorValuesCheck").innerHTML = "Enter proper weight";
        else if(height.length==0)
            document.getElementById("donorValuesCheck").innerHTML = "Enter your height";
        else if(height<54 || height>272)
            document.getElementById("donorValuesCheck").innerHTML = "Enter proper height";
        else
            checkValues = true;
        
        if (checkValues) {
            const validate = await this.contractInstance.methods.validateDonor(medical_id).call();

            if (!validate) {        
                console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
                    from: this.accounts[0]
                });
                await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
                    from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
                })
                document.getElementById("donorConfirmationCheck").innerHTML = "Success!";
                document.getElementById("donorValidateCheck").innerHTML = null;
                document.getElementById("donorValuesCheck").innerHTML = null;
            }
            else {
                document.getElementById("donorValidateCheck").innerHTML = "Medical ID already exists!";
                document.getElementById("donorConfirmationCheck").innerHTML = null;
                document.getElementById("donorValuesCheck").innerHTML = null;
            }
        }
    },
    getDonor: async function() {
        const medical_id = document.getElementById('inputDonorMedicalID').value;

        const validate = await this.contractInstance.methods.validateDonor(medical_id).call();

        if (validate) {
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
        }
        else {
            document.getElementById("getDonorFullName").innerHTML = "Medical ID does not exist!";
            document.getElementById("getDonorAge").innerHTML = null;
            document.getElementById("getDonorGender").innerHTML = null;
            document.getElementById("getDonorBloodType").innerHTML = null;
            document.getElementById("getDonorOrgan").innerHTML = null;
            document.getElementById("getDonorWeight").innerHTML = null;
            document.getElementById("getDonorHeight").innerHTML = null;
        }
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

        let checkValues = false;

        if (fullname=="")
            document.getElementById("patientValuesCheck").innerHTML = "Enter your name";
        else if (age.length==0)
            document.getElementById("patientValuesCheck").innerHTML = "Enter your age";
        else if (age<18)
            document.getElementById("patientValuesCheck").innerHTML = "You must be over 18 to register";
        else if(medical_id.length==0)
            document.getElementById("patientValuesCheck").innerHTML = "Enter your Medical ID";
        else if(organ.length==0)
            document.getElementById("patientValuesCheck").innerHTML = "Enter organ name";
        else if(weight.length==0)
            document.getElementById("patientValuesCheck").innerHTML = "Enter your weight";
        else if(weight<20 || weight>200)
            document.getElementById("patientValuesCheck").innerHTML = "Enter proper weight";
        else if(height.length==0)
            document.getElementById("patientValuesCheck").innerHTML = "Enter your height";
        else if(height<54 || height>272)
            document.getElementById("patientValuesCheck").innerHTML = "Enter proper height";
        else 
            checkValues = true;

        if (checkValues) {
            const validate = await this.contractInstance.methods.validatePatient(medical_id).call();

            if (!validate) {   
                console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                const gas = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
                    from: this.accounts[0]
                });
                await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
                    from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
                });
                document.getElementById("patientConfirmationCheck").innerHTML = "Success!";
                document.getElementById("patientValidateCheck").innerHTML = null;
                document.getElementById("patientValuesCheck").innerHTML = null;
            }
            else {
                document.getElementById("patientValidateCheck").innerHTML = "Medical ID already exists!";
                document.getElementById("patientConfirmationCheck").innerHTML = null;
                document.getElementById("patientValuesCheck").innerHTML = null;
            }
        }
        else {
            document.getElementById("patientConfirmationCheck").innerHTML = null;
            document.getElementById("patientValidateCheck").innerHTML = null;
        }
    },
    getPatient: async function() {
        const medical_id = document.getElementById('inputPatientMedicalID').value;
        const validate = await this.contractInstance.methods.validatePatient(medical_id).call();

        if (validate) {
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
        }
        else {
            document.getElementById("getPatientFullName").innerHTML = "Medical ID does not exist!";
            document.getElementById("getPatientAge").innerHTML = null;
            document.getElementById("getPatientGender").innerHTML = null;
            document.getElementById("getPatientBloodType").innerHTML = null;
            document.getElementById("getPatientOrgan").innerHTML = null;
            document.getElementById("getPatientWeight").innerHTML = null;
            document.getElementById("getPatientHeight").innerHTML = null;
        }
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
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": donorIDs[i], "Blood-Type": result[3], Organ: result[4], Weight: result[5], Height: result[6]},
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
        document.getElementById("transplantTable").innerHTML = null;
        var patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        var donorCount = await this.contractInstance.methods.getCountOfDonors().call();
        var patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        var donorIDs = [''];
        await this.contractInstance.methods.getAllDonorIDs().call().then(function(result){
            for (let i=0; i<donorCount; i++) {
                donorIDs[i] = result[i];
            }
        });
        let match;
        console.log("Patient Count: " + patientCount);
        console.log("Donor Count: " + donorCount);

        let once = true;

        for (var i=0; i<patientCount; i++) {
            console.log("In Patient loop");
            var patientname;
            var patientbloodtype;            
            var patientorgan;
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result){
                patientname = result[0];
                patientbloodtype=result[3];
                patientorgan=result[4];
            });
            for (var j=0; j<donorCount; j++) {
                console.log("In Donor loop");
                var donorname;
                var donorbloodtype;
                var donororgan;
                await this.contractInstance.methods.getDonor(donorIDs[j]).call().then(function(result){
                    donorname = result[0];
                    donorbloodtype = result[3];
                    donororgan = result[4];
                });
                if (patientbloodtype==donorbloodtype && patientorgan==donororgan) {
                    match = [
                        { "Patient Name": patientname, "Patient Organ": patientorgan, "Patient ID": patientIDs[i],"": "↔️", "Donor ID": donorIDs[j], "Donor Organ": donororgan, "Donor Name": donorname},
                    ];

                    let data = Object.keys(match[0]);
                    if (once){
                        generateTableHead(table, data);
                        once = false;
                    }
                    generateTable(table, match);
                    console.log(donorIDs);

                    let temp = donorIDs[j];
                    donorIDs[j] = donorIDs[donorCount-1];
                    donorIDs[donorCount-1] = temp;

                    console.log(donorIDs);
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