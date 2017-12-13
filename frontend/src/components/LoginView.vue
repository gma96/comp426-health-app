<template>
  <v-container fluid id="login" fill-height>
    <v-layout>
      <v-flex xs12 sm9 style="margin:auto" center vertical-center>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Login to <v-icon color="gradient-c">favorite</v-icon> MyHealth</h3>
          </v-card-title>
          <v-card-text>
            
              <v-layout column>
                <v-flex>
                  <v-text-field
                    name="email"
                    label="Your email"
                    id="email-input"
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field
                    name="password"
                    label="Your password"
                    id="password-input"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="pink">login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
</template>
<style lang="css">
#app {
  background: #4776e6; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #4776e6, #8e54e9); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #4776e6, #8e54e9);
}
</style>
<style scoped lang="css">
.gradient-c--text {
  color: #4776e6; /* fallback for old browsers */
  color: -webkit-linear-gradient(to right, #4776e6, #8e54e9); /* Chrome 10-25, Safari 5.1-6 */
  color: linear-gradient(to right, #4776e6, #8e54e9);
}
</style>
<script>
  export default {
    $validates: true,
    data () {
      return {
        name: '',
        email: '',
        select: null,
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4'
        ],
        checkbox: null
      }
    },
    methods: {
      submit () {
        this.$validator.validateAll()
      },
      clear () {
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = null
        this.$validator.clean()
      }
    }

  }
</script>