export const state = () => ({
    cart: {}
})
  
export const mutations = {
    add(state, item) {
        if(state.cart[item.id]){
            state.cart[item.id].quantity ++
        }else{
            let new_cart = state.cart
            new_cart[item.id] = {item: item, quantity: 1}
            state.cart = Object.assign({}, state.cart, new_cart)
        }
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    decrease(state, item){
        if(state.cart[item.id] && state.cart[item.id].quantity > 1){
            state.cart[item.id].quantity --
        }else{
            this._vm.$delete(state.cart, item.id)
        }
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    increase(state, item){
        if(state.cart[item.id]){
            state.cart[item.id].quantity ++
        }
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    empty(state){
        state.cart = {}
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    remove(state, item){
        this._vm.$delete(state.cart, item.id)
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    setCartFromStorage(state) {
        state.cart = JSON.parse(localStorage.getItem('cart')) || {}
    },
    calcTotal(state) {
        let delivery = parseFloat(Number(Object.keys(state.cart).reduce((sum, key) => sum + state.cart[key].quantity * 1 || 0, 0)).toFixed(2))
        let products = parseFloat(Number(Object.keys(state.cart).reduce((sum, key) => sum + state.cart[key].quantity * 1 || 0, 0)).toFixed(2))
        let total = parseFloat(products + delivery).toFixed(2)

        return {
          delivery: delivery,
          products: products,
          total: total
        }
    }
}

export const actions = {

}

export const getters = {
    cart: s => s.cart
}