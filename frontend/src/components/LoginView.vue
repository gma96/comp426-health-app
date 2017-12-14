<template>
  <v-container fluid id="login" fill-height>
    <v-layout>
      <v-flex xs12 sm6 style="margin:auto;" center vertical-center>

        <v-card style="min-height:400px" class="layout center justify-center flex column fill-height pt-0">
	        	<v-progress-linear color="pink" class="processing-el" v-show="processing" v-bind:indeterminate="true"></v-progress-linear>
		          <v-card-title primary-title>
		          	<div>
			            <div class="body-2 mb-0"><v-icon color="gradient-c">favorite</v-icon> MyHealth</div>
			            <h3 class="display-1 mb-0">Sign in</h3>
			            <p>to continue to MyHealth</p>
			           </div>
		          </v-card-title>
		          <v-card-text>

		            <v-form v-model="valid">
		                <v-text-field
		                  label="Enter your email"
		                  v-model="email"
		                  :rules="emailRules"
		                  required
		                ></v-text-field>
		                <v-text-field
				              label="Enter your password"
				              hint="At least 8 characters"
				              min="8"
				              v-model="password"
				              :append-icon="showPassword ?  'visibility' : 'visibility_off'"
				              :append-icon-cb="() => (showPassword = !showPassword)"
				              v-bind:rules="passwordRules"
				              required
				              :error="isBadLogin"
				              :type="showPassword ? 'text' : 'password'"
				            ></v-text-field>
		            </v-form>
		            
		          </v-card-text>
		          <v-card-actions>
		          	<v-btn flat color="primary" to="/signup">Create account</v-btn>
		          	<v-layout flex row justify-end>
			             <v-btn @click="requestLogin" color="pink" :disabled="!valid">Next</v-btn>
			          </v-layout>
		          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
</template>
<style>
.application.login,
.application.signup {
  background: #4776e6; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #4776e6, #8e54e9); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #4776e6, #8e54e9);
}
</style>
<style>
.gradient-c--text {
  color: #4776e6!important; /* fallback for old browsers */
  color: -webkit-linear-gradient(to right, #4776e6, #8e54e9); /* Chrome 10-25, Safari 5.1-6 */
  color: linear-gradient(to right, #4776e6, #8e54e9);
}
.processing-el {
	margin-top: -7px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
</style>

<script>
export default {
  data() {
    return {
      valid: false,
      processing: false,
      showPassword: false,
      password: '',
      passwordRules: [
        (v) => {if(this.isBadLogin)
        {
          this.isBadLogin = false;
          return 'The email and password you entered don\'t match';
        } else return !!v || 'Password is required'},
      ],
      isBadLogin: false, 
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
      ]
    }
  },
  methods: {
  	requestLogin: function() {
  		this.isBadLogin = false;
  		this.processing = true;
  		Rest.routes.user.login({
  			data: {
  				email: this.email,
  				password: this.password,
  			}
  		})
  		.then((res) => {
  			this.processing = false;
  			let data = res.data.data;
  			let token = data[0].token;
  			Rest.setToken(token);
  			Auth.store(token)
  			this.$router.push('/');
  		})
  		.catch((e) => {
  			this.isBadLogin = true;
  			this.processing = false;
  		});
  	},
  },
}
</script>