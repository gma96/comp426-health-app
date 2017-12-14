<template>
  <v-layout row flex>
    <v-flex xs12 sm10 offset-sm1 md10 lg10>
      <v-card>
      <v-progress-linear color="pink" class="processing-el" v-show="loadingUserInfo" v-bind:indeterminate="true"></v-progress-linear>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Weight Entries</h3>
          </div>
        </v-card-title>

        <v-card-text class="text-center" v-show="loadingUserInfo">
          <p class="title">We're retrieving your info...</p>
        </v-card-text>

        <v-card-text class="text-center" v-show="items.length == 0 && !loadingUserInfo">
          <p class="title">looks like you haven't created any weight entries yet...</p>
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
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create Weight Entry
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
                  <v-slider label="Weight" color="primary" v-model="value" thumb-label ticks min="0" v-bind:max="unit == 'metric' ? 200 : 200*2.2"></v-slider>
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
          <v-btn flat @click="saveWeight">Save</v-btn>
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
    this.updateWeight();
    this.unit = Auth.decode().unit;
  },
  methods: {
    saveWeight: function() {
      this.dialog = false;
      let _self = this;
      
      let data = {
        entry_date: this.form.entryDate,
        value: this.form.value,
      }
      
      Rest.routes.weight.create({
        data: data
      }).then((res) => {
        if (res.status == 201) {
          _self.updateWeight();
        }
      }).catch((res) => {
        if(res.status == 401) Auth.logout();
      });
    },
    updateWeight: function() {
      let _self = this;
      self.loadingUserInfo = true;
      Rest.routes.weight.list({
        query: {
          sort_directions: 'desc',
        }
      }).then((res) => {
        let data = res.data.data;
        data = data.map((item) => {
          let d = new Date(item.entry_date);
          return {
            title: `On ${days[d.getUTCDay()]} ${month[d.getUTCMonth()]} ${d.getUTCDate()}`,
            subtitle: `You weighed ${item.value} ${{metric: 'kilograms',imperial: 'pounds'}[Auth.decode().unit]}`,
          }
        });
        _self.items = data;
      }).catch((e) => {
        console.log(e)
        self.loadingUserInfo = false;
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
