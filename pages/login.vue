<template>
  <v-container>
    <v-row>
      <v-col lg="4" md="9" sm="12" class="mx-auto">

        <v-form ref="form" v-model="valid" lazy-validation v-if="!successLogin">

          <v-text-field v-model="email" :rules="[rules.emailValid, rules.required]" label="E-mail" type="email" required></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="passwordShow ? 'text' : 'password'"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>

          <v-btn :disabled="!valid" color="success" class="mr-4" @click="login" :loading="loading">
            Submit
          </v-btn>

        </v-form>

        <div v-else class="text-h5">You are successfully logged in</div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
    mapMutations
  } from 'vuex'
export default {
  data: () => ({
    valid: true,
    successLogin: false,
    loading: false,
    password: '',
    passwordShow: false,
    email: '',
    rules: {
      required: value => !!value || 'Required.',
      emailValid: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    },
  }),

  methods: {
     ...mapMutations({
        saveUser: 'user/saveUser',
        saveAccessToken: 'user/saveAccessToken'
    }),
    async login() {
      if(!this.$refs.form.validate()) return false
      this.loading = true
      await this.$axios.$post( process.env.BACKEND_URL + '/login', {
          email: this.email,
          password: this.password
        })
        .then(response => {
            this.successLogin = true
            if(response.accessToken){
                this.saveUser({'email': this.email})
                this.saveAccessToken(response.accessToken)
            }
        })
        .catch(response => {
          alert('Invalid credentials')
          this.loading = false
          return false;
        })
    }
  },
}
</script>