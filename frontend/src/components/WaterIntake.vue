<template>
  <v-layout row flex>
    <v-flex xs12 sm10 offset-sm1 md10 lg10>
      <v-card>
      <v-progress-linear color="pink" class="processing-el" v-show="loadingUserInfo" v-bind:indeterminate="true"></v-progress-linear>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Water Intake Entries</h3>
          </div>
        </v-card-title>

        <v-card-text class="text-center" v-show="loadingUserInfo">
          <p class="title">We're retrieving your info...</p>
        </v-card-text>

        <v-card-text class="text-center" v-show="items.length == 0 && !loadingUserInfo">
          <p class="title">looks like you haven't drank any water yet...</p>
        </v-card-text>

        <v-list two-line v-show="items.length > 0">
          <template v-for="item in items">
            <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
            <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
            <v-list-tile avatar v-else v-bind:key="item.title" @click="" class="height-auto">
              <v-list-tile-content>
                <v-layout flex row wrap class="w-100 align-center">
                  <v-flex xs12 sm10>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                    <v-list-tile-action-text v-html="item.notes"></v-list-tile-action-text>
                  </v-flex>
                  
                  <v-flex xs12 sm2 p0 class="text-right">
                    <v-btn flat icon color="grey darken-1" @click="deleteWater(item._id)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>

                  <!-- <v-flex xs12 sm3 p0>
                    <v-btn flat icon color="red">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex> -->
                </v-layout>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>

    <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
    <v-icon>add</v-icon>
  </v-btn>
<v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create Water Intake Entry
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <!-- date_picker -->
              <v-flex xs12>
                <v-dialog
                  persistent
                  v-model="modal"
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Date"
                    v-model="entryDate"
                    append-icon="event"
                    readonly
                    required
                  ></v-text-field>
                  <v-date-picker v-model="entryDate" scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-dialog>
            </v-flex>
            <!-- /date_picker -->
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs9>
                  <v-slider label="Water Intake" color="primary" v-model="value" thumb-label ticks min="0" v-bind:max="unit == 'metric' ? 4000 : 4000/29.57"></v-slider>
                </v-flex>
                <v-flex xs3>
                  <v-text-field v-model="value" type="number"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
           </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="saveWater">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-layout row justify-center>
      <v-dialog v-model="updateDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ updateTitle }}</v-card-title>
          <div v-show="updating" style="text-align: center;">
            <v-progress-circular indeterminate  v-bind:size="50" color="primary"></v-progress-circular>
            <p class="title">Processing...</p>
          </div>
          <v-card-text v-if="updateStatusMessage" v-show="!updating">{{ updateStatusMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray darken-1" v-show="updateShowCancel" flat="flat" @click.native="updateDialog = false">{{updateShowCancelText}}</v-btn>
            <v-btn color="primary darken-1" flat="flat" @click.native="updateDialog = false; updateConfirm()">{{updateButton}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>
</template>
<script>
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
export default {
  mounted() {
    this.updateWater();
    this.unit = Auth.decode().unit;
  },
  methods: {
    saveWater: function() {
      this.dialog = false;
      let _self = this;
      
      let data = {
        entry_date: this.form.entryDate,
        value: this.form.value,
      }
      
      Rest.routes.water.create({
        data: data
      }).then((res) => {
        if (res.status == 201) {
          _self.updateWater();
        }
      }).catch((e) => {
        if(e.response.status == 401) Auth.logout();
        console.log(e.response)
        let data = e.response.data;
        if (data.errors[0].type == 'ResourceExistsError'){
          _self.updateDialog = true;
          _self.updateShowCancel = false;
          _self.updating = false;
          _self.updateTitle = data.errors[0].message;
          _self.updateStatusMessage = 'Water Intake resource exists';
          _self.updateConfirm = function() {return false};
        } else {
          let data = e.response.data;
          _self.updateDialog = true;
          _self.updateShowCancel = false;
          _self.updating = false;
          _self.updateTitle = 'Resource Error';
          _self.updateStatusMessage = data.errors[0].message;
          _self.updateConfirm = function() {return false};
        }
      });
    },
    deleteWater: function(_id) {
      this.updateDialog = true;
      this.updateTitle = 'Delete Water Intake Entry';
      this.updateStatusMessage = 'Are you sure you want to delete?';
      this.updateShowCancel = true;
      let _self = this;
      this.updateConfirm = function() {
        _self.updating = true;
        _self.updateStatusMessage = 'Working on delete';
        Rest.routes.water.delete({
          params:{_id: _id}
        }).then(function(m) {
          console.log(m)
          _self.updateWater();
          _self.updateDialog = false;
        })
        .catch(function(e) {
          console.log(e)
          if (e.status == 401) Auth.logout();
          let data = e.response.data;
          _self.updateDialog = true;
          _self.updateShowCancel = false;
          _self.updating = false;
          _self.updateTitle = 'Resource Error';
          _self.updateStatusMessage = data.errors[0].message;
          _self.updateConfirm = function() {return false};
        });
      }
    },
    updateWater: function() {
      let _self = this;
      self.loadingUserInfo = true;
      Rest.routes.water.list({
        query: {
          sort_directions: 'desc',
        }
      }).then((res) => {
        let data = res.data.data;
        data = data.map((item) => {
          let d = new Date(item.entry_date);
          return {
            _id: item._id,
            title: `On ${days[d.getUTCDay()]} ${month[d.getUTCMonth()]} ${d.getUTCDate()}`,
            subtitle: `You drank ${item.value} ${{metric: 'milliliters',imperial: 'fl-oz'}[Auth.decode().unit]}`,
          }
        });
        _self.items = data;
      }).catch((e) => {
        console.log(e)
        self.loadingUserInfo = false;
        let data = e.response.data;
        _self.updateDialog = true;
        _self.updateShowCancel = false;
        _self.updating = false;
        _self.updateTitle = 'Resource Error';
        _self.updateStatusMessage = data.errors[0].message;
        _self.updateConfirm = function() {return false};
      });
    },
    resetForm () {
      this.errorMessages = []
      this.formHasErrors = false

      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset()
      })
    },
  },
  data() {
    return {
      dialog: false,
      loadingUserInfo: false,
      menuEntryDate: false,
      entryDate: null,
      value: null,
      modal: false,
      unit: 1,
      items: [],
      updateTitle: '',
      updateStatusMessage: '',
      updating: false,
      updateShowCancel: false,
      updateShowCancelText: 'Cancel',
      updateDialog: false,
      updateButton: 'Okay',
      updateConfirm: false,
    }
  },
  computed: {
    form () {
      return {
        entryDate: this.entryDate,
        value: this.value,
      }
    }
  },
}
</script>