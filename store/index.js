export const state = () => ({
    items: []
})
  
export const mutations = {
    setItems(state, items){
        state.items = items
    }
}

export const actions = {
    async fetch({commit}){
        const items = await this.$axios.$get( process.env.BACKEND_URL + '/products')
        commit('setItems', items)
    }
}

export const getters = {
    items: s => s.items
}