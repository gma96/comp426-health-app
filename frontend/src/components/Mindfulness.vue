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
            <v-list-tile avatar v-else v-bind:key="item.title" @click="">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                <v-list-tile-action-text v-html="item.notes"></v-list-tile-action-text>
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
        <v-layout row wrap>
          <v-flex xs12 align-center justify-space-between>
            <!-- date_picker -->
            <v-flex xs12>
              <v-dialog persistent v-model="modal" lazy full-width width="290px">
                <v-date-picker v-model="date" scrollable actions>
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
              <v-time-picker v-model="start"></v-time-picker>
              <v-time-picker v-model="end"></v-time-picker>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                name="notes"
                label="Notes"
                multi-line
              ></v-text-field>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-btn flat color="primary">More</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
        <v-btn flat @click="saveMindful">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    this.updateMindfulness();
  },
  methods: {
    saveMindfulness: function() {
      this.dialog = false;
      if (this.date && this.start && this.end) {
        let startDT = new Date(this.date.getFullYear(), this.date.getMonth(),this.date.getDate(), this.start.getHours(), this.start.getMinutes(), 0, 0);
        let endDT = new Date(this.date.getFullYear(), this.date.getMonth(),this.date.getDate(), this.end.getHours(), this.end.getMinutes(), 0, 0);
        Rest.routes.mindfulness.create({
          data: {
            start_datetime: startDT,
            end_datetime: endDT,
            minutes: (this.end - this.start).getMinutes(),
            notes: this.notes,
          }
        }).then((res) => {
          if (res.status == 201) {
            alert('success')
            this.updateMindful();
            this.items = this.state;
          }
        });
      }
    },
    updateMindfulness: function() {
      let _self = this;
      self.loadingUserInfo = true;
      Rest.routes.mindfulness.list({
        query: {
          sort_directions: 'desc',
        }
      }).then((res) => {
        console.log(res);
        let data = res.data.data;
        console.log(data);
        data = data.map((item) => {
          let d = new Date(item.start_datetime);
          return {
            title: `On ${days[d.getUTCDay()]} ${month[d.getUTCMonth()]} ${d.getUTCDate()}`,
            subtitle: `You meditated ${item.minutes} minutes`,
            notes: `Notes: ${item.notes}`,
          }
        });
        console.log(data);
        _self.state.concat(data);
        _self.items = data;
      }).catch((e) => {
        console.log(e)
        self.loadingUserInfo = false;
      });
    }
  },
  data() {
    return {
      dialog: false,
      loadingUserInfo: false,
      date: null,
      modal: false,
      minutes: 0,
      state: [],
      items: [],
    }
  }
}
</script>