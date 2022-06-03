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

function showWarning(user, message, color) {
    let userid = user+"InputCheck";
    var warning = document.querySelector(".alert.warning");
    warning.style.background = color;
    document.getElementById(userid).innerHTML = message;
    warning.style.opacity = "100";
    warning.style.display = "block";
}

function checkInputValues(user, fullname, age, medical_id, organ, weight, height){
    var color = "#ff9800"
    if (fullname=="")
        showWarning(user, "Enter your name", color);
    else if (age.length==0)
        showWarning(user, "Enter your age", color);
    else if (age<18)
        showWarning(user, "You must be over 18 to register", color);
    else if (medical_id.length == 0)
         showWarning(user, "Enter your Medical ID", color);
    else if (organ.length == 0)
        showWarning(user, "Enter organ(s)", color);
    else if (weight.length == 0)
        showWarning(user, "Enter your weight", color);
    else if (weight < 20 || weight > 200)
        showWarning(user, "Enter proper weight", color);
    else if (height.length == 0)
        showWarning(user, "Enter your height", color);
    else if (height < 54 || height > 272)
        showWarning(user, "Enter proper height", color);
    else {
        return true;
    }
}

function assignSearchValues(result, user){
    document.getElementById("get"+user+"FullName").innerHTML = "First Name: " + result[0];
    document.getElementById("get"+user+"Age").innerHTML = "Age: " + result[1];
    document.getElementById("get"+user+"Gender").innerHTML = "Gender: " + result[2];
    document.getElementById("get"+user+"BloodType").innerHTML = "Blood Type: " + result[3];
    document.getElementById("get"+user+"Organ").innerHTML = "Organ: " + result[4];
    document.getElementById("get"+user+"Weight").innerHTML = "Weight: " + result[5];
    document.getElementById("get"+user+"Height").innerHTML = "Height: " + result[6];
}

function clearSearchValues(user){
    document.getElementById("get"+user+"FullName").innerHTML = null;
    document.getElementById("get"+user+"Age").innerHTML = null;
    document.getElementById("get"+user+"Gender").innerHTML = null;
    document.getElementById("get"+user+"BloodType").innerHTML = null;
    document.getElementById("get"+user+"Organ").innerHTML = null;
    document.getElementById("get"+user+"Weight").innerHTML = null;
    document.getElementById("get"+user+"Height").innerHTML = null;
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

    closeAlert: async function (){
        var alert = document.querySelector(".alert.warning");
        alert.style.opacity = "0";
        setTimeout(function(){ alert.style.display = "none"; }, 600);
    },

    register: async function(user) {
        console.log(user);
        const fullname = document.getElementById(user+'FullName').value;
        const age = document.getElementById(user+'Age').value;
        const gender = document.getElementById(user+'Gender').value;
        const medical_id = document.getElementById(user+'MedicalID').value;
        const blood_type = document.getElementById(user+'BloodType').value;
        let checkboxes = document.querySelectorAll("input[name='Organ']:checked");
        let organ = [];
        checkboxes.forEach((checkbox) => {
            organ.push(checkbox.value);
        });
        const weight = document.getElementById(user+'Weight').value;
        const height = document.getElementById(user+'Height').value;

        let checkedValues = false;
        checkedValues = checkInputValues(user, fullname, age, medical_id, organ, weight, height);
        console.log("Values Checked");
        var warning = document.querySelector(".alert.warning");
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
                if (user=="Donor")
                    this.setDonor(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                else if (user=="Patient") 
                    this.setPatient(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                showWarning(user, "Registration Successful!", "#04AA6D");
                setTimeout(function(){
                    warning.style.opacity = "0";
                    setTimeout(function(){ warning.style.display = "none"; }, 1200);
                }, 5000);
            }
            else {
                showWarning(user, "Medical ID already exists!", "#f44336");
            }
        }
    },

    setDonor: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height
        ).send({
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

    search: async function(user) {
        console.log(user);
        const medical_id = document.getElementById("input"+user+"MedicalID").value;
        if (medical_id.length==0) {
            document.getElementById("search"+user+"Check").innerHTML = "Enter Medical ID";
            clearSearchValues(user);
        }

        else {
            let validate = false;
            if (user=="Donor"){
                validate = await this.contractInstance.methods.validateDonor(medical_id).call();
            }
            else if (user="Patient") {
                validate = await this.contractInstance.methods.validatePatient(medical_id).call();
            }
            console.log("Inside getDonor: "+validate);

            if (validate) {
                if (user=="Donor"){
                    await this.contractInstance.methods.getDonor(medical_id).call().then(function(result){
                        console.log(result);
                        document.getElementById("search"+user+"Check").innerHTML = null;
                        assignSearchValues(result, user);
                    });
                }
                else if (user="Patient"){
                    await this.contractInstance.methods.getPatient(medical_id).call().then(function(result){
                        console.log(result);
                        document.getElementById("search"+user+"Check").innerHTML = null;
                        assignSearchValues(result, user);
                    });
                }
            }
            else {
                document.getElementById("search"+user+"Check").innerHTML = "Medical ID does not exist!";
                clearSearchValues(user);
            }
        }
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
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
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
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    },

    transplantMatch: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
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

        let donor = [];
        for (let i=0; i<donorCount; i++) {
            await this.contractInstance.methods.getDonor(donorIDs[i]).call().then(function(result){
                let organsArr = [];
                let temp = result[4];
                for (let o=0; o<temp.length; o++) {
                    organsArr[o] = temp[o];
                }
                donorObj = { ID: donorIDs[i], name: result[0], bloodtype: result[3], organs: organsArr, organcount: organsArr.length };
                donor[i] = donorObj;
            });
        }
        console.log(donor);

        let match;
        console.log("Patient Count: " + patientCount);
        console.log("Donor Count: " + donorCount);

        let initialTableGeneration = true;

        for (var i=0; i<patientCount; i++) {
            var patientname;
            var patientbloodtype;            
            var patientorgans;
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result){
                patientname = result[0];
                patientbloodtype=result[3];
                patientorgans=result[4];
            });
            console.log("Checking patient: "+patientname);
            for (var poi=0; poi < patientorgans.length; poi++) {
                console.log("Checking patient organ: "+patientorgans[poi]);
                for (var j=0; j<donorCount; j++) {
                    let matchedOrgan = false;
                    console.log("Checking donor: "+donor[j].name);
                    console.log("Organ count: "+donor[j].organcount);
                    for (let doi=0; doi < donor[j].organcount; doi++) {
                        console.log("Checking donor organ: "+donor[j].organs[doi])
                        if (patientbloodtype==donor[j].bloodtype && patientorgans[poi]==donor[j].organs[doi]) {
                            matchedOrgan = true;
                            console.log("Matched: "+patientname+" "+patientorgans[poi]+"<->"+donor[j].name+" "+donor[j].organs[doi]);
                            match = [
                                { "Patient Name": patientname, "Patient Organ": patientorgans[poi], "Patient ID": patientIDs[i],"": "↔️", "Donor ID": donorIDs[j], "Donor Organ": donor[j].organs[doi], "Donor Name": donor[j].name},
                            ];
        
                            let data = Object.keys(match[0]);
                            if (initialTableGeneration){
                                generateTableHead(table, data);
                                initialTableGeneration = false;
                            }
                            generateTable(table, match);
                            
                            // Removing marked donor organ
                            donor[j].organs[doi] = donor[j].organs[donor[j].organcount-1];
                            donor[j].organs.pop();
                            donor[j].organcount--;
                            break;
                        }
                    }
                    if (donor[j].organcount == 0) {
                        donor[j] = donor[donorCount-1];
                        donorCount--;
                    }
                    if (matchedOrgan) {
                        break;
                    }
                }
            }
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    }

}

window.App = App;

window.addEventListener("load", function() {
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );

  App.start();
});