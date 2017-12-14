<template>
  <v-layout row flex>
    <v-flex xs12 sm10 offset-sm1 md10 lg10>
      <v-card>
      <v-progress-linear color="pink" class="processing-el" v-show="loadingUserInfo" v-bind:indeterminate="true"></v-progress-linear>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Mindfulness Entries</h3>
          </div>
        </v-card-title>

        <v-card-text class="text-center" v-show="loadingUserInfo">
          <p class="title">We're retrieving your info...</p>
        </v-card-text>

        <v-card-text class="text-center" v-show="items.length == 0 && !loadingUserInfo">
          <p class="title">looks like you haven't been mindful yet...</p>
        </v-card-text>

        <v-list two-line v-show="items.length > 0">
          <template v-for="item in items">
            <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
            <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
            <v-list-tile avatar v-else v-bind:key="item._id" @click="" class="height-auto">
              <v-list-tile-content>
                <v-layout flex row wrap class="w-100 align-center">
                  <v-flex xs12 sm10>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                    <v-list-tile-action-text v-html="item.notes"></v-list-tile-action-text>
                  </v-flex>
                  
                  <v-flex xs12 sm2 p0 class="text-right">
                    <v-btn flat icon color="grey darken-1" @click="deleteMinfulness(item._id)">
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
      <v-card-title class="grey lighten-4 py-4 title">
        Create mindfulness entry
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap ref="form">

          <!-- /startDatePicker -->
          <v-flex xs11 sm6>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="menuStartDate"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
              
            >
              <v-text-field
                slot="activator"
                label="Start date"
                v-model="startDate"
                append-icon="event"
                v-bind:error-messages="e.startDate"
                readonly
                required
                :ref="startDate"
              ></v-text-field>
              <v-date-picker v-model="startDate" no-title scrollable actions>
                <template slot-scope="{ save, cancel }">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                    <v-btn flat color="primary" @click="save">OK</v-btn>
                  </v-card-actions>
                </template>
              </v-date-picker>
            </v-menu>
          </v-flex><!-- /startDatePicker -->

          <!-- startTimePicker -->
          <v-flex xs11 sm6>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="menuStartTime"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
            >
            <v-text-field
              slot="activator"
              label="Start time"
              v-model="startTime"
              append-icon="access_time"
              v-bind:error-messages="e.startTime"
              readonly
              required
              :ref="startTime"
            ></v-text-field>
            <v-time-picker v-model="startTime" autosave></v-time-picker>
          </v-menu>
        </v-flex><!-- /startTimePicker -->


        <!-- /endDatePicker -->
          <v-flex xs11 sm6>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="menuEndDate"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                label="End date"
                v-model="endDate"
                v-bind:error-messages="e.endDate"
                append-icon="event"
                readonly
                required
                :ref="endDate"
              ></v-text-field>
              <v-date-picker v-model="endDate" no-title scrollable actions>
                <template slot-scope="{ save, cancel }">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                    <v-btn flat color="primary" @click="save">OK</v-btn>
                  </v-card-actions>
                </template>
              </v-date-picker>
            </v-menu>
          </v-flex><!-- /startDatePicker -->

          <!-- endTimePicker -->
          <v-flex xs11 sm6>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="menuEndTime"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
            >
            <v-text-field
              slot="activator"
              label="End time"
              v-model="endTime"
              v-bind:error-messages="e.endTime"
              append-icon="access_time"
              readonly
              required
              :ref="endTime"
            ></v-text-field>
            <v-time-picker v-model="endTime" autosave></v-time-picker>
          </v-menu>
        </v-flex><!-- /endTimePicker -->


        <v-flex xs12>
          <v-text-field
            name="notes"
            label="Notes, things you may notice"
            textarea
            v-model="notes"
            :ref="notes"
          ></v-text-field>
        </v-flex>

      </v-layout><!-- /v-layout -->

      </v-container>
      <v-card-actions>
        <v-btn flat color="primary">More</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
        <v-btn flat @click="saveMindfulness">Save</v-btn>
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
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}
function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
}
export default {
  mounted() {
    this.updateMindfulness();
  },
  methods: {
    saveMindfulness: function() {
      this.dialog = false;
      let _self = this;
      
      let data = {
        start_datetime: new Date(this.form.startDate + ' ' + convertTo24Hour(this.form.startTime)).toISOString(),
        end_datetime: new Date(this.form.endDate + ' ' + convertTo24Hour(this.form.endTime)).toISOString(),
      }
      
      if (this.form.notes) data.notes = this.form.notes;
      
      Rest.routes.mindfulness.create({
        data: data
      }).then((res) => {
        if (res.status == 201) {
          _self.updateMindfulness();
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
          _self.updateStatusMessage = 'Mindfulness resource exists';
          _self.updateConfirm = function() {return false};
        }
      });
    },
    updateMindfulness: function() {
      let _self = this;
      self.loadingUserInfo = true;
      Rest.routes.mindfulness.list({
        query: {
          sort_directions: 'desc',
        }
      }).then((res) => {
        let data = res.data.data;
        data = data.map((item) => {
          let d = new Date(item.start_datetime);
          return {
            title: `On ${days[d.getUTCDay()]} ${month[d.getUTCMonth()]} ${d.getUTCDate()}`,
            subtitle: `You meditated ${item.minutes} minutes`,
            notes: `Notes: ${item.notes}`,
            _id: item._id,
            _data: item,
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
    deleteMinfulness: function(_id) {
      this.updateDialog = true;
      this.updateTitle = 'Delete Mindfulness Entry';
      this.updateStatusMessage = 'Are you sure you want to delete?';
      this.updateShowCancel = true;
      let _self = this;
      this.updateConfirm = function() {
        _self.updating = true;
        _self.updateStatusMessage = 'Working on delete';
        Rest.routes.mindfulness.delete({
          params:{_id: _id}
        }).then(function(m) {
          console.log(m)
          _self.updateMindfulness();
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
      menuStartDate: false,
      menuStartTime: false,
      startDate: null,
      startTime: null,
      menuEndDate: false,
      menuEndTime: false,
      endDate: null,
      endTime: null,
      notes: null,
      e: {
        startDate: [],
        startTime: [],
        endDate: [],
        endTime: [],
      },
      date: null,
      modal: false,
      minutes: 0,
      state: [],
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
          startDate: this.startDate,
          startTime: this.startTime,
          endDate: this.endDate,
          endTime: this.endTime,
          notes: this.notes,
        }
      }
    },
  watch: {
    'endDate' () {
      if (this.endDate && this.startDate) {
        if (new Date(this.endDate).getTime() < 
            new Date(this.startDate).getTime()) {
          this.e.startDate = ['Must be before end date']
          this.e.endDate = ['Must be after start date']
        } else {
          this.e.startDate = []
          this.e.endDate = []
        }
      }
    },
    'startDate' () {
      if (this.endDate && this.startDate) {
        if (new Date(this.endDate).getTime() < 
            new Date(this.startDate).getTime()) {
          this.e.startDate = ['Must be before end date']
          this.e.endDate = ['Must be after start date']
        } else {
          this.e.startDate = []
          this.e.endDate = []
        }
      }
    },
  }
}
</script>