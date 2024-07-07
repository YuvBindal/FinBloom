from web3 import Web3
from eth_account import Account
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()
INFURA_API_KEY = os.getenv('INFURA_API_KEY')

#Using the Sepolia testnet
infura_url = f'https://sepolia.infura.io/v3/{INFURA_API_KEY}'
web3 = Web3(Web3.HTTPProvider(infura_url))
# Check if connection is successful
if web3.is_connected():
    print("Connected to Sepolia testnet")
else:
    print("Connection failed")

# to_account_test_address = '0x0862c4565824d52ceF1179C149d560443AcAc9f1'
# to_account_private_key = '0x711c60256a07706280ae2f391a454a1aac0fcc66a7b26ab614c747d7b0bd58bd'
# from_account_address = '0xD6e89dAe8028dc5B88A8C85FE160EC99aa1Bc83B'
# from_account_private_key = '0x99d7e1d4d8d7d5800c966466a5107f1ae953d51dc1aaa8c19419e6ba5a404bbb'

class TransactionData(BaseModel):
    from_account: str
    to_account: str
    amount: float
    gas_limit: int
    from_account_private_key: str

def create_public_private():
    account = Account.create()
    address = account.address
    private_key = account._private_key.hex()
    print(f"Address: {address}")
    print(f"Private Key: {private_key}")
    return address, private_key

def check_account_balance(address):
    if not web3.is_address(address):
        return -1
    balance_wei = web3.eth.get_balance(address)
    balance_eth = web3.from_wei(balance_wei, 'ether')
    
    return balance_eth

def check_valid_wallet_address(address):
    return web3.is_address(address)

# print(check_valid_wallet_address(random_string))


def receive_funds_transaction(transactionData: TransactionData):
    gas_price = web3.to_wei('20', 'gwei')
    gas_limit = transactionData.gas_limit
    balance_eth = check_account_balance(transactionData.from_account)
    print(f"Sender Balance: {balance_eth} ETH")

    # Calculate maximum value to send to ensure the transaction fits within the balance
    max_transaction_value = balance_eth - web3.from_wei(gas_price * gas_limit, 'ether')
    print(f"Max Transaction Value: {max_transaction_value} ETH")

    # Ensure we don't attempt to send more than we can afford
    value = web3.to_wei(transactionData.amount, 'ether')  # Set the value to the amount specified

    if web3.from_wei(value, 'ether') > max_transaction_value:
        raise ValueError(f"Insufficient funds to send {web3.from_wei(value, 'ether')} ETH after accounting for gas fees")

    nonce = web3.eth.get_transaction_count(transactionData.from_account, 'pending')
    print(f"Using nonce: {nonce}")

    # Construct the transaction
    transaction = {
        'to': transactionData.to_account,
        'value': value,
        'gas': gas_limit,
        'gasPrice': gas_price,
        'nonce': nonce,
        'chainId': 11155111  # Sepolia chain ID
    }

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(transaction, transactionData.from_account_private_key)
    print(f"Signed Transaction: {signed_txn.rawTransaction.hex()}")

    # Send the transaction
    txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print(f'Transaction sent with hash: {web3.to_hex(txn_hash)}')

    # Get transaction details
    txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    print(f'Transaction receipt: {txn_receipt}')

    return txn_receipt

# txn_reciept = receive_funds_transaction(to_account_test_address, from_account_address, from_account_private_key)
# print(txn_reciept)

# balance = check_account_balance(from_account_address)
# print(f'Balance of {from_account_address}: {balance} ETH')