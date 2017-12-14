// Load speperate modules
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
};
