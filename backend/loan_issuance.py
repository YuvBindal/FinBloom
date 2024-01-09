from xrpl.account import get_balance
from xrpl.clients import JsonRpcClient
from xrpl.models import Payment, SetRegularKey
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet
from pprint import pprint
from xrpl.models.transactions import Payment, Memo
import json  # To convert the repayment schedule dictionary to a string
import requests

print("running")

JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)
wallet1 = generate_faucet_wallet(client, debug=True)
wallet2 = generate_faucet_wallet(client, debug=True)
# Define your repayment schedule dictionary
sample_repayment_schedule = {
    "Effective_Interest_Rate": 0.1,
    "Principal_Amount_SGD": 10000,
    "Loan_Maturity_Years": 5,
    "Total_Loan_Amount_SGD": 16105.1,
    "Installments_Per_Year": 12,
    "Installment_Amount": 268.42
}

print("running")

# on the testnet client


def generate_loan_transaction(client, wallet1, wallet2, repayment_schedule, loan_amount, currency):

    transaction_amt_in_xrp = convert_to_xrp(loan_amount, currency)
    transaction_amount_in_drops = int(transaction_amt_in_xrp*1000000)

    regular_key_wallet = generate_faucet_wallet(client, debug=True)

    print("Balances before payment:")
    print(get_balance(wallet1.classic_address, client))
    print(get_balance(wallet2.classic_address, client))

    tx = SetRegularKey(account=wallet1.address,
                       regular_key=regular_key_wallet.address)

    set_regular_key_response = submit_and_wait(tx, client, wallet1)

    print("Response for successful SetRegularKey tx:")
    print(set_regular_key_response)

    # Convert the repayment schedule dictionary to a string
    repayment_schedule_str = json.dumps(repayment_schedule)
    repayment_schedule_bytes = repayment_schedule_str.encode("utf-8")
    repayment_schedule_hex = repayment_schedule_bytes.hex()

    # Create a Memo object to embed the repayment schedule
    memo = Memo(memo_data=repayment_schedule_hex)

    # Create the Payment transaction with the Memo
    payment = Payment(
        account=wallet1.address,
        destination=wallet2.address,
        amount=str(transaction_amount_in_drops),
        memos=[memo]  # Include the memo in the Payment transaction
    )

    # Now, submit the transaction as you were doing previously
    payment_response = submit_and_wait(payment, client, regular_key_wallet)

    print("Response for tx signed using Regular Key:")
    pprint(payment_response)
    print(type(payment_response))

    # Balance after sending 1000 from wallet1 to wallet2
    print("Balances after payment:")
    print(get_balance(wallet1.address, client))
    print(get_balance(wallet2.address, client))

    hex_data = payment_response.result['Memos'][0]['Memo']['MemoData']

    # Convert the hexadecimal string to bytes
    data_bytes = bytes.fromhex(hex_data)

    # Decode the bytes back to a string
    decoded_string = data_bytes.decode("utf-8")

    print(decoded_string)  # Decoded repayment_schemes
    # Transaction ID


def convert_to_xrp(amount, currency):
    # Fetching data from CoinGecko API
    url = f'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies={currency.lower()}'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if 'ripple' in data and currency.lower() in data['ripple']:
            xrp_rate = data['ripple'][currency.lower()]
            xrp_amount = amount / xrp_rate
            return xrp_amount
        else:
            return "Couldn't fetch XRP rate for the specified currency."
    else:
        return "Failed to fetch data from CoinGecko API."


loan_amount = 1000  # Replace with your amount
currency = 'SGD'  # Replace with your currency code

generate_loan_transaction(client, wallet1, wallet2,
                          sample_repayment_schedule, loan_amount, currency)
