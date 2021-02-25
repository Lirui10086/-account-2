import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Dialog,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { withTheme } from '@material-ui/core/styles';

import { formatCurrency, formatAddress, formatCurrencyWithSymbol, formatCurrencySmall } from '../../utils'

import classes from './swap.module.css'

import stores from '../../stores'
import {
  SWAP_UPDATED,
  ERROR,
  CONNECT_WALLET,
  ACCOUNT_CHANGED,
  CHANGE_NETWORK,
  NETWORK_CHANGED,
  CONFIGURE_NETWORK,
} from '../../stores/constants'
import BigNumber from 'bignumber.js'


function Setup({ theme, handleNext, swapState }) {
  const storeSwapAssets = stores.swapStore.getStore('swapAssets')
  const storeAccount = stores.accountStore.getStore('account')

  const [ account, setAccount ] = useState(storeAccount)
  const [ metaMaskChainID, setMetaMaskChainID ] = useState(stores.accountStore.getStore('chainID'))
  const [ chain, setChain ] = useState(stores.accountStore.getStore('selectedChainID'))

  const [ loading, setLoading ] = useState(false)

  const [ fromAmountValue, setFromAmountValue ] = useState(swapState ? swapState.fromAmountValue : '')
  const [ fromAmountError, setFromAmountError ] = useState(false)
  const [ fromAddressValue, setFromAddressValue ] = useState(swapState ? swapState.fromAddressValue : '')
  const [ fromAddressError, setFromAddressError ] = useState(false)
  const [ fromAssetValue, setFromAssetValue ] = useState(swapState ? swapState.fromAssetValue : null)
  const [ fromAssetError, setFromAssetError ] = useState(false)
  const [ fromAssetOptions, setFromAssetOptions ] = useState(storeSwapAssets)

  const [ toAmountValue, setToAmountValue ] = useState(swapState ? swapState.toAmountValue : '')
  const [ toAmountError, setToAmountError ] = useState(false)
  const [ toAddressValue, setToAddressValue ] = useState(swapState ? swapState.toAddressValue : '')
  const [ toAddressError, setToAddressError ] = useState(false)
  const [ toAssetValue, setToAssetValue ] = useState(swapState ? swapState.toAssetValue : null)
  const [ toAssetError, setToAssetError ] = useState(false)
  const [ toAssetOptions, setToAssetOptions ] = useState([])

  useEffect(function() {
    setAccount(storeAccount)
  }, [storeAccount])

  useEffect(function() {
    if(storeSwapAssets && storeSwapAssets.length > 0) {
      let index = 0

      setFromAssetOptions(storeSwapAssets)
      if(!fromAssetValue) {
        setFromAssetValue(storeSwapAssets[index])
        stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(storeSwapAssets[index].chainID)) {
        setFromAddressValue(account ? account.address : '')
      }

      const targetOption = storeSwapAssets.filter((asset) => {
        return storeSwapAssets[index].targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      if(!toAssetValue) {
        setToAssetValue(targetOption[0])
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      }
    }
  }, [storeSwapAssets])

  useEffect(function() {
    const swapUpdated = () => {
      const storeSwapAssets = stores.swapStore.getStore('swapAssets')
      let index = 0

      setFromAssetOptions(storeSwapAssets)
      if(!fromAssetValue) {
        setFromAssetValue(storeSwapAssets[index])
        stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: storeSwapAssets[index].chainID } } })
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(storeSwapAssets[index].chainID)) {
        setFromAddressValue(account ? account.address : '')
      }

      setChain(storeSwapAssets[index].chainID)

      const targetOption = storeSwapAssets.filter((asset) => {
        return storeSwapAssets[index].targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      if(!toAssetValue) {
        setToAssetValue(targetOption[0])
      }

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      }
    }

    const errorReturned = () => {
      setLoading(false)
    }

    const accountChanged = () => {
      setAccount(stores.accountStore.getStore('account'))
    }

    const networkChanged = () => {
      setChain(stores.accountStore.getStore('selectedChainID'))
      setMetaMaskChainID(stores.accountStore.getStore('chainID'))
    }

    stores.emitter.on(SWAP_UPDATED, swapUpdated)
    stores.emitter.on(ERROR, errorReturned)
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(NETWORK_CHANGED, networkChanged)

    return () => {
      stores.emitter.removeListener(SWAP_UPDATED, swapUpdated)
      stores.emitter.removeListener(ERROR, errorReturned)
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(NETWORK_CHANGED, networkChanged)
    }
  },[]);

  const handleConnectWallet = () => {
    stores.emitter.emit(CONNECT_WALLET)
  }

  const handleConfigureNetwork = () => {
    stores.emitter.emit(CONFIGURE_NETWORK)
  }

  const onAssetSelect = (type, value) => {
    if(type === 'From') {
      setFromAssetValue(value)
      stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: value.chainID } } })

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(value.chainID)) {
        setFromAddressValue(account ? account.address : '')
      } else {
        setFromAddressValue('')
      }


      const targetOption = fromAssetOptions.filter((asset) => {
        return value.targets.map((as) => { return as.id }).includes(asset.id)
      })

      setToAssetOptions(targetOption)
      setToAssetValue(targetOption[0])

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
        setToAddressValue(account ? account.address : '')
      } else {
        setToAddressValue('')
      }



      calculateReceiveAmount(fromAmountValue, value, targetOption[0])
    } else {
      setToAssetValue(value)

      if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(value.chainID)) {
        setToAddressValue(account ? account.address : '')
      } else {
        setToAddressValue('')
      }



      calculateReceiveAmount(fromAmountValue, fromAssetValue, value)
    }
  }

  const fromAmountChanged = (event) => {
    setFromAmountValue(event.target.value)

    calculateReceiveAmount(event.target.value, fromAssetValue, toAssetValue)
  }

  const toAmountChanged = (event) => {
  }

  const fromAddressChanged = (event) => {
    setFromAddressValue(event.target.value)
  }

  const toAddressChanged = (event) => {
    setToAddressValue(event.target.value)
  }

  const calculateReceiveAmount = (amount, from, to) => {
    let receive = 0
    let fee = 0
    if(amount && amount !== '' && !isNaN(amount)) {
      fee = BigNumber(amount).times(from.swapFeeRate).toNumber()
      if(fee > from.maximumSwapFee) {
        fee = from.maximumSwapFee
      } else if (fee < from.minimumSwapFee) {
        fee = from.minimumSwapFee
      }

      receive = BigNumber(amount).minus(fee).toNumber()
      if(receive < 0) {
        receive = 0
      }
    }

    setToAmountValue(receive)
  }

  const onNext = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setFromAddressError(false)
    setToAssetError(false)
    setToAddressError(false)

    let error = false

    if(!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError(true)
      error = true
    } else {
      if(!fromAssetValue.tokenMetadata.balance || isNaN(fromAssetValue.tokenMetadata.balance) || BigNumber(fromAssetValue.tokenMetadata.balance).lte(0))  {
        setFromAmountError(true)
        error = true
      } else if(BigNumber(fromAmountValue).lt(0)) {
        setFromAmountError(true)
        error = true
      } else if(fromAssetValue && BigNumber(fromAmountValue).lt(fromAssetValue.minimumSwap)) {
        setFromAmountError(true)
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.maximumSwap)) {
        setFromAmountError(true)
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.tokenMetadata.balance)) {
        setFromAmountError(true)
        error = true
      }
    }

    if(!fromAssetValue || fromAssetValue === null) {
      setFromAssetError(true)
      error = true
    }

    if(!toAssetValue || toAssetValue === null) {
      setToAssetError(true)
      error = true
    }

    if(!toAddressValue || toAddressValue === '') {
      setToAddressError(true)
      error = true
    } else {
      //check receving address validation somehow
    }

    if(!fromAddressValue || fromAddressValue === '') {
      setFromAddressError(true)
      error = true
    } else {
      //check receving address validation somehow
    }

    if(!error) {
      setLoading(true)
      handleNext({
        fromAmountValue: fromAmountValue,
        fromAssetValue: fromAssetValue,
        fromAddressValue: fromAddressValue,
        toAmountValue: toAmountValue,
        toAssetValue: toAssetValue,
        toAddressValue: toAddressValue,
      }) // probably need to pass values to main container
    }
  }

  const setBalance100 = () => {
    setFromAmountValue(fromAssetValue.tokenMetadata.balance)

    calculateReceiveAmount(fromAssetValue.tokenMetadata.balance, fromAssetValue, toAssetValue)
  }

  const swapAssets = () => {

    setFromAssetValue(toAssetValue)
    stores.dispatcher.dispatch({ type: CHANGE_NETWORK, content: { network: { chainID: toAssetValue.chainID } } })

    if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(toAssetValue.chainID)) {
      setFromAddressValue(account ? account.address : '')
    } else {
      setFromAddressValue('')
    }


    const targetOption = fromAssetOptions.filter((asset) => {
      return toAssetValue.targets.map((as) => { return as.id }).includes(asset.id)
    })

    setToAssetOptions(targetOption)
    setToAssetValue(fromAssetValue)

    if(!['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(targetOption[0].chainID)) {
      setToAddressValue(account ? account.address : '')
    } else {
      setToAddressValue('')
    }

    calculateReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, addressValue, addressError, addressChanged, assetValue, assetError, assetOptions, onAssetSelect) => {
    const isDark = theme.palette.type === 'dark'

    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainer }>
          <div className={ classes.inputTitle }>
            <Typography variant='h5' noWrap className={ classes.inputTitleWithIcon }>{ type }</Typography>
          </div>
          <div className={ classes.inputBalance }>
            <Typography variant='h5' noWrap onClick={ () => {
              if(type === 'From') {
                setBalance100()
              }
            }}>
              { (assetValue && assetValue.tokenMetadata.balance) ?
                formatCurrency(assetValue.tokenMetadata.balance) + ' ' + assetValue.tokenMetadata.symbol :
                ''
              }
            </Typography>
          </div>
        </div>
        <div className={ `${classes.massiveInputContainer} ${ !isDark && classes.whiteBackground } ${ (amountError || assetError) && classes.error }` }>
          <div className={ classes.massiveInputAssetSelect }>
            <AssetSelect type={type} value={ assetValue } assetOptions={ assetOptions } onSelect={ onAssetSelect } />
          </div>
          <div className={ classes.massiveInputAmount }>
            <TextField
              placeholder='0.00'
              fullWidth
              error={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ loading || type === 'To' }
              InputProps={{
                className: classes.largeInput
              }}
            />
          </div>
          <div className={ classes.massiveInputAddress }>
            <TextField
              fullWidth
              placeholder={ `${type} address` }
              error={ addressError }
              value={ addressValue }
              onChange={ addressChanged }
              disabled={ !['BTC', 'LTC', 'BLOCK',  'ANY' ].includes(assetValue ? assetValue.chainID : '') }
              InputProps={{
                className: classes.addressInput
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={ classes.swapInputs }>
      { renderMassiveInput('From', fromAmountValue, fromAmountError, fromAmountChanged, fromAddressValue, fromAddressError, fromAddressChanged, fromAssetValue, fromAssetError, fromAssetOptions, onAssetSelect) }
      <div className={ classes.swapIconContainer }>
        <SwapVertIcon className={ classes.swapIcon } onClick={ swapAssets }/>
      </div>
      { renderMassiveInput('To', toAmountValue, toAmountError, toAmountChanged, toAddressValue, toAddressError, toAddressChanged, toAssetValue, toAssetError, toAssetOptions, onAssetSelect) }
      {
        (!account || !account.address) && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ handleConnectWallet }
            >
            <Typography variant='h5'>Connect Wallet</Typography>
          </Button>
        )
      }
      {
        (account && account.address && chain === metaMaskChainID) && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ onNext }
            disabled={ loading }
            >
            { loading && <CircularProgress size={20} /> }
            { !loading && <Typography variant='h5'>{ 'Transfer' }</Typography>}
          </Button>
        )
      }
      {
        account && account.address && chain !== metaMaskChainID && (
          <Button
            className={ classes.actionButton }
            size='large'
            fullWidth
            disableElevation
            variant='contained'
            color='primary'
            onClick={ handleConfigureNetwork }
            >
            <Typography variant='h5'>Connect to Network</Typography>
          </Button>
        )
      }
      <div className={ classes.swapInfo }>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary'>Max Swap Amount </Typography>
          <Typography>{ formatCurrencySmall(fromAssetValue ? fromAssetValue.maximumSwap : 0) } { fromAssetValue ? fromAssetValue.tokenMetadata.symbol : '' }</Typography>
        </div>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary'>Min Swap Amount</Typography>
          <Typography>{ formatCurrencySmall(fromAssetValue ? fromAssetValue.minimumSwap : 0) } { fromAssetValue ? fromAssetValue.tokenMetadata.symbol : '' }</Typography>
        </div>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary'>Swap Fee</Typography>
          <Typography>{ formatCurrencySmall(fromAssetValue ? (fromAssetValue.swapFeeRate*100) : 0) }%</Typography>
        </div>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary'>Max Fee Amount</Typography>
          <Typography>{ formatCurrencySmall(fromAssetValue ? fromAssetValue.maximumSwapFee : 0) } { fromAssetValue ? fromAssetValue.tokenMetadata.symbol : '' }</Typography>
        </div>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary'>Min Fee Amount</Typography>
          <Typography>{ formatCurrencySmall(fromAssetValue ? fromAssetValue.minimumSwapFee : 0) } { fromAssetValue ? fromAssetValue.tokenMetadata.symbol : '' }</Typography>
        </div>
        <div className={ classes.swapInfoRow }>
          <Typography color='textSecondary' className={ classes.flexy }>Deposits <Typography color={ 'textPrimary' } className={ classes.inlineText }>> {formatCurrencySmall(fromAssetValue ? fromAssetValue.bigValueThreshold : 0)} {(fromAssetValue && fromAssetValue.tokenMetadata) ? fromAssetValue.tokenMetadata.symbol : ''} </Typography> could take up to <Typography color='textPrimary' className={ classes.inlineText }> 12 hours</Typography></Typography>
        </div>
      </div>
    </div>
  )
}

function AssetSelect({ type, value, assetOptions, onSelect }) {

  const [ open, setOpen ] = useState(false);
  const [ search, setSearch ] = useState('')

  const openSearch = () => {
    setOpen(true)
    setSearch('')
  };

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (type, asset) => {
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    setOpen(false)
  }

  const renderAssetOption = (type, asset) => {
    return (
      <MenuItem val={ asset.id } key={ asset.id } className={ classes.assetSelectMenu } onClick={ () => { onLocalSelect(type, asset) } }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainerSmall }>
            <img
              className={ classes.displayAssetIconSmall }
              alt=""
              src={ asset ? asset.tokenMetadata.icon : '' }
              height='60px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIconSmall }
              alt=""
              src={ asset ? `/blockchains/${asset.icon}` : '' }
              height='30px'
              width='30px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
        <div className={ classes.assetSelectIconName }>
          <Typography variant='h5'>{ asset ? asset.tokenMetadata.symbol : '' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.tokenMetadata.description : '' }</Typography>
        </div>
        <div className={ classes.assetSelectBalance}>
          <Typography variant='h5'>{ (asset && asset.tokenMetadata.balance) ? formatCurrency(asset.tokenMetadata.balance) : '0.00' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ 'Balance' }</Typography>
        </div>
      </MenuItem>
    )
  }

  return (
    <React.Fragment>
      <div className={ classes.displaySelectContainer } onClick={ () => { openSearch() } }>
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainer }>
            <img
              className={ classes.displayAssetIcon }
              alt=""
              src={ value ? value.tokenMetadata.icon : '' }
              height='100px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <img
              className={ classes.displayChainIcon }
              alt=""
              src={ value ? `/blockchains/${value.icon}` : '' }
              height='40px'
              width='40px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
      </div>
      <Dialog onClose={ onClose } aria-labelledby="simple-dialog-title" open={ open } >
        <div className={ classes.searchContainer }>
          <TextField
            autoFocus
            variant="outlined"
            fullWidth
            placeholder="ETH, CRV, ..."
            value={ search }
            onChange={ onSearchChanged }
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>,
            }}
          />
          <div className={ classes.assetSearchResults }>
            {
              assetOptions ? assetOptions.filter((asset) => {
                if(search && search !== '') {
                  return asset.tokenMetadata.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.description.toLowerCase().includes(search.toLowerCase()) ||
                    asset.tokenMetadata.name.toLowerCase().includes(search.toLowerCase())
                } else {
                  return true
                }
              }).map((asset) => {
                return renderAssetOption(type, asset)
              }) : []
            }
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  )
}

export default withTheme(Setup)
