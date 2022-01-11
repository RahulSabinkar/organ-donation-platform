// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract DonorContract {

    struct donor
    {

        string firstname;
        string lastname;
        uint age;
        string gender;
        string medical_id;
        string blood_type;
        string organ;
        string location;

    }

    struct patient
    {

        string firstname;
        string lastname;
        uint age;
        string gender;
        string medical_id;
        string blood_type;
        string organ;
        string location;

    }

    mapping ( string =>donor ) donorMap;
    mapping ( string =>patient) patientMap;

    string[] DonorsArray;
    string[] PatientArray;

    function setdonors(string memory _firstname, string memory _lastname, uint _age, string memory _gender,
                       string memory _medical_id, string memory _blood_type, string memory _organ, string memory _location)
    public
    {
        require ( keccak256(abi.encodePacked((donorMap[_medical_id].medical_id))) != keccak256(abi.encodePacked(_medical_id)));
        donorMap[_medical_id].firstname = _firstname;
        donorMap[_medical_id].lastname = _lastname;
        donorMap[_medical_id].age = _age;
        donorMap[_medical_id].gender = _gender;
        donorMap[_medical_id].medical_id = _medical_id;
        donorMap[_medical_id].blood_type = _blood_type;
        donorMap[_medical_id].organ = _organ;
        donorMap[_medical_id].location = _location;

        DonorsArray.push(_medical_id);
    }

    function setPatients(string memory _firstname, string memory _lastname, uint _age, string memory _gender,
                       string memory _medical_id, string memory _blood_type, string memory _organ, string memory _location)
    public
    {
        require ( keccak256(abi.encodePacked((patientMap[_medical_id].medical_id))) != keccak256(abi.encodePacked(_medical_id)) );
        patientMap[_medical_id].firstname = _firstname;
        patientMap[_medical_id].lastname = _lastname;
        patientMap[_medical_id].age = _age;
        patientMap[_medical_id].gender = _gender;
        patientMap[_medical_id].medical_id = _medical_id;
        patientMap[_medical_id].blood_type = _blood_type;
        patientMap[_medical_id].organ = _organ;
        patientMap[_medical_id].location = _location;

        PatientArray.push(_medical_id);
    }

    function getdonor(string memory _medical_id) view public returns(string memory, string memory, uint, string memory, string memory, string memory, string memory)
    {
        return
        (
            donorMap[_medical_id].firstname,
            donorMap[_medical_id].lastname,
            donorMap[_medical_id].age,
            donorMap[_medical_id].gender,
            donorMap[_medical_id].blood_type,
            donorMap[_medical_id].organ,
            donorMap[_medical_id].location
        );
    }

    function getPatient(string memory _medical_id) view public returns(string memory, string memory, uint, string memory, string memory, string memory, string memory)
    {
        return
        (
            patientMap[_medical_id].firstname,
            patientMap[_medical_id].lastname,
            patientMap[_medical_id].age,
            patientMap[_medical_id].gender,
            patientMap[_medical_id].blood_type,
            patientMap[_medical_id].organ,
            patientMap[_medical_id].location
        );
    }

    function validateDonor(string memory _medical_id) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((donorMap[_medical_id].medical_id))) == keccak256(abi.encodePacked(_medical_id)))
     return true;
     else return false;

    }

    function validatePatient(string memory _medical_id) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((patientMap[_medical_id].medical_id))) == keccak256(abi.encodePacked(_medical_id)))
     return true;
     else return false;

    }

    function getAlldonorIDs() view public returns(string[] memory)
    {
            return DonorsArray;
    }

    function getAllPatientIDs() view public returns(string[] memory)
    {
            return PatientArray;
    }

    function getCountOfDonors() view public returns (uint)
    {
        return DonorsArray.length;
    }

    function getCountOfPatients() view public returns (uint)
    {
        return PatientArray.length;
    }

}