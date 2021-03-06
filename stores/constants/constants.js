import BigNumber from 'bignumber.js'

// URLS
export const GAS_PRICE_API = 'https://gasprice.poa.network/'
export const ZAPPER_GAS_PRICE_API = 'https://api.zapper.fi/v1/gas-price?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241'
export const ETHERSCAN_URL = 'https://etherscan.io/'

// GENERAL
export const ERROR = 'ERROR'
export const STORE_UPDATED = 'STORE_UPDATED'
export const TX_SUBMITTED = 'TX_SUBMITTED'
export const TX_UPDATED = 'TX_UPDATED'
export const TX_HASH = 'TX_HASH'
export const TX_RECEIPT = 'TX_RECEIPT'
export const TX_CONFIRMED = 'TX_CONFIRMED'

export const CONNECTION_CONNECTED = 'CONNECTION_CONNECTED'
export const CONNECTION_DISCONNECTED = 'CONNECTION_DISCONNECTED'
export const CONNECT_WALLET = 'CONNECT_WALLET'
export const CONFIGURE_NETWORK = 'CONFIGURE_NETWORK'
export const CHANGE_NETWORK = 'CHANGE_NETWORK'
export const NETWORK_CHANGED = 'NETWORK_CHANGED'

export const CONFIGURE = 'CONFIGURE'
export const CONFIGURE_RETURNED = 'CONFIGURE_RETURNED'

export const CONFIGURE_SWAP = 'CONFIGURE_SWAP'
export const SWAP_CONFIGURED = 'SWAP_CONFIGURED'

export const GET_GAS_PRICES = 'GET_GAS_PRICES'
export const GAS_PRICES_RETURNED = 'GAS_PRICES_RETURNED'


// SWAP
export const SWAP_UPDATED = 'SWAP_UPDATED'

export const GET_SWAP_BALANCES = 'GET_SWAP_BALANCES'
export const SWAP_BALANCES_RETURNED = 'SWAP_BALANCES_RETURNED'

export const APPROVE_SWAP = 'APPROVE_SWAP'
export const APPROVE_SWAP_RETURNED = 'APPROVE_SWAP_RETURNED'

export const SWAP = 'SWAP'
export const SWAP_RETURNED = 'SWAP_RETURNED'

export const SWAP_GET_DEPOSIT_ADDRESS = 'SWAP_GET_DEPOSIT_ADDRESS'
export const SWAP_DEPOSIT_ADDRESS_RETURNED = 'SWAP_DEPOSIT_ADDRESS_RETURNED'

export const SWAP_CONFIRM_SWAP = 'SWAP_CONFIRM_SWAP'
export const SWAP_RETURN_DEPOSIT_ADDRESS = 'SWAP_RETURN_DEPOSIT_ADDRESS'
export const SWAP_RETURN_SWAP_PERFORMED = 'SWAP_RETURN_SWAP_PERFORMED'
export const SWAP_SHOW_TX_STATUS = 'SWAP_SHOW_TX_STATUS'
export const SWAP_DEPOSIT_TRANSACTION = 'SWAP_DEPOSIT_TRANSACTION'
export const SWAP_TRANSFER_TRANSACTION = 'SWAP_TRANSFER_TRANSACTION'
export const CLEARN_LISTENERS = 'CLEARN_LISTENERS'
export const SWAP_STATUS_TRANSACTIONS = 'SWAP_STATUS_TRANSACTIONS'

export const GET_SWAP_HISTORY = 'GET_SWAP_HISTORY'
export const SWAP_HISTORY_RETURNED = 'SWAP_HISTORY_RETURNED'

export const GET_BRIDGE_INFO = 'GET_BRIDGE_INFO'
export const BRIDGE_INFO_RETURNED = 'BRIDGE_INFO_RETURNED'

export const GET_SWAP_TOKENS = 'GET_SWAP_TOKENS'
export const SWAP_TOKENS_RETURNED = 'SWAP_TOKENS_RETURNED'

export const GET_EXPLORER = 'GET_EXPLORER'
export const EXPLORER_RETURNED = 'EXPLORER_RETURNED'

export const GET_ASSET_BALANCE = 'GET_ASSET_BALANCE'

// ACCOUNT
export const ACCOUNT_CONFIGURED = 'ACCOUNT_CONFIGURED'
export const ACCOUNT_CHANGED = 'ACCOUNT_CHANGED'


export const MAX_UINT256 = new BigNumber(2)
  .pow(256)
  .minus(1)
  .toFixed(0);
