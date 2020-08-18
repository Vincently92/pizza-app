export const state = () => ({
    accessToken: null,
    user: {}
})
  
export const mutations = {
    saveAccessToken(state, accessToken){
        state.accessToken = accessToken
        localStorage.setItem('accessToken', state.accessToken)
    },
    clearAccessToken(state){
        state.accessToken = null
        localStorage.removeItem('accessToken')
    },
    saveUser(state, user){
        state.user = user
        localStorage.setItem('user', JSON.stringify(user))
    },
    getUserFromStorage(state){
        state.user = JSON.parse(localStorage.getItem('user')) || {}
    },
    getEmail(state){
        state.email = localStorage.getItem('email')
    },
    getAccessTokenFromStorage(state){
        state.accessToken = localStorage.getItem('accessToken')
    }
}


export const actions = {
    logout(state){
        this.$axios.$post( process.env.BACKEND_URL + '/logout', [], {headers: {'Authorization': `Bearer ${state.getters.accessToken}`}})
        .then(response => {
            state.commit('clearAccessToken')
        })
    },
}

export const getters = {
    accessToken: s => s.accessToken,
    user: s => s.user,
}