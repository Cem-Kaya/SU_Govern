from web3 import Web3


add = "0x0F9a9286931C5F369477192857b80E7452206255" #DAO address 

#sensitive data !  put in somewhere else and gitignore it !!!!!!!!!!!!!!!!!!!!!!!
private_key = 'a3a23d3563e87ae81b2f44d71b78a674b1bd00c9de62a784150507ea93748920' # my private key
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


#####################################

# pip install Web3
web3_ = Web3(
  Web3.HTTPProvider('https://endpoints.omniatech.io/v1/matic/mumbai/public'))

print(f"connection status {web3_.isConnected()}")

abi_ = ""
with open("abi.txt", "r") as f:
  abi_ = f.read()
#print(len(abi_))
contract = web3_.eth.contract(address=add, abi=abi_)
u_add = '0xEC646470A1D1538892890301AA50DdeB9D687896'


account =web3_.eth.account.privateKeyToAccount(private_key)
#print(f"account.address is :  {account.address}")


# print(f"this daos id is : { contract.functions.send_voter_tokens_to_address_yk_directly(u_add ,1).call()}")

#gas	133929 gas
#transaction cost	130368 gas 
#a5f7619e6219bf5d5a6b3c9b5c38265b8fac21fca2d246880d11fbac5bfd0168



#estimate gas and gasprice
gasPrice = web3_.eth.gasPrice
#print(f"gas price is : {gasPrice}")
gas = 250000 # should get it from estimateGas or web  
#print(f"gas is : {gas}")

with open("addresses.txt", "r") as f:
  for i in f.readlines():    
    # Call contract function
    dest_add = i.strip()
    function = contract.functions.send_voter_tokens_to_address_yk_directly(dest_add ,1)
    transaction = function.buildTransaction({
        'from': account.address,
        'gas': gas,
        'gasPrice': gasPrice,
        'nonce': web3_.eth.getTransactionCount(account.address),
        'chainId': 80001
    })

    signed_transaction = account.signTransaction(transaction)
    transaction_hash = web3_.eth.sendRawTransaction(signed_transaction.rawTransaction)
    tx_receipt = web3_.eth.waitForTransactionReceipt(transaction_hash)
    # print(tx_receipt)
