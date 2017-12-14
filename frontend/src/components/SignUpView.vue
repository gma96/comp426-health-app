<template>
  <v-container fluid id="login" fill-height>
    <v-layout>
      <v-flex xs12 sm6 style="margin:auto;" center vertical-center>

        <v-card style="min-height:400px" class="layout center justify-center flex column fill-height pt-0">
	        	<v-progress-linear color="pink" class="processing-el" v-show="processing" v-bind:indeterminate="true"></v-progress-linear>
		          <v-card-title primary-title>
		          	<div>
			            <div class="body-2 mb-0"><v-icon color="gradient-c">favorite</v-icon> MyHealth</div>
			            <h3 class="display-1 mb-0">Sign up</h3>
			            <p>to continue to MyHealth</p>
			           </div>
		          </v-card-title>
		          <v-card-text>

		            <v-form v-model="valid">
                  <v-text-field
                    label="First Name"
                    v-model="first_name"
                    required
                    ref="first_name"
                    :rules="[() => !!first_name || 'This field is required']"
                    :error-messages="errorMessages"
                  ></v-text-field>
                  <v-text-field
                    label="Last Name"
                    v-model="last_name"
                    required
                    ref="last_name"
                    :rules="[() => !!last_name || 'This field is required']"
                    :error-messages="errorMessages"
                  ></v-text-field>
		                <v-text-field
		                  label="Enter your email"
		                  v-model="email"
		                  :rules="emailRules"
		                  required
		                ></v-text-field>
		                <v-text-field
				              label="Enter your desired password"
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
                     <v-dialog
                        persistent
                        v-model="modal"
                        lazy
                        full-width
                        width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          label="Birthday"
                          v-model="birthdate"
                          :rules="[() => !!birthdate || 'This field is required']"
                          readonly
                          required
                          ref="birthdate"
                        ></v-text-field>
                        <v-date-picker v-model="birthdate" scrollable actions>
                          <template slot-scope="{ save, cancel }">
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                              <v-btn flat color="primary" @click="save">OK</v-btn>
                            </v-card-actions>
                          </template>
                        </v-date-picker>
                      </v-dialog>
                      <v-select
                        autocomplete
                        label="Unit"
                        placeholder="Select..."
                        :rules="[() => !!unit || 'This field is required']"
                        :items="units"
                        v-model="unit"
                        ref="unit"
                        required
                      ></v-select>
                       <v-slider
                        color="orange"
                        label="Height"
                        hint="Be honest"
                        :min="unit == metric ? 91 : 36"
                        :max="unit == metric ? 244 : 96"
                        thumb-label
                        v-model="height"
                        :rules="heightRules"
                      ></v-slider>
		            </v-form>
		            
		          </v-card-text>
		          <v-card-actions>
		          	<v-btn flat color="primary" to="/login">I have an account</v-btn>
		          	<v-layout flex row justify-end>
			             <v-btn @click="requestLogin" color="pink" :disabled="!valid">Next</v-btn>
			          </v-layout>
		          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
</template>

<script>
export default {
  data() {
    return {
      e1: 0,
      valid: false,
      processing: false,
      showPassword: false,
      units: ['metric', 'imperial'],
      errorMessages: [],
      first_name: null,
      last_name: null,
      birthdate: null,
      height: null,
      unit: 'imperial',
      password: '',
      passwordRules: [
        (v) => (this.isBadLogin ? 'An account already exists' : !!v || 'Password is required'),
      ],
      isBadLogin: false, 
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      heightRules: [
        val => val < 10 || `I don't believe you!`
      ],
    }
  },
  methods: {
  	requestLogin: function() {
  		this.isBadLogin = false;
  		this.processing = true;
  		Rest.routes.user.create({
  			data: {
          first_name: this.first_name,
          last_name: this.last_name,
  				email: this.email,
  				password: this.password,
          birthdate: this.birthdate,
          height: this.height,
          unit: this.unit,
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