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

function checkInputValues(user, fullname, age, medical_id, organ, weight, height){
    let userid = user+"ValuesCheck";
    console.log(userid);
    if (fullname=="")
        document.getElementById(userid).innerHTML = "Enter your name";
    else if (age.length==0)
        document.getElementById(userid).innerHTML = "Enter your age";
    else if (age<18)
        document.getElementById(userid).innerHTML = "You must be over 18 to register";
    else if(medical_id.length==0)
        document.getElementById(userid).innerHTML = "Enter your Medical ID";
    else if(organ.length==0)
        document.getElementById(userid).innerHTML = "Enter organ name";
    else if(weight.length==0)
        document.getElementById(userid).innerHTML = "Enter your weight";
    else if(weight<20 || weight>200)
        document.getElementById(userid).innerHTML = "Enter proper weight";
    else if(height.length==0)
        document.getElementById(userid).innerHTML = "Enter your height";
    else if(height<54 || height>272)
        document.getElementById(userid).innerHTML = "Enter proper height";
    else {
        document.getElementById(userid).innerHTML = null;
        return true;
    }
}

function clearValues(user){
    document.getElementById(user+"ValuesCheck").innerHTML = null;
    document.getElementById(user+"ValidateCheck").innerHTML = null;
    document.getElementById(user+"ConfirmationCheck").innerHTML = null;
}

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

    register: async function(user) {
        console.log(user);
        clearValues(user);
        const fullname = document.getElementById(user+'FullName').value;
        const age = document.getElementById(user+'Age').value;
        const gender = document.getElementById(user+'Gender').value;
        const medical_id = document.getElementById(user+'MedicalID').value;
        const blood_type = document.getElementById(user+'BloodType').value;
        const organ = document.getElementById(user+'Organ').value;
        const weight = document.getElementById(user+'Weight').value;
        const height = document.getElementById(user+'Height').value;

        let checkedValues = false;
        checkedValues = checkInputValues(user, fullname, age, medical_id, organ, weight, height);
        console.log("Values Checked");
        if (checkedValues) {
            let validate;
            if (user=="Donor") {
                validate = await this.contractInstance.methods.validateDonor(medical_id).call();
                console.log(validate);
            }
            else if (user=="Patient") {
                validate = await this.contractInstance.methods.validatePatient(medical_id).call();
                console.log(validate);
            }

            if (!validate) {        
                console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                if (user=="Donor") {
                    this.setDonor(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                }
                else if (user=="Patient") {
                    this.setPatient(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                }
                document.getElementById(user+"ConfirmationCheck").innerHTML = "Registration Successful!";
                document.getElementById(user+"ValidateCheck").innerHTML = null;
            }
            else {
                document.getElementById(user+"DonorValidateCheck").innerHTML = "Medical ID already exists!";
                document.getElementById(user+"DonorConfirmationCheck").innerHTML = null;
            }
        }
        else {
            document.getElementById(user+"ConfirmationCheck").innerHTML = null;
            document.getElementById(user+"ValidateCheck").innerHTML = null;
        }
    },

    setDonor: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        })
    },

    setPatient: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
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

    validateDonor: async function() {
        let validate = await this.contractInstance.methods.validateDonor().call();
        return validate;
    },

    validatePatient: async function() {
        let validate = await this.contractInstance.methods.validatePatient().call();
        return validate;
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
        const DonorCount = await this.contractInstance.methods.getCountOfDonors().call();
        const DonorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
        let Donor;

        for (let i=0; i<DonorCount; i++) {
            await this.contractInstance.methods.getDonor(DonorIDs[i]).call().then(function(result) {
                console.log(result);
                Donor = [
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": DonorIDs[i], "Blood-Type": result[3], Organ: result[4], Weight: result[5], Height: result[6]},
                ];

                let data = Object.keys(Donor[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, Donor);
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