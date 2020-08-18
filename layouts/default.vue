<template>
  <v-app>
    <v-app-bar app flat>
      <nuxt-link class="reset-a-style" to='/'>
        <v-toolbar-title>
          <v-icon x-large>mdi-pizza</v-icon><span class="hidden-xs-only">gogo pizza</span>
        </v-toolbar-title>
      </nuxt-link>

      <v-spacer></v-spacer>

      <v-btn-toggle v-model="currency" mandatory>
        <v-btn medium v-for="(cur, index) in this.$store.getters['currency/currencies']" :key="index" :value="cur">
          <v-icon>mdi-currency-{{cur}}</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-menu offset-y v-if="accessToken">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-btn icon class="mx-4">
            <v-icon v-bind="attrs" v-on="{ ...menu }">mdi-account-check</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <nuxt-link class="reset-a-style" to='/orders'>My orders</nuxt-link>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <a class="reset-a-style" @click="logout">Logout</a>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <nuxt-link v-else class="reset-a-style" to='/login'>
        <v-btn icon class="mx-4">
          <v-icon>mdi-account-arrow-right</v-icon>
        </v-btn>
      </nuxt-link>


      <v-badge :content="cartCount" :value="cartCount" color="green" overlap>
        <nuxt-link class="reset-a-style" to='/cart'>
          <v-btn outlined color="red">Cart</v-btn>
        </nuxt-link>
      </v-badge>

    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  mounted(){
    this.$store.commit('cart/setCartFromStorage')
    this.$store.commit('currency/setCurrencyFromStorage')
    this.$store.commit('user/getAccessTokenFromStorage')
  },
  methods:{
      ...mapActions({
        logout: 'user/logout'
      })
  },
  computed:{
    ...mapState('user', {
      accessToken: state => state.accessToken
    }),
    currency: {
      set(value){
          this.$store.commit('currency/changeCurrency', value)
      },
      get(){
        return this.$store.getters['currency/currency']
      }
    },
    cartCount() {
      return Object.keys(this.$store.getters['cart/cart']).reduce((sum,key)=>sum + this.$store.getters['cart/cart'][key].quantity||0, 0)
    }
  }
}
</script>

<style scoped>
  .reset-a-style{
    text-decoration: none;
    color:inherit;
  }
</style>
