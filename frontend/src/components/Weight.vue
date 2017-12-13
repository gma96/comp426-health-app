<template> 
<v-container fluid fill-height>  
   <v-layout row flex>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-list two-line>
          <template v-for="item in items">
            <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
            <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
            <v-list-tile avatar v-else v-bind:key="item.title" @click="">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  <v-btn
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click.stop="dialog = !dialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create weight entry
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
                    label="Date weighed"
                    v-model="date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
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
              <v-slider label="Weight" color="primary" v-model="weight" thumb-label ticks max="400"></v-slider>
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

    <v-btn
      fab
      bottom
      left
      color="pink"
      dark
      fixed
      @click.stop="toggleAuthed"
    >
      <v-icon>add</v-icon>
    </v-btn>
</v-container>
</template>
<script>


let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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
  
  mounted () {
    let _self = this;
    Rest.routes.user.login({data:{
    email: 'prestonrobinson@me.com',
    password: 'leah',
    }}).then((res) => {
      let data = res.data.data;
      console.log(data[0])
      if(data[0].token) Rest.setToken(data[0].token);
      _self.updateWeight();
    }).catch((e) =>{console.log(e)});
  },
  methods: {
    toggleAuthed: function () {
      this.store.commit('increment');
      console.log(this.store.state.count)
      console.log(this.store);
    },
    saveWeight: function() {
      // alert(this.date);
      // alert(this.weight);
      this.dialog = false;
      if (this.date && this.weight) {
        Rest.routes.weight.create({data:{
          entry_date: this.date,
          value:  this.weight,
        }}).then((res) => {
          if(res.status == 201) {
            alert('success')
            // let d = new Date(this.date);
            // console.log(this.store);
            // this.store.push({
            //     title: `On ${days[d.getUTCDay()]} ${month[d.getMonth()]} ${d.getUTCDate()}`,
            //     subtitle: `You weighed ${this.weight} lbs`,
            // })
            this.updateWeight();
            this.items = this.state;
          }
        });
      }
    },
    updateWeight: function() {
      let _self = this;
      Rest.routes.weight.list({query:{
        sort_directions: 'desc',
      }}).then((res) => {
        console.log(res);
        let data = res.data.data;
        console.log(data);
        data = data.map((item) => {
          let d = new Date(item.entry_date);
          
          return {
            title: `On ${days[d.getUTCDay()]} ${month[d.getUTCMonth()]} ${d.getUTCDate()}`,
            subtitle: `You weighed ${item.value} lbs`,
          }
        });
        console.log(data);
        _self.state.concat(data);
        _self.items = data;
      }).catch((e) =>{console.log(e)});
    }
  },
    data () {
      return {
        dialog: false,
        date: null,
        modal: false,
        weight: 0,
        state: [],
        store: this.$store,
        
        items: [
          { header: 'Mindfulness frees the mind' },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='text--primary'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
          { divider: true, inset: true },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
          { divider: true, inset: true },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='text--primary'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
        ]
      }
    }
  }
</script>