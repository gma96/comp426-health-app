<template>
  <v-layout justify-center center row flex>
    <v-flex xs12 sm10 md10 lg10 offset-sm1>

      <v-card ref="form">
        <v-progress-linear color="pink" class="processing-el" v-show="loadingUserInfo" v-bind:indeterminate="true"></v-progress-linear>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Your Profile Settings</h3>
          </div>
        </v-card-title>

        <v-card-text class="text-center" v-show="loadingUserInfo">
          <p class="title">We're retrieving your info...</p>
        </v-card-text>

        <div v-show="!loadingUserInfo">
          <v-card-text>
            <v-text-field
              label="First Name"
              placeholder="John"
              v-model="first_name"
              required
              ref="first_name"
              :rules="[() => !!first_name || 'This field is required']"
              :error-messages="errorMessages"
            ></v-text-field>
            <v-text-field
              label="Last Name"
              placeholder="Doe"
              v-model="last_name"
              required
              ref="last_name"
              :rules="[() => !!last_name || 'This field is required']"
              :error-messages="errorMessages"
            ></v-text-field>
            <v-text-field
              label="Email address"
              placeholder="you@email.com"
              :rules="emailRules"
              v-model="email"
              hint="Enter your email!"
              ref="email"
              required
            ></v-text-field>
            <v-text-field
              label="Enter your desired password"
              hint="At least 8 characters"
              min="8"
              v-model="password"
              :append-icon="showPassword ?  'visibility' : 'visibility_off'"
              :append-icon-cb="() => (showPassword = !showPassword)"
              
              ref="password"
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
              :min="unit == 'metric' ? 91 : 36"
              :max="unit == 'metric' ? 244 : 96"
              thumb-label
              v-model="height"
              ref="height"
            ></v-slider>
          </v-card-text>
          <!-- <v-divider class="mt-5"></v-divider> -->
          <v-card-actions>
            <v-btn flat>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip
                left
                v-if="formHasErrors"
              >
                <v-btn
                  icon
                  @click="resetForm"
                  slot="activator"
                  class="my-0">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>Refresh form</span>
              </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn color="primary" flat @click="submit">Update</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
     <v-layout row justify-center>
      <v-dialog v-model="updateDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Update Status</v-card-title>
          <div v-show="updating" style="text-align: center;">
            <v-progress-circular indeterminate  v-bind:size="50" color="primary"></v-progress-circular>
            <p class="title">Processing update...</p>
          </div>
          <v-card-text v-if="updateStatusMessage">{{ updateStatusMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" flat="flat" @click.native="updateDialog = false">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>
</template>

<script>
const _round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};
  export default {
    data: () => ({
      units: ['metric', 'imperial'],
      errorMessages: [],
      first_name: null,
      last_name: null,
      email: null,
      birthdate: null,
      password: '',
      unit: null,
      height: null,
      formHasErrors: false,
      loadingUserInfo: false,
      history: null,
      modal: false,
      updateDialog: false,
      updateStatusMessage: '',
      updating: false,
      hasChanged: false,
      changingUnit: null,
      showPassword: false,
      emailRules: [
        v => {
          return !!v || 'Email is required'
        },
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
    }),
    mounted () {
      let _self = this;
      _self.loadingUserInfo = true;
      Rest.routes.user.profile()
      .then(function(res) {
        let data = res.data.data[0];
        _self.history = data;
        _self.history['password'] = '';
        _self.first_name = data.first_name;
        _self.last_name = data.last_name;
        _self.email = data.email;
        _self.birthdate = data.birthdate;
        _self.unit = data.unit;
        _self.height = data.height;
        _self.loadingUserInfo = false;
        _self.changingUnit = null;
      })
      .catch((e) => {
        if (e.status = 401) {
          Auth.logout();
        }
      })
    },
    computed: {
      form () {
        return {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          birthdate: this.birthdate,
          unit: this.unit,
          height: this.height,
          password: this.password,
        }
      }
    },

    watch: {
      name () {
        this.errorMessages = []
      },
      unit () {
        if (this.history.unit != this.unit && !this.formHasErrors) {
          let toM = 2.54;
          let h = this.height;
          let c = this.changingUnit ? this.changingUnit : this.history.unit;
          if (c != this.unit) {
            if (c == 'metric') h = this.height / toM;
            else h = this.height * toM;
          }
          this.height = _round(h, 0);
          this.changingUnit = this.unit;
        }; 
      }
    },

    methods: {
      addressCheck () {
        this.errorMessages = this.address && !this.name
          ? ['Hey! I\'m required']
          : []

        return true
      },
      resetForm () {
        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },
      submit () {
        let _self = this;
        this.formHasErrors = false
        console.log(this.form);
        console.log(this.history);
        let changed = {};
        Object.keys(this.form).forEach(f => {
//          if (!this.form[f]) this.formHasErrors = true
          this.$refs[f].validate(true);
          if (this.form[f] != this.history[f]) changed[f] = this.form[f];
        });
        if(!this.formHasErrors && Object.keys(changed).length > 0) {
          _self.updateDialog = true;
          _self.updating = true;
          Rest.routes.user.update({
            data: changed,
          })
          .then(function(res) {
            _self.updating = false;
            _self.updateStatusMessage = 'Update was a success!!';
            Object.keys(changed).forEach(f => {
              _self.history[f] = changed[f];
            });
            console.log(res.data.data[0].token);
            Auth.store(res.data.data[0].token);
            Rest.setToken(Auth.getToken());
            _self.changingUnit = null;
          })
          .catch(function(e) {
            _self.updating = false;
            _self.updateStatusMessage = e.message;
          });
        } else {
          _self.updateDialog = true;
          _self.updateStatusMessage = 'No changes were made';
        }
      }
    }
  }
</script>