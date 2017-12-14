
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
        <v-card>
          <v-card-title primary-title>
            <div class="headline">Your Water consumption</div>
          </v-card-title>
          <v-card-content>
            <commit-chart />
          </v-card-content>
          <v-card-actions>
            <v-btn flat dark>Listen now</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      
      <v-flex xs12 sm12 md12 lg12>
        <v-card>
          <v-card-title primary-title>
            <div class="headline">Your Water consumption</div>
          </v-card-title>
          <v-card-content>
            <line-chart :data="waterData" :options="options"/>
          </v-card-content>
        </v-card>
      </v-flex>
      
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="purple" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Halycon Days</div>
                  <div>Ellie Goulding</div>
                </div>
              </v-flex>
              <v-flex xs5>
                  <v-card-media
                    src="/static/doc-images/cards/halcyon.png"
                    height="125px"
                    contain
                  ></v-card-media>
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
                  <div class="headline">Halycon Days</div>
                  <div>Ellie Goulding</div>
                </div>
              </v-flex>
              <v-flex xs5>
                  <v-card-media
                    src="/static/doc-images/cards/halcyon.png"
                    height="125px"
                    contain
                  ></v-card-media>
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