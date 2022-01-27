import React, { useEffect,useState} from 'react';
import ClientData from"../Client/ClientData";

const VerifyClient = ({data,dmr,accounts}) => {

  const [clientData, setClientData] = useState(null);
  useEffect(() => {

    if (dmr && accounts) {
      dmr.methods
        .getCustomerDetails(data.kycId)
        .call({ from: accounts[0] })
        .then((res) => {
          console.log(res)
          let t = {
            name:res.name,
            gender:res.gender,
            phone:res.phone,
            address:res.customerAddress,
            email:res.email,
            kycId:res.kycId,
            kycStatus:res.kycStatus,
            records:res.records,
            kycHistory:res.kycHistory
          }
          setClientData(t);          
        })
        .catch((err) => {
          console.log(err);
        });
    }    
     // eslint-disable-next-line         
  }, []);

  
  return (
    <>     
      {clientData && <ClientData userData={clientData}/>}            
    </>
  )
};

export default VerifyClient;
