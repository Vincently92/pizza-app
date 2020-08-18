export const state = () => ({
    currency: "",
    currencyDefault: "usd",
    currencies: ["usd", "eur"],
    currenciesSymbol: {usd: "$", eur: "€"}
})
  
export const mutations = {
    setCartFromStorage(state) {
        state.cart = JSON.parse(localStorage.getItem('cart')) || {}
    },
    setCurrencyFromStorage(state){
        state.currency = localStorage.getItem('currency') || state.currencyDefault
    },
    changeCurrency(state, currency){
        state.currency = currency
        localStorage.setItem('currency', state.currency)
    }
}

export const actions = {
    
}

export const getters = {
    currency: s => s.currency,
    currencies: s => s.currencies,
    currenciesSymbol: s => s.currenciesSymbol
}