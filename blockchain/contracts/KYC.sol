pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract KYC {
    address public owner;
    // uint256 currentUserCount;

    mapping(address=>bool) isAdmin;
    event OwnerChanged(address indexed _from,address indexed _to);
    event AdminAdded(address indexed Admin_Address);
    event AdminRemoved(address indexed Admin_Address);
    
    constructor() public {
        owner=msg.sender;
        isAdmin[msg.sender]=true;
        // currentUserCount = 1;
    }
    
    modifier onlyOwner(){
        require(owner == msg.sender,"Only Owner has permission to do that action!");
        _;
    }
    
    modifier onlyAdmin(){
        require(isAdmin[msg.sender] == true,"Only Admin has permission to do that action!");
        _;
    }

    modifier onlyAuthority(){
        require(((isAdmin[msg.sender] == true) || (owner == msg.sender) || isBank[msg.sender]), "Only Authorities have permission to do this action!");
        _;
    }
    
    modifier onlyBank(){
        require(isBank[msg.sender],"Only Banks can do this action!");
        _;
    }

    function setOwner(address _owner) public onlyOwner returns(bool success){
        require(msg.sender!=_owner,"You are already the owner!");
        owner = _owner;
        emit OwnerChanged(msg.sender, _owner);
        return true;
    }

    function addAdmin(address _address) public onlyOwner returns(bool success){
        require(!isAdmin[_address],"User is already an admin!");
        isAdmin[_address]=true;
        emit AdminAdded(_address);
        return true;
    }

    function removeAdmin(address _address) public onlyOwner returns(bool success){
        require(_address!=owner,"Can't remove owner from admin");
        require(isAdmin[_address],"User is not an admin!");
        isAdmin[_address]=false;
        emit AdminRemoved(_address);
        return true;
    }

    struct Bank {
        uint256 id;
        string bName;
        string bAddress;
        string bContact;
        address addr;
        bool isApproved;
        string[] requestList;
        string[] approvals;
    }
    
    struct tempCustomer {
        string name;
        string kycId;
    }

    uint256 public index;
    mapping(address=>bool) isBank;
    mapping(address=>Bank) Banks;
    address[] public BankList;

    mapping(address => mapping(string=>bool)) isRequested;
    mapping(address => mapping(string=>uint)) bankRequestIndex; //index of customer_id in bank's request list
    mapping(string => mapping(address => uint)) customerRequestIndex; //index of bank address in customer's request list
    
    
    function addRequest(string memory _kycId) public onlyBank{
        require(isCustomer[_kycId], "Not a registered Customer!");
        require(!isRequested[msg.sender][_kycId] && !isBankAuth[_kycId][msg.sender], "Request already exists or already authorized!");

        Banks[msg.sender].requestList.push(_kycId);
        Customers[_kycId].requestList.push(msg.sender);
        isRequested[msg.sender][_kycId] = true;
        bankRequestIndex[msg.sender][_kycId] = Banks[msg.sender].requestList.length - 1;
        customerRequestIndex[_kycId][msg.sender] = Customers[_kycId].requestList.length - 1;
    }
    
    function removeRequest(string memory _kycId) public onlyBank{
        require(isCustomer[_kycId], "Not a registered Customer!");
        require(isRequested[msg.sender][_kycId], "No Pending Requests!");
        
        delete isRequested[msg.sender][_kycId];
        removeElementFromBankRequestList(bankRequestIndex[msg.sender][_kycId], msg.sender);
        removeElementFromCustomerRequestList(customerRequestIndex[_kycId][msg.sender], _kycId);
    }

    function manageRequest(string memory _kycId, address _bankAddress, bool response) public onlyAdmin{
        require(isCustomer[_kycId], "Not a registered Customer!");
        require(isBank[_bankAddress], "Not a registered Bank!");
        require(isRequested[_bankAddress][_kycId], "No Pending Requests!");

        if(response){
            addAuth(_kycId, _bankAddress);
            Customers[_kycId].approvedBanks.push(_bankAddress);
            Banks[_bankAddress].approvals.push(_kycId);
        }
        delete isRequested[_bankAddress][_kycId];
        removeElementFromBankRequestList(bankRequestIndex[_bankAddress][_kycId], _bankAddress);
        removeElementFromCustomerRequestList(customerRequestIndex[_kycId][_bankAddress], _kycId);
    }

    function removeElementFromBankRequestList(uint _index, address _bankAddress) private{
        if (_index >= Banks[_bankAddress].requestList.length) return;

        for (uint i = _index; i<Banks[_bankAddress].requestList.length-1; i++){
            Banks[_bankAddress].requestList[i] = Banks[_bankAddress].requestList[i+1];
            bankRequestIndex[_bankAddress][Banks[_bankAddress].requestList[i]] = i;
        }
        Banks[_bankAddress].requestList.pop();
    }

    function removeElementFromCustomerRequestList(uint _index, string memory _kycId) private{
        if (_index >= Customers[_kycId].requestList.length) return;

        for (uint i = _index; i<Customers[_kycId].requestList.length-1; i++){
            Customers[_kycId].requestList[i] = Customers[_kycId].requestList[i+1];
            customerRequestIndex[_kycId][Customers[_kycId].requestList[i]] = i;
        }
        Customers[_kycId].requestList.pop();
    }

    struct ClientData {
        tempBank[] pendingBanks;
        tempBank[] approvedBanks;
    }

    struct BankData {
        tempCustomer[] pendingCustomers;
        tempCustomer[] approvedCustomers;
    }

    function getClientData(string memory _kycId) public view onlyAdmin returns (ClientData memory) {
        require(isCustomer[_kycId], "Not a registered Customer!");

        tempBank[] memory  pendingBanks = getPendingBanks(_kycId);
        tempBank[] memory  approvedBanks = getApprovedBanks(_kycId);

        return ClientData(pendingBanks, approvedBanks);
    }

    function getApprovedBanks(string memory _kycId) private view returns (tempBank[] memory) {
        tempBank[] memory returnList = new tempBank[](Customers[_kycId].approvedBanks.length);

        for(uint i = 0; i < returnList.length; i++){
            returnList[i] = tempBank(Banks[Customers[_kycId].approvedBanks[i]].bName, Banks[Customers[_kycId].approvedBanks[i]].addr);
        }
        return returnList;
    }

    function getPendingBanks(string memory _kycId) private view returns (tempBank[] memory) {
        tempBank[] memory returnList = new tempBank[](Customers[_kycId].requestList.length);

        for(uint i = 0; i < returnList.length; i++){
            returnList[i] = tempBank(Banks[Customers[_kycId].requestList[i]].bName, Banks[Customers[_kycId].requestList[i]].addr);
        }
        return returnList;
    }

    function getBankData() public view onlyBank returns (BankData memory) {
        require(isBank[msg.sender], "Not a registered Bank!");
        
        tempCustomer[] memory  pendingCustomers = getPendingCustomers();
        tempCustomer[] memory  approvedCustomers = getApprovedCustomers();

        return BankData(pendingCustomers, approvedCustomers);
    }

    function getApprovedCustomers() private view returns (tempCustomer[] memory) {
        tempCustomer[] memory returnList = new tempCustomer[](Banks[msg.sender].approvals.length);

        for(uint i = 0; i < returnList.length; i++){
            returnList[i] = tempCustomer(Customers[Banks[msg.sender].approvals[i]].name, Customers[Banks[msg.sender].approvals[i]].kycId);
        }
        return returnList;
    }

    function getPendingCustomers() private view returns(tempCustomer[] memory){
        tempCustomer[] memory returnList = new tempCustomer[](Banks[msg.sender].requestList.length);

        for(uint i = 0; i < Banks[msg.sender].requestList.length; i++){
            returnList[i] = tempCustomer(Customers[Banks[msg.sender].requestList[i]].name, Banks[msg.sender].requestList[i]);
        }
        return returnList;
    }

    function addBank(string memory _bName,string memory _bAddress,string memory _bContact,address _addr) public onlyAdmin{
        require(!isBank[_addr],"Already a Bank");
        BankList.push(_addr);
        index = index + 1;
        isBank[_addr]=true;
        Banks[_addr].id = index;
        Banks[_addr].bName = _bName;
        Banks[_addr].bAddress = _bAddress;
        Banks[_addr].bContact = _bContact;
        Banks[_addr].addr = _addr;
        Banks[_addr].isApproved = true;
    } 
      
    function getBankByAddress(address _address) public view onlyAuthority returns(string memory bName,string memory bAddress , string memory bContact ,address addr , bool isApproved){
        require(Banks[_address].isApproved,"Bank is not Approved or doesn't exist");
        require(isAdmin[msg.sender] || msg.sender == _address, "Not Authorized to view data!");
        Bank memory tmp = Banks[_address];
        return (tmp.bName,tmp.bAddress,tmp.bContact,tmp.addr,tmp.isApproved);
    } 
    
    struct Records {
        string bName;
        string data;
        uint time;
    }
    
    struct KycVerdict {
        string bName;
        string remarks;
        uint status;
        uint time;
    }

    struct Customer{
        string kycId;
        string name;
        string phone;
        string customerAddress;
        string gender;
        string dob;
        string PAN;
        Records[] records;
        address[] requestList;
        address[] approvedBanks;
        KycVerdict[] kycHistory;
        uint kycStatus;
    }

    string[] private CustomerList;
    // Customer[] public CustomerDetailList; //FOR DEBUGGING, COMMENT LATER

    mapping(string=>mapping(address=>bool)) isBankAuth; //userId -> address of Bank -> bool
    mapping(string=>Customer) Customers;
    mapping(string=>bool) isCustomer;
    mapping(string=>bool) isCustomerFromPAN;
    // mapping(string=>string) PAN2KycId;
    
    /* ------USE UPDATE RECORD TO ADD INSTEAD------ */
    // function addRecord(string memory _kycId,string memory _bName, string memory _ipfs) public onlyBank{
    //     require(isCustomer[_kycId],"User Not registered");
    //     require(isBankAuth[_kycId][msg.sender],"No permission to add Records");
    //     Customers[_kycId].records.push(Records(_bName, _ipfs, block.timestamp));        
    // }
    
    function addCustomer(string memory _name, string memory _phone, string memory customerAddress, string memory _gender, string memory _dob, string memory _PAN, string memory _kycId, string memory _geoLocation, string memory ipfs_selfie, string memory ipfs_aadhar, string memory ipfs_pan) public onlyAdmin{
        require(!isCustomer[_kycId],"Already Customer account exists");    
        require(!isCustomerFromPAN[_PAN],"Already Customer account exists");    

        Customers[_kycId].kycId = _kycId;
        isCustomer[_kycId] = true;
        isCustomerFromPAN[_PAN] = true;
        Customers[_kycId].name=_name;
        Customers[_kycId].phone=_phone;
        Customers[_kycId].customerAddress = customerAddress;
        Customers[_kycId].gender=_gender;
        Customers[_kycId].dob=_dob;
        Customers[_kycId].PAN = _PAN;
        Customers[_kycId].kycStatus = 0;
        Customers[_kycId].records.push(Records("aadhar", ipfs_aadhar, block.timestamp));
        Customers[_kycId].records.push(Records("pan", ipfs_pan, block.timestamp));
        Customers[_kycId].records.push(Records("selfie", ipfs_selfie, block.timestamp));
        Customers[_kycId].records.push(Records("geoLocation", _geoLocation, block.timestamp));
        // CustomerDetailList.push(Customers[_kycId]);
        // isBankAuth[_kycId][msg.sender] = true;
        // Customers[_kycId].approvedBanks.push(msg.sender);
        // Banks[msg.sender].approvals.push(_kycId);

        // PAN2KycId[_PAN] = _kycId;
    }

    function updateRecord(string memory _kycId, string memory record_type, string memory record_data) public onlyAuthority {
        require(isCustomer[_kycId],"No Customers found at the given address");
        require(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender],"No permission to edit Records");

        bool found = false;
        for(uint i = 0; i < Customers[_kycId].records.length; i++){
            if(keccak256(abi.encodePacked(Customers[_kycId].records[i].bName)) == keccak256(abi.encodePacked(record_type))){
                Customers[_kycId].records[i].data = record_data;
                Customers[_kycId].records[i].time = block.timestamp;
                found = true;
                break;
            }
            if(!found){
                Customers[_kycId].records.push(Records(record_type, record_data, block.timestamp));
            }
        }
    }

    struct tempBank {
        string name;
        address addr;
    }

    // function getKycIdFromPAN(string memory _PAN) public onlyBank view returns(string memory){
    //     string memory _kycId = PAN2KycId[_PAN];
    //     require(isCustomer[_kycId],"No Customer found with given PAN");
    //     return _kycId;
    // }

    function getCustomerDetails(string memory _kycId) public onlyAuthority  view returns(Customer memory){
        require(isCustomer[_kycId],"No Customers found at the given address");
        require(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender],"No permission to get Records");
        return Customers[_kycId];
    }
    
    // function getCustomerRecords(string memory _kycId) public onlyBank  view returns(string[] memory _bName, string[] memory ipfs){
    //     require(isCustomer[_kycId],"No Customers found at the given address");
    //     require(isAdmin[msg.sender] || isBankAuth[_kycId][msg.sender],"No permission to get Records");
    //     require(Customers[_kycId].records.length>0,"Customer record doesn't exist");
    //     string[] memory bName = new string[](Customers[_kycId].records.length);
    //     string[] memory IPFS = new string[](Customers[_kycId].records.length);
    //     for(uint256 i=0;i<Customers[_kycId].records.length;i++){
    //         bName[i]=Customers[_kycId].records[i].bName;
    //         IPFS[i]=Customers[_kycId].records[i].ipfs;
    //     }
    //     return(bName, IPFS);
    // }
    
    /*
        Verdict Id - Status
        --------------------------------
        0          - Not Initiated
        1          - Accepted
        2          - Rejected
        3          - Revoked Needs Update
    */
    
    function updateKycStatus(string memory _kycId, string memory bName, string memory remarks, uint timeStamp, uint verdict) public onlyBank{
        require(isCustomer[_kycId], "Not a registered Customer!");
        Customers[_kycId].kycHistory.push(KycVerdict(bName, remarks, verdict, timeStamp));
        Customers[_kycId].kycStatus = verdict;
        removeFromPendingList(_kycId);
    }

    function removeFromPendingList(string memory _kycId) private {
        string[] storage array = Banks[msg.sender].approvals;

        for(uint i = 0; i < array.length; i++){
            if(keccak256(abi.encodePacked(array[i])) == keccak256(abi.encodePacked(_kycId))){
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
    // function removeFromPendingList(string memory _kycId) public returns(string[] memory){
    //     for(uint i = 0; i < Banks[msg.sender].approvals.length; i++){
    //         if(keccak256(abi.encodePacked(Banks[msg.sender].approvals[i])) == keccak256(abi.encodePacked(_kycId))){
    //             Banks[msg.sender].approvals[i] = Banks[msg.sender].approvals[Banks[msg.sender].approvals.length - 1];
    //             Banks[msg.sender].approvals.pop();
    //             delete Banks[msg.sender].approvals[Banks[msg.sender].approvals.length - 1];
    //             break;
    //         }
    //     }
    //     return Banks[msg.sender].approvals;
    // }

    function addAuth(string memory _kycId, address _bankAddress) public onlyAdmin{
        require(isCustomer[_kycId], "Not a registered Customer!");
        require(isBank[_bankAddress], "Not a registered Bank!");
        require(!isBankAuth[_kycId][_bankAddress],"Already Authorised");
        require(isAdmin[msg.sender] || msg.sender!=_bankAddress,"Cant add yourself");
        isBankAuth[_kycId][_bankAddress] = true;
    }

    function revokeAuth(string memory _kycId, address _bankAddress) public onlyAdmin{
        require(isCustomer[_kycId], "Not a registered Customer!");
        require(isBank[_bankAddress], "Not a registered Bank!");
        require(msg.sender!=_bankAddress,"Cant remove yourself");
        require(isBankAuth[_kycId][_bankAddress],"Already Not Authorised");
        isBankAuth[_kycId][_bankAddress] = false;
    }

    // function genRandom() private view returns (uint) {
    //     uint rand = string(keccak256(abi.encodePacked(blockhash(block.number-1))));
    //     return uint(rand % (10 ** 20));
    // }
}