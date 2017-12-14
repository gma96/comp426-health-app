
<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg
    id="dashboard"
    fill-height
  >
    <v-layout column>
    
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Mindfulness</div>
                  <div>With the mindfulness tracker, track the times of day you were mindful, along with any notes you may have about the experience. </div>
                </div>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="purple" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Sleep</div>
                  <div>Similar to the mindfulness tracker, the sleep tracker allows you to record the times of day you were asleep, along with any notes you may have about the experience.</div>
                </div>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
       <v-flex xs12 sm12 md12 lg12>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Water Intake</div>
                  <div>With the water intake tracker, track your daily water intake by entering a date along with the amount of water you've drinken.</div>
                </div>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="purple" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Weight</div>
                  <div>With the weight tracker, track your weight over time by entering a date along with your current weight at that time.</div>
                </div>
              </v-flex>
             
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>
<script>
import CommitChart from '@/components/charts/CommitChart'
import LineChart from '@/components/charts/LineChart'
export default {
  components: { CommitChart, LineChart },
  mounted () {
    let _self = this;
    Rest.routes.water.list({
      query: {
        sort: 'entry_date',
        sort_directions: 'desc',
      },
    })
    .then((res) => {
      let data = res.data.data;
      let labels = [];
      let dataset = [];
      data.map(function(item) {
        labels.push(item.entry_date);
        dataset.push(item.value);
      });

      _self.waterData = {
        labels: labels,
        datasets: [
          {
            label: 'Water',
            backgroundColor: '#1976D2',
            data: dataset,
          },
        ],
      }
      console.log(_self.waterData)
    });
  },
  data () {
    return {
      options: {responsive: true, maintainAspectRatio: false},
      waterData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Water',
            backgroundColor: '#1976D2',
            data: [40, 39, 10, 40, 39, 80, 40]
          }
        ],
      }
    }
  }
}
</script>
