<template>
    <div>
      <ProductCard 
        v-for="pizza of this.$store.getters.items"
        v-bind:key="pizza.id"
        v-bind:pizza="pizza"
      />
    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard'
export default {
  async fetch({store}){
    if(store.getters.items.length === 0){
      await store.dispatch('fetch')
    }
  },
  components: {
    ProductCard
  }
}
</script>
