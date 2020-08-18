<template>
  <v-card max-width="344" max-height="460px" class="float-left ma-4 py-2 px-2" elevation=4>

    <v-img class="ml-4 " :src="pizza.image"></v-img>

    <v-card-title>
      {{pizza.name}}
    </v-card-title>

    <v-card-subtitle style="max-height:3em;overflow:hidden;">
      {{pizza.description}}
    </v-card-subtitle>

    <v-card-actions>
      <div class="text-h5 px-2">
        {{ pizza.price[this.$store.getters['currency/currency']] }}
        {{this.$store.getters['currency/currenciesSymbol'][this.$store.getters['currency/currency']]}}
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-btn-toggle v-if="this.$store.getters['cart/cart'][pizza.id]" dense multiple>
          <v-btn @click="decrease(pizza)" style="min-width:40px">-</v-btn>
          <v-btn outlined color="red" class="px-2" to="/cart">
            {{this.$store.getters['cart/cart'][pizza.id].quantity}} in cart
          </v-btn>
          <v-btn @click="increase(pizza)" style="min-width:40px">+</v-btn>
        </v-btn-toggle>
        <v-btn v-else outlined color="red" @click="add(pizza)">
          Add to cart
        </v-btn>
      </div>
    </v-card-actions>

  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props:{
    pizza:{
      type: Object
    }
  },
  methods:{
    ...mapMutations({
        decrease: 'cart/decrease',
        increase: 'cart/increase',
        add: 'cart/add'
    })
  }
}
</script>