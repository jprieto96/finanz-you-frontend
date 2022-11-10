<template>
  <div class="centrarContenido" v-if="showView">
    <div class="title-container"><h1>Trending Stocks</h1></div>
    <b-table-simple outlined responsive class="table">
      <b-thead class="thead-light">
      <b-tr>
        <b-th scope="col">Valor</b-th>
        <b-th scope="col"></b-th>
        <b-th scope="col">Precio</b-th>
      </b-tr>
      </b-thead>
      <b-tbody>
      <b-tr v-for="(value, index) in this.infoFinances" v-bind:key="infoFinances[index].quoteResponse.result[0].longName">
        <b-td v-if="infoFinances[index].quoteResponse.result[0].hasOwnProperty('longName')">
          {{ infoFinances[index].quoteResponse.result[0].longName }}
        </b-td>
        <b-td v-else>
          {{ infoFinances[index].quoteResponse.result[0].shortName }}
        </b-td>
        <b-td>
          <apexcharts width="700" height="200" type="line" :options="chartOptions" :series="series[index]"></apexcharts>
        </b-td>
        <b-td>
          {{ infoFinances[index].quoteResponse.result[0].regularMarketPrice.toFixed(2) + " $" }}
        </b-td>
      </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
  <div class="loading" v-else>
     <loading :active="true"
              :can-cancel="false"
              :is-full-page="false"/>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from 'vue-apexcharts'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import moment from 'moment'

export default {
  name: "Home",
  components: {
    Loading,
    apexcharts: VueApexCharts
  },
  data(){
    return {
      apiKey: process.env.VUE_APP_APIKEY,
      backURL: process.env.VUE_APP_BACK_URL,
      errorMSG: process.env.VUE_APP_ERROR_MSG,
      infoFinances : [],
      stockLists : null,
      showView: false,
      modal: {
        title: '',
        message: '',
        variant: '',
      },
      test: '',
      chartOptions: {
        chart: {
          id: 'basic-line',
          zoom: {
            enabled: false,
          }
        },
        markers: {
          showNullDataPoints: true,
          strokeOpacity: 0.3,
        },
        stroke: {
          width: 3
        },
        xaxis: null,
        yaxis: {
          labels: {
            formatter: (val) => {
              return val.toFixed(2) + ' $';
            }
          }},
        colors: ["#77B6EA"],
      },
      series: [],
    }
  },

  created() {
    this.getTrendingStocks()
    /*
    if(this.$cookies.get("Session") == null) {
      this.getTrendingStocks()
    }
    else {
      window.location.href = '/client'
    }
  */
  },

  methods: {
    showWarningModal(message) {
      this.$bvModal.show("modal")
      this.modal.message = message
      this.modal.title = "¡Operación Fallida!"
      this.modal.variant = 'warning'
    },

    getTrendingStocks() {

      const options = {
        method: 'GET',
        url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v1/finance/trending/US',
        headers: {
          'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        }
      }

      axios.request(options).then(response => {
        this.stockLists = (response.data.finance.result[0].quotes);
        this.stockLists = this.stockLists.slice(0-4);
        this.getFinancialData();
      }).catch(() => {
        this.showWarningModal(this.errorMSG);
      })
    },
    async getFinancialData() {
      let promises = [];
      for (let stock of this.stockLists) {
        const options = {
          method: 'GET',
          url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote',
          params: {symbols: stock.symbol},
          headers: {
            'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
          }
        };

        promises.push(axios.request(options).then(response => {
              this.infoFinances.push(response.data);
              this.getChart(stock.symbol);
              return response.data;
            }).catch(() => {
              this.showWarningModal(this.errorMSG);
            })
        );
        await new Promise(r => setTimeout(r, 500))
      }
      Promise.all(promises)
          .then(() => {
            this.showView = true;
          })
          .catch(err => {
            console.log(err)
          })
    },
    getChart(ticker){ //This call returns the quotes of the value for the last 3 days
      const options = {
        method: 'GET',
        url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v8/finance/chart/' + ticker,
        params: {range: '2d'},
        headers: {
          'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        }
      };

      axios.request(options).then( (response) => {
        console.log(response.data);
        this.paintChart(ticker, response.data.chart.result[0].indicators.quote[0].open, response.data.chart.result[0].timestamp);
      }).catch(() => {
        this.showWarningModal(this.errorMSG);
      });

    },
    paintChart(ticker, data, timestamps){
      let fechas = [];
      for (let i = 0; i < timestamps.length; i++){
        let date = new Date(0);
        date.setUTCSeconds(timestamps[i]);
        fechas.push(moment(date).format('dd HH:MM'));
      }
      this.series.push([{
        name: ticker,
        data: data
      }]);

      let maxTicks = Math.min(timestamps.length/60, 20); //En timestamps se guardan los minutos, al dividirlo obtenemos el nº de horas

      this.chartOptions.xaxis = {
        categories: fechas,
        tickAmount: maxTicks,
      };

      if(this.showView === false){
        this.showView = true;
      }

    }
  }
}

</script>

<style scoped>
@import "../css/generalStyle.css";

.main_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 50px;
}


td{
  vertical-align: middle;
}
</style>