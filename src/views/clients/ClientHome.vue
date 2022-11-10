<template>
  <div v-if="showView">
    <div class="title-container" id="centrarTitulo"><h1>Mi Portal</h1></div>
    <div class="d-flex flex-row justify-content-around">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Valor total</h5>
          <p class="card-text">{{ totalValue.toFixed(2) + " €"}}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Rentabilidad total</h5>
          <p class="card-text" v-if="showProfitChart">{{ (totalProfit * 100).toFixed(2) + " %"}}</p>
          <p class="card-text" v-else>{{"0 %"}}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">G&P</h5>
          <p class="card-text  gypgreen" v-if="earnsAndLoses > 0">{{ earnsAndLoses.toFixed(2) + " €" }}</p>
          <p class="card-text  gypred" v-else-if="earnsAndLoses < 0">{{ earnsAndLoses.toFixed(2) + " €" }}</p>
          <p class="card-text" v-else>{{ earnsAndLoses.toFixed(2) + " €" }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Total Activos</h5>
          <p class="card-text">{{ totalAssets }}</p>
        </div>
      </div>
    </div>
        <div class="centrarContenidoFila" id="opcionesGrafico">

            <div>Mostrar: </div>
            <div><b-form-select v-model="yearSelected" :options="yearOptions"></b-form-select></div>
            <div>Cada: </div>
            <div><b-form-select v-model="monthSelected" :options="monthOptions"></b-form-select> </div>
            <div><b-button class="button-success" v-on:click="updateStockHistory">Actualizar</b-button> </div>

        </div>
    <div class="grafico_rentabilidad" v-if="showProfitChart">
        <apexcharts id="graficoRentabilidad" ref="profitChart" type="line" :options="chartOptions" :series="series"></apexcharts>
    </div>
    <div class="graficos_horizontal">
      <div class="control-section" v-if="showPieChart">
        <div align='center'>
          <ejs-accumulationchart style='display:inline-block' :load='load' id='chartcontainer' :title="title"
                                 :legendSettings='legendSettings' :tooltip='tooltip'>
            <e-accumulation-series-collection>
              <e-accumulation-series :dataSource='pieChartData' xName='x' yName='y' startAngle='60' :dataLabel='dataLabel' innerRadius='0%' name='Sectores' > </e-accumulation-series>

            </e-accumulation-series-collection>
          </ejs-accumulationchart>
        </div>
      </div>
      <div class="control-section" v-if="showStocksChart">
        <div align='center'>
          <ejs-accumulationchart style='display:inline-block' :load='load'  id='chartcontainer2' :title="'Activos de tu cartera (%)'"
                                 :legendSettings='legendSettings' :tooltip='tooltip'>
            <e-accumulation-series-collection>
              <e-accumulation-series :dataSource='pieChartDataStocks' xName='x' yName='y' startAngle='60' :dataLabel='dataLabel' innerRadius='0%' name='% cartera' > </e-accumulation-series>

            </e-accumulation-series-collection>
          </ejs-accumulationchart>
        </div>
      </div>
    </div>
  </div>
  <div class="loading" v-else>
    <loading :active="true"
             :can-cancel="false"
             :is-full-page="false"/>
  </div>
</template>

<script>
import { AccumulationChartPlugin, AccumulationTooltip, PieSeries, AccumulationLegend, AccumulationDataLabel } from "@syncfusion/ej2-vue-charts";
import Vue from "vue";
import axios from "axios";
import Loading from 'vue-loading-overlay';
import VueApexCharts from 'vue-apexcharts'
import 'vue-loading-overlay/dist/vue-loading.css';
import moment from "moment";

Vue.use(AccumulationChartPlugin);

export default Vue.extend({
  name: "ClientHome",
  components: {
    Loading,
    apexcharts: VueApexCharts
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_APIKEY,
      backURL: process.env.VUE_APP_BACK_URL,
      errorMSG: process.env.VUE_APP_ERROR_MSG,
      totalValue: 0,
      earnsAndLoses: 0,
      totalAssets: 0,
      totalProfit: 0,
      showView: false,
      showPieChart: false,
      showStocksChart:false,
      showProfitChart: true,
      yearSelected: '3y',
      yearOptions: [
        { value: '3y', text: 'Selecciona una opción' },
        { value: '1y', text: '1 año' },
        { value: '2y', text: '2 años' },
        { value: '3y', text: '3 años' },
      ],
      monthSelected: '3mo',
      monthOptions: [
        { value: '3mo', text: 'Selecciona una opción' },
        { value: '1mo', text: 'Mes' },
        { value: '2mo', text: '2 meses' },
        { value: '3mo', text: '3 meses' },
        { value: '6mo', text: '6 meses' },
      ],
      pieChartData: [],
      pieChartDataStocks: [],
      infoFinances: {},
      info: null,
      test: null,
      infoTransactions: {},
      infoStockHistory: null,
      profitTimeStamp: new Map(),
      dataLabel: {
        visible: true, position: 'Outside',
        connectorStyle: { length: '20px', type: 'Curve' }, name: 'text',
      },
      legendSettings: {
        visible: false,
      },
      tooltip: { enable: true, format: '${point.x} : <b>${point.y}%</b>' },
      title: "Sectores de tu cartera",
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
          width: 5,
          curve: 'smooth',
        },
        xaxis: null,
        yaxis: {
          labels: {
            formatter: (val) => {
              return (val*100).toFixed(2)  + ' %';
            }
          }},
        title: {
          text: 'Rentabilidad total de tu cartera',
          align: 'left',
          style: {
            fontSize:  '25px',
            fontWeight:  'bold',
            fontFamily:  'Open Sans',
            color:  '#5d6262'
          },
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            if(val !== 0) {
              return (val * 100).toFixed(2) + ' %';
            }
          },
          background: {
            enabled: true,
            foreColor: '#fff',
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.9,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45
            }
          },
        },
      },
      series: [],
      backup_converter : 0.94,
    }
  },
  provide: {
    accumulationchart: [AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip]
  },
  created() {
    if(this.$cookies.get("Session") == null) {
      localStorage.clear()
      window.location.href = '/login'
    }
    else {
      this.getData();
    }
  },
  methods: {
    //Este método obtendrá la rentabilidad total de la cartera a lo largo de varios periodos
    getProfitChart() {
      let size = 0, longerStock;
      this.profitTimeStamp = new Map(); //Inicializarlo para poder actualizarlo
      for(const stock of Object.values(this.infoStockHistory)){
        if(stock.timestamp.length > size){
          size = stock.timestamp.length;
          longerStock = stock;
        }
      }
      for (let stamp = 0; stamp <= size; stamp++) {//Por cada timestamp recorrerá los valores
        let rentabilidad = 0;
        let gyp = 0;
        let inversionTotal = 0;


        for (const stock of this.infoTransactions) { //Por cada transacción comparará si entra en la fecha o no
          const infoStock = Object.values(this.infoStockHistory).find(obj => obj.symbol === stock.stockID);
          if(infoStock !== undefined ){
            const indice = infoStock.timestamp.length - (size - stamp); //El indice es
            if(indice >= 0) { //Si una acción solo tiene 5 timestamps no incluirlo al principio
              const fecha = new Date(stock.date).getTime() / 1000; // Obtener la fecha en EPOCH
              let timeStmp
              if(stamp === size){
                timeStmp = Date.now() / 1000
              }
              else{
                timeStmp = infoStock.timestamp[indice]
              }
              if (fecha <= timeStmp) { //Si la fecha de compra es anterior al timestamp incluirla
                let change = 1;
                if (stock.currency !== 'EUR'){
                  change = this.convertToEuros(stock.currency);
                }

                inversionTotal += (change * stock.buyPrice) * stock.quantity; //En esta variable acumulamos el valor total de un timestamp
                if(indice > 0) { //La API da el valor de cierre de un timestamp en close - 1
                  gyp += (change * infoStock.close[indice - 1] - stock.buyPrice * change) * stock.quantity //Acumulamos las PyG de un TimeStamp
                }
                else{
                  gyp += (change * infoStock.chartPreviousClose - stock.buyPrice * change) * stock.quantity //Acumulamos las PyG de un TimeStamp
                }
              }
            }
          }
        }

        if(gyp !== 0 && inversionTotal !== 0) {//Para que no divida 0 / 0
          rentabilidad = gyp / inversionTotal;
        }

        let timeStamp
        if(stamp === size){
          timeStamp = (Date.now() / 1000).toFixed(0)
        }
        else{
          timeStamp = longerStock.timestamp[stamp]
        }
        this.profitTimeStamp.set(timeStamp, rentabilidad);
      }
      this.paintChart();
    },
    async getTransactions(){
      let hashClient = this.$cookies.get("Session")
      let promises = []

      this.infoTransactions = JSON.parse(localStorage.getItem("infoTransactions"))

      if(this.infoTransactions === null) {
        promises.push(axios
            .get( this.backURL + 'client/showTransactions/' + hashClient)
            .then(response => {
              this.infoTransactions = response.data;
              localStorage.setItem("infoTransactions", JSON.stringify(this.infoTransactions));
              if(this.infoTransactions.length === 0) {
                this.showEmptyMsg = true;
                this.showView = true;
                this.showProfitChart = false;
              }
              else{
                this.getStockHistory();
              }
            })
            .catch((err) => {
              this.showWarningModal(err.response.data)
              this.showEmptyMsg = true
            }))

        await Promise.all(promises)
            .then(() => {
              this.showView = true;
            })
            .catch(() => {
              this.showWarningModal(this.errorMSG)
            })
      }
      else {
        if(this.infoTransactions.length === 0){
          this.showEmptyMsg = true;
          this.showView = true;
          this.showProfitChart = false;
        }
        else {
          await this.getStockHistory();
        }
      }
    },
     updateStockHistory() {
       localStorage.removeItem("infoStockHistory");
       this.getStockHistory();
     },
    //Llamada a la API Stock History, que devuelve los precios de varios valores dados un range y un interval
    async getStockHistory() {

      this.infoStockHistory = JSON.parse(localStorage.getItem("infoStockHistory"));

      if(this.infoStockHistory === null) {

        let symbols = [];

        for (const stock of Object.keys(this.info)) {//Obtener todos los simbolos de nuestra cartera
          symbols.push(stock);
        }

        let symbolsString = symbols.join(',');

        const options = {
          method: 'GET',
          url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v8/finance/spark',
          params: {symbols: symbolsString, range: this.yearSelected, interval: this.monthSelected},
          headers: {
            'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
          }
        };

        axios.request(options).then(response => {
          this.infoStockHistory = response.data;
          localStorage.setItem("infoStockHistory", JSON.stringify(this.infoStockHistory));
          this.getProfitChart();
          this.showEmptyMsg = this.infoStockHistory.length === 0;
        }).catch((error) => {
          this.showWarningModal(error.response.data);
          this.showEmptyMsg = true;
        });
      }
      else {
        this.getProfitChart();
      }
    },
    getAllStocksChart() {
      if(Object.keys(this.info).length > 0 && Object.keys(this.infoFinances).length > 0) {
        let totalMarketValue = 0
        let marketByStock = {}
        for(let stock in this.infoFinances) {
          if(this.infoFinances[stock].quoteResponse.result[0].currency === 'USD') {
            marketByStock[stock] = (this.infoFinances[stock].quoteResponse.result[0].regularMarketPrice * this.info[stock].quantity) * 0.87
            totalMarketValue += (this.infoFinances[stock].quoteResponse.result[0].regularMarketPrice * this.info[stock].quantity) * 0.87
          }
          else {
            marketByStock[stock] = this.infoFinances[stock].quoteResponse.result[0].regularMarketPrice * this.info[stock].quantity
            totalMarketValue += this.infoFinances[stock].quoteResponse.result[0].regularMarketPrice * this.info[stock].quantity
          }
        }

        for(let stock in this.infoFinances) {
          this.pieChartDataStocks.push({'x': stock, 'y': ((marketByStock[stock] / totalMarketValue) * 100).toFixed(2), text: stock})
        }

        this.showStocksChart = true
      }
    },
    getSectorChart() {
      let sectors = new Map()
      for (let index in this.info) {
        if(sectors.has(this.info[index]['sector'])) {
          sectors.set(this.info[index]['sector'], sectors.get(this.info[index]['sector']) + 1)
        }
        else {
          sectors.set(this.info[index]['sector'], 1)
        }
      }

      for (let [key, value] of sectors) {
        this.pieChartData.push({'x': key, 'y': (value/Object.values(this.info).length * 100).toFixed(2), text: key + " " + value})
      }

      if(sectors.size !== 0) this.showPieChart = true

    },
    getTotalAssets(){
      this.totalAssets = Object.keys(this.info).length;
    },
    getTotalValue(){
      let totalValueLocal = 0;

      for (const index in this.info) {
        let change = 1;
        let currency = this.infoFinances[index].quoteResponse.result[0].currency;

        if (currency !== 'EUR'){
          change = this.convertToEuros(currency);
        }

        totalValueLocal += this.infoFinances[index].quoteResponse.result[0].regularMarketPrice * change * this.info[index].quantity;
      }

      this.totalValue = totalValueLocal;
    },
    getTotalEarnsAndLoses(){
      let priceDifference; //variable auxiliar para hacer cuentas
      let gp; //pyg por cada transaccion
      let capitalInvestment = 0; //Variable para acumular el capital invertido

      for(let item in this.info){
        let currency = this.infoFinances[item].quoteResponse.result[0].currency;
        let change = 1;

        if (currency !== 'EUR'){
          change = this.convertToEuros(currency);
        }

        //priceDifference = precio actual en EUR - precio de compra en EUR
        priceDifference = change * this.infoFinances[item].quoteResponse.result[0].regularMarketPrice - change * this.info[item].buyPrice;
        //gp = aux * cantidad
        gp = priceDifference * this.info[item].quantity;
        capitalInvestment += (change * this.info[item].buyPrice * this.info[item].quantity);

        this.earnsAndLoses += gp;
      }

      this.totalProfit = this.earnsAndLoses/capitalInvestment;
    },
    convertToEuros(currency){
      if(currency === 'EUR'){
        return 1;
      }
      let change = localStorage.getItem(currency);
      if(change == 0) {change = this.backup_converter;}
      if(change == null) {

        const options = {
          method: 'GET',
          url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert',
          params: {from: currency, to: 'EUR', amount: '1'},
          headers: {
            'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
            'X-RapidAPI-Key': '7f8e0f06aemsh10389b0e8277836p1c4e11jsna2dbb7767fc7'
          }
        };

        axios.request(options).then(function (response) {
          localStorage.setItem(currency, response.data.result);
          return response.data.result;
        }).catch(function (error) {
          this.showWarningModal(error);
          return this.backup_converter;
        });

        return this.backup_converter;
      }
      else {
        return change;
      }
    },
    async financialData(){
      let promises = [];
      for (let index in this.info) {
        let options = {
          method: 'GET',
          url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote',
          params: {symbols: index},
          headers: {
            'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
          }
        };

        promises.push(axios.request(options).then(response => {
              this.infoFinances[index] = response.data;
              return response.data;
            }).catch(() => {
              this.showWarningModal(this.errorMSG);
            })
        );
        await new Promise(r => setTimeout(r, 300))
      }

      localStorage.setItem("infoFinances", JSON.stringify(this.infoFinances))

      Promise.all(promises)
          .then(() => {
            this.getTransactions();
            this.getSectorChart();
            this.getAllStocksChart();
            this.getTotalAssets();
            this.getTotalValue();
            this.getTotalEarnsAndLoses();
          })
          .catch(() => {
            this.showWarningModal(this.errorMSG);
          })
    },
    load: function(args) {
      let selectedTheme = location.hash.split('/')[1];
      selectedTheme = selectedTheme ? selectedTheme : 'Material';
      args.chart.theme = (selectedTheme.charAt(0).toUpperCase() +
          selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
    },
    getData(){
      let hashClient = this.$cookies.get("Session")
      this.info = JSON.parse(localStorage.getItem("info"))
      this.infoFinances = JSON.parse(localStorage.getItem("infoFinances"))

      if(this.infoFinances === null || this.info === null ||
          (Object.keys(this.infoFinances).length === 0 && Object.keys(this.info).length !== 0 ) ||
          (Object.keys(this.info).length === 0 && Object.keys(this.infoFinances).length !== 0 )) {
        this.infoFinances = {}
        axios
            .get(this.backURL + 'client/showPortfolio/' + hashClient)
            .then(response => {
              this.info = response.data;
              localStorage.setItem("info", JSON.stringify(this.info))
              this.financialData();
            })
            .catch(() => {
              this.showWarningModal(this.backURL);
            })
      }
      else {
        this.getTransactions();
        this.getSectorChart();
        this.getAllStocksChart();
        this.getTotalAssets();
        this.getTotalValue();
        this.getTotalEarnsAndLoses();
      }
    },
    showWarningModal(message) {
      this.$bvModal.show("modal")
      this.modal.message = message
      this.modal.title = "¡Operación Fallida!"
      this.modal.variant = 'warning'
    },
    paintChart(){
      let fechas = [];
      let data = [];
      for (const profit of this.profitTimeStamp.entries()){
        let date = new Date(0);
        date.setUTCSeconds(profit[0]); //0 es la clave y 1 el valor
        fechas.push(moment(date).format('YYYY MM DD'));
        data.push(profit[1]);//Aqui almacenamos las rentabilidades
      }
      this.series = [{
        name: "Rentabilidad",
        data: data
      }];

      this.chartOptions = {...this.chartOptions, ...{
        xaxis: {
          categories: fechas
        }
        }}

      if(this.showView === false){
        this.showView = true;
      }

    }
  }
});
</script>

<style scoped>


.card-title{
  font-weight: bold;
}

.card{
  min-width: 200px;
}

.gypgreen{
  color: green;
}

.gypred{
  color: red;
}

.graficos_horizontal{
  margin-top: 35px;
  display: flex;
  aling-items: center;
  justify-content: center;
}

.grafico_rentabilidad{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

#graficoRentabilidad{
  width: 60%;
  height: 200px;
  align-self: center;
}

#opcionesGrafico{
  justify-content: space-around;
  max-width: 60%;
  margin-left: 20%;
  margin-top: 1.5em;
}

</style>