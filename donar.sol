pragma solidity ^0.8.10;

contract donarContract {

    struct donar
    {

        string name;
        string id_number;
        uint phone_number;
        uint age;
        string location;
        string blood_type;
        string organ_type;

    }

    mapping ( string =>donar ) donarMap;

    string[] DonarsArray ;

    function setDonars
    (
        string memory _name,
        string memory _id_number,
        uint _phone_number,
        uint _age,
        string memory _location,
        string memory _blood_type,
        string memory _organ_type
    )

    public
    {
        require ( keccak256(abi.encodePacked((donarMap[_id_number].id_number)))
                        != keccak256(abi.encodePacked(_id_number)) );
        donarMap[_id_number].id_number = _id_number ;
        donarMap[_id_number].name = _name ;
        donarMap[_id_number].phone_number = _phone_number ;
        donarMap[_id_number].age = _age ;
        donarMap[_id_number].location = _location ;
        donarMap[_id_number].blood_type = _blood_type ;
        donarMap[_id_number].organ_type = _organ_type ;

        DonarsArray.push(_id_number) ;
    }

    function getDonar(string memory _id_number) view public returns(string memory ,string memory, uint, uint, string memory, string memory, string memory)
    {
        return
        (
            donarMap[_id_number].name,
            donarMap[_id_number].id_number,
            donarMap[_id_number].phone_number,
            donarMap[_id_number].age,
            donarMap[_id_number].location,
            donarMap[_id_number].blood_type,
            donarMap[_id_number].organ_type
        );
    }

    function validateDonar(string memory _id_number) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((donarMap[_id_number].id_number))) == keccak256(abi.encodePacked(_id_number)))
     return true ;
     else return false ;

    }

    function donarEligibility(string memory _id_number) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((donarMap[_id_number].id_number))) == keccak256(abi.encodePacked(_id_number)))
     return true ;
     else return false ;

    }

    function getAllIDs() view public returns(string[] memory)
    {
            return DonarsArray ;
    }

    function getCountOfDonars() view public returns (uint)
    {
        return DonarsArray.length ;
    }

}
