h4
<template>
  <div>
    <div class="container detailPage" v-if="showView">
      <div class="title-container" id="centrarTitulo"><h1>Información del activo</h1></div>
      <a :href="infoStock.website" target="_blank">
        <div class="titleStock">
          <b-img
            v-if="
              this.img !== null &&
              this.img.hasOwnProperty('branding') &&
              this.img.branding.logo_url !== null
            "
            class="logo"
            :src="img.branding.logo_url + '?apikey=' + apiKeyForImage"
            fluid
            alt="Responsive image"
          ></b-img>
          <h1 v-if="img !== null">{{ this.img.name }}</h1>
          <h1 v-else>{{ this.id }}</h1>
        </div>
      </a>
      <p
        class="stockDescription"
        v-if="this.infoStock.hasOwnProperty('longBusinessSummary')"
      >
        {{ this.infoStock.longBusinessSummary }}
      </p>
      <p class="stockDescription" v-else>Descripción no disponible</p>
      <br />
      <hr />
      <br />
      <div id="lineChart" v-if="showLineChart">
        <apexchart
          type="line"
          height="350"
          :options="chartOptionsLineChart"
          :series="seriesLineChart"
        ></apexchart>
      </div>
      <br />
      <div class="container">
        <div class="row">
          <div
            class="control-section col-lg-6 col-md-6 col-sm-12"
            v-if="showPieChart"
          >
            <div align="center">
              <ejs-accumulationchart
                style="display: block"
                :load="load"
                align="center"
                id="chartcontainer"
                :title="'% ' + this.id + ' sobre tu cartera'"
                :legendSettings="legendSettings"
                :tooltip="tooltip"
              >
                <e-accumulation-series-collection>
                  <e-accumulation-series
                    :dataSource="pieChartData"
                    xName="x"
                    yName="y"
                    startAngle="60"
                    :dataLabel="dataLabel"
                    innerRadius="0%"
                    name="% cartera"
                  >
                  </e-accumulation-series>
                </e-accumulation-series-collection>
              </ejs-accumulationchart>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-else>
            <h5><b>Este activo no existe en tu cartera</b></h5>
          </div>
          <br />
          <div
            class="recommendation-section col-lg-6 col-md-6 col-sm-12"
            align="center"
          >
            <div id="chart" v-if="showRecommendationGraph">
              <h5><b>Tendencia de recomendaciones</b></h5>
              <apexchart
                type="bar"
                height="350"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12" v-else>
              <h5>
                <b
                  >No se pueden obtener las recomendaciones porque no existen
                  para este valor</b
                >
              </h5>
            </div>
          </div>
        </div>
        <br>
        <b-table-simple striped responsive v-if="showRatiosTable">
          <b-thead>
            <b-tr>
              <b-th>
                Ratio
              </b-th>
              <b-th>
                Valor
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>
                <b-icon id="dividendYield" icon="info-circle"></b-icon>
                <b-tooltip target="dividendYield" triggers="hover" positioning="bottom" variant="primary">
                  La rentabilidad por dividendo nos indica qué cantidad de la inversión podemos recuperar únicamente con el reparto de dividendos de la compañía.
                </b-tooltip>
                Rentabilidad por dividendo (%)
              </b-td>
              <b-td>
                {{ (stockRatios.dividendYielPercentageTTM * 100).toFixed(2) }}%
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="cashRatio" icon="info-circle"></b-icon>
                <b-tooltip target="cashRatio" triggers="hover" positioning="bottom" variant="primary">
                  Mide la capacidad de la empresa para hacer frente rápidamente a sus obligaciones en el corto plazo. Esto, sin la necesidad de vender ningún activo.
                </b-tooltip>
                Ratio de caja (%)
              </b-td>
              <b-td>
                {{ (stockRatios.cashRatioTTM * 100).toFixed(2) }}%
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="debtRatio" icon="info-circle"></b-icon>
                <b-tooltip target="debtRatio" triggers="hover" positioning="bottom" variant="primary">
                  Se utiliza para determinar qué parte de los activos de una empresa se financia mediante deuda
                </b-tooltip>
                Ratio de deuda (%)
              </b-td>
              <b-td>
                {{ (stockRatios.debtRatioTTM * 100).toFixed(2) }}%
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="pegRatio" icon="info-circle"></b-icon>
                <b-tooltip target="pegRatio" triggers="hover" positioning="bottom" variant="primary">
                  Compara el precio de cotización de la acción, con respecto a los beneficios de la empresa, Un PEG alto (mayor que 1) implica sobrevaloración del título y un PEG bajo (menor que 1) infravaloración del título
                </b-tooltip>
                PEG Ratio (Cotización-Beneficios)
              </b-td>
              <b-td>
                {{ stockRatios.pegRatioTTM.toFixed(2) }}
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="ptbRatio" icon="info-circle"></b-icon>
                <b-tooltip target="ptbRatio" triggers="hover" positioning="bottom" variant="primary">
                  Es el precio de las acciones de una empresa dividido por el valor en libros por acción de dicha empresa. Refleja cuánto están los inversores dispuestos a pagar por los activos de una empresa en relación al valor contable de dichos activos
                </b-tooltip>
                Price to book Ratio (Precio-Valor en libros)
              </b-td>
              <b-td>
                {{ stockRatios.priceToBookRatioTTM.toFixed(2) }}
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="priceCFR" icon="info-circle"></b-icon>
                <b-tooltip target="priceCFR" triggers="hover" positioning="bottom" variant="primary">
                  Mide el valor del precio de una acción en relación con su flujo de caja operativo por acción
                </b-tooltip>
                Ratio Precio-Flujo de caja
              </b-td>
              <b-td>
                {{ stockRatios.priceCashFlowRatioTTM.toFixed(2) }}
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="PER" icon="info-circle"></b-icon>
                <b-tooltip target="PER" triggers="hover" positioning="bottom" variant="primary">
                  Expresa la valoración que realiza el mercado sobre la capacidad de generación de beneficios de la empresa, cómo  el número de veces que está contenido el beneficio por acción en el precio de mercado de la misma.
                </b-tooltip>
                PER (Precio/a-Beneficio/a)
              </b-td>
              <b-td>
                {{ stockRatios.priceEarningsRatioTTM.toFixed(2) }}
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="salesRatio" icon="info-circle"></b-icon>
                <b-tooltip target="salesRatio" triggers="hover" positioning="bottom" variant="primary">
                  Compara el precio de las acciones de una empresa con sus ingresos. Es un indicador del valor que los mercados financieros han asignado a cada dólar de ventas o ingresos de una empresa.
                </b-tooltip>
                Ratio Precio/Ventas
              </b-td>
              <b-td>
                {{ stockRatios.priceSalesRatioTTM.toFixed(2) }}
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="ROA" icon="info-circle"></b-icon>
                <b-tooltip target="ROA" triggers="hover" positioning="bottom" variant="primary">
                  Mide la rentabilidad del total de activos de la empresa. Se calcula como el cociente entre el beneficio y el activo total.
                </b-tooltip>
                ROA (Retorno sobre los activos)
              </b-td>
              <b-td>
                {{ (stockRatios.returnOnAssetsTTM * 100).toFixed(2) }}%
              </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                <b-icon id="ROE" icon="info-circle"></b-icon>
                <b-tooltip target="ROE" triggers="hover" positioning="bottom" variant="primary">
                  Mide la rentabilidad de una empresa. Se calcula dividiendo el beneficio neto obtenido por dicha compañía en relación a sus fondos propios.
                </b-tooltip>
                ROE (Retorno sobre los accionistas)
              </b-td>
              <b-td>
                {{ (stockRatios.returnOnEquityTTM * 100).toFixed(2) }}%
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <br>
        <br />
        <hr v-if="this.news.length > 0" />
        <br />
        <div class="row">
          <div v-if="this.news.length > 0">
            <h4>
              <b>{{ this.news.length }} últimas noticias</b>
            </h4>
            <br />
            <b-list-group>
              <b-list-group-item
                v-for="item in news"
                v-bind:key="item"
                :href="item.article_url"
                target="_blank"
                class="align-items-start"
              >
                <div class="itemNews">
                  <img :src="item.image_url" :alt="id" class="imgNews" />
                  <div class="newsText">
                    <p>
                      <b>{{ item.title }}</b>
                    </p>
                    <p>{{ item.description }}</p>
                    <a class="linkNews" :href="item.article_url" target="_blank"
                      ><p>Ver noticia completa...</p></a
                    >
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </div>
      <b-modal id="modal-1" title="BootstrapVue">
        <p class="my-4">Hello from modal!</p>
      </b-modal>

      <ModalMessage
        :message="modal.message"
        :title="modal.title"
        :variant="modal.variant"
        class="custom-modal"
      ></ModalMessage>
    </div>
    <div class="errorDiv" v-else>
      <h3>No hay información detallada sobre este activo</h3>
    </div>
    <div class="loading" v-if="isLoading">
      <loading :active="true" :can-cancel="false" :is-full-page="false" />
    </div>
  </div>
</template>

<script>
import {
  AccumulationChartPlugin,
  AccumulationTooltip,
  PieSeries,
  AccumulationLegend,
  AccumulationDataLabel,
} from "@syncfusion/ej2-vue-charts";
import Vue from "vue";
import axios from "axios";
import VueApexCharts from "vue-apexcharts";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(AccumulationChartPlugin);

export default {
  name: "Stock",
  components: {
    apexchart: VueApexCharts,
    Loading,
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_APIKEY,
      apiKeyForImage: process.env.VUE_APP_APIKEY_FOR_STOCK_INFO,
      apiKeyForStockPrice: process.env.VUE_APP_APIKEY_FOR_STOCK_PRICE,
      apiKeyForStockRatios: process.env.VUE_APP_APIKEY_FOR_STOCK_RATIOS,
      backURL: process.env.VUE_APP_BACK_URL,
      errorMSG: process.env.VUE_APP_ERROR_MSG,
      isLoading: true,
      info: {},
      infoFinances: {},
      infoTransactions: {},
      infoStock: {},
      stockRatios: {},
      infoRecommendationStock: {},
      id: this.$route.params.id,
      showView: false,
      showPieChart: false,
      showLineChart: false,
      showRecommendationGraph: false,
      showRatiosTable: false,
      pieChartData: [],
      news: [],
      img: null,
      modal: {
        title: "",
        message: "",
        variant: "",
      },
      dataLabel: {
        visible: true,
        position: "Outside",
        connectorStyle: { length: "20px", type: "Curve" },
        name: "text",
      },

      legendSettings: {
        visible: false,
      },

      tooltip: { enable: true, format: "${point.x} : <b>${point.y}%</b>" },

      series: [
        {
          name: "Venta-Fuerte",
          data: [],
        },
        {
          name: "Venta",
          data: [],
        },
        {
          name: "Mantener",
          data: [],
        },
        {
          name: "Compra",
          data: [],
        },
        {
          name: "Compra-Fuerte",
          data: [],
        },
      ],

      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
          },
        },
        xaxis: {
          type: "string",
          categories: [],
        },
        legend: {
          position: "right",
          offsetY: 100,
        },
        fill: {
          opacity: 1,
        },
      },

      seriesLineChart: [
        {
          name: "Rentabilidad - %",
          data: [],
        },
      ],
      chartOptionsLineChart: {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: true,
          },
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Rentabilidad del valor en tu cartera",
          align: "left",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: [],
          title: {
            text: "Fecha",
          },
        },
        yaxis: {
          title: {
            text: "% Porcentaje",
          },
          min: -20,
          max: 100,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
    };
  },
  provide: {
    accumulationchart: [
      AccumulationLegend,
      PieSeries,
      AccumulationDataLabel,
      AccumulationTooltip,
    ],
  },
  created() {
    this.getData();
    this.getPieChart();
    this.getLineChart();
    this.getRatios();
  },
  methods: {
    async getRatios() {
      this.stockRatios = JSON.parse(localStorage.getItem("stockRatios" + this.id))
      if(this.stockRatios === null) {
        let response = await axios.get(
          "https://financialmodelingprep.com/api/v3/ratios-ttm/" +
            this.id +
            "?apikey=" +
            this.apiKeyForStockRatios
        );
        this.stockRatios = response.data[0]
        localStorage.setItem("stockRatios" + this.id, JSON.stringify(this.stockRatios))
      }
      this.showRatiosTable = true
    },
    getPieChart() {
      let marketValueStockDetail = 0;
      if (
        this.infoFinances[this.id].quoteResponse.result[0].currency === "USD"
      ) {
        marketValueStockDetail =
          this.infoFinances[this.id].quoteResponse.result[0]
            .regularMarketPrice *
          this.info[this.id].quantity *
          0.87;
      } else {
        marketValueStockDetail =
          this.infoFinances[this.id].quoteResponse.result[0]
            .regularMarketPrice * this.info[this.id].quantity;
      }

      let totalMarketValue = 0;
      for (let stock in this.infoFinances) {
        if (
          this.infoFinances[stock].quoteResponse.result[0].currency === "USD"
        ) {
          totalMarketValue +=
            this.infoFinances[stock].quoteResponse.result[0]
              .regularMarketPrice *
            this.info[stock].quantity *
            0.87;
        } else {
          totalMarketValue +=
            this.infoFinances[stock].quoteResponse.result[0]
              .regularMarketPrice * this.info[stock].quantity;
        }
      }

      let percentageOfParticularStock = (
        (marketValueStockDetail / totalMarketValue) *
        100
      ).toFixed(2);
      let restPercentage = (100 - percentageOfParticularStock).toFixed(2);
      if (percentageOfParticularStock > 0) {
        this.pieChartData.push({
          x: this.id,
          y: percentageOfParticularStock,
          text: this.id,
        });
      }
      if (restPercentage > 0) {
        this.pieChartData.push({
          x: "Resto de la cartera",
          y: restPercentage,
          text: "Resto de la cartera",
        });
      }
      this.showPieChart = true;
    },
    async getLineChart() {
      let categoriesMenu = [];
      let pricesByDate = [];

      let buyPriceAtTheMoment = 0
      let totalQuantity = 0

      const formatDate = (date)=>{
        let month = date.getMonth() + 1
        if(month < 10) month = "0" + month
        let day = date.getDate()
        if(day < 10) day = "0" + day
        let formatted_date = date.getFullYear() + "-" + month + "-" + day
        return formatted_date;
      }

      let firstBuyDay = ""
      for (let i = 0; i < this.infoTransactions.length; i++) {
        if (this.infoTransactions[i].stockID === this.id) {
          if(firstBuyDay === "") firstBuyDay = new Date(this.infoTransactions[i].date)
          let d = new Date(this.infoTransactions[i].date)
          if(d < firstBuyDay) {
            firstBuyDay = d
          }
        }
      }

      console.log(firstBuyDay)

      let d_first = formatDate(firstBuyDay)
      let d_last = formatDate(new Date())

      let responsePrice = JSON.parse(localStorage.getItem("stockPrices" + this.id))
      if(responsePrice === null) {
        responsePrice = await axios.get("https://api.marketstack.com/v1/eod?access_key=" + this.apiKeyForStockPrice + "&symbols=" + this.id + "&date_from=" + d_first + "&date_to=" + d_last);
        localStorage.setItem("stockPrices" + this.id, JSON.stringify(responsePrice))
      }

      let arrayPrecios = responsePrice.data.data.reverse()
      if(arrayPrecios.length < 6) {
        categoriesMenu.push(d_first)
        pricesByDate.push(arrayPrecios[0].close);
        for(let i = 1; i < arrayPrecios.length - 1; i++) {
          pricesByDate.push(arrayPrecios[i].close);
          categoriesMenu.push(formatDate(new Date(arrayPrecios[i].date)))
        }
        pricesByDate.push(arrayPrecios[arrayPrecios.length - 1].close);
        categoriesMenu.push(d_last)
      }
      else {
        let long = Math.round(arrayPrecios.length / 5)
        categoriesMenu.push(d_first)
        pricesByDate.push(arrayPrecios[0].close);
        for(let i = 1; i < arrayPrecios.length - 1; i+=long) {
          pricesByDate.push(arrayPrecios[i].close);
          categoriesMenu.push(formatDate(new Date(arrayPrecios[i].date)))
        }
        pricesByDate.push(responsePrice.data.data[responsePrice.data.data.length - 1].close);
        categoriesMenu.push(d_last)
      }
      
      this.seriesLineChart[0].data.push(0)
      for(let i = 1; i < pricesByDate.length; i++) {
        
        for(let j = 0; j < this.infoTransactions.length; j++) {
          if(this.infoTransactions[j].stockID === this.id) {
              if(this.infoTransactions[j].date >= categoriesMenu[i]) {
                let oldTotalQuantity = totalQuantity
                totalQuantity += this.infoTransactions[j].quantity
                if(buyPriceAtTheMoment === 0) buyPriceAtTheMoment = this.infoTransactions[j].buyPrice
                else {
                  buyPriceAtTheMoment = ((buyPriceAtTheMoment * oldTotalQuantity) + (this.infoTransactions[j].buyPrice * this.infoTransactions[j].quantity)) / totalQuantity
                }
              }
          }
        }

        let rent = (((pricesByDate[i] - buyPriceAtTheMoment) / buyPriceAtTheMoment) * 100).toFixed(2);
        this.seriesLineChart[0].data.push(rent)
      }

      let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY
      for(let i in this.seriesLineChart[0].data) {
        min = Math.min(this.seriesLineChart[0].data[i], min)
        max = Math.max(this.seriesLineChart[0].data[i], max)
      }

      this.chartOptionsLineChart.yaxis.min = min
      this.chartOptionsLineChart.yaxis.max = max

      this.chartOptionsLineChart.xaxis.categories = categoriesMenu;
      this.showLineChart = true;
    },
    async getData() {
      try {
        let hashClient = this.$cookies.get("Session");
        this.info = JSON.parse(localStorage.getItem("info"));
        this.infoFinances = JSON.parse(localStorage.getItem("infoFinances"));
        this.infoTransactions = JSON.parse(
          localStorage.getItem("infoTransactions")
        );

        if (this.infoTransactions === null) {
          let response = await axios.get(
            this.backURL + "client/showTransactions/" + hashClient
          );
          this.infoTransactions = response.data;
          localStorage.setItem(
            "infoTransactions",
            JSON.stringify(this.infoTransactions)
          );
        }

        if (this.info === null || this.infoFinances === null) {
          this.info = JSON.parse(localStorage.getItem("info"));
          this.infoFinances = JSON.parse(localStorage.getItem("infoFinances"));
          let response = await axios.get(
            this.backURL + "client/showPortfolio/" + hashClient
          );
          this.info = response.data;
          localStorage.setItem("info", JSON.stringify(this.info));

          let promises = [];

          for (let index in this.info) {
            let options = {
              method: "GET",
              url: "https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote",
              params: { symbols: index },
              headers: {
                "x-rapidapi-host":
                  "stock-data-yahoo-finance-alternative.p.rapidapi.com",
                "x-rapidapi-key": this.apiKey,
              },
            };

            promises.push(
              axios
                .request(options)
                .then((response) => {
                  this.infoFinances[index] = response.data;
                  return response.data;
                })
                .catch(() => {
                  this.showWarningModal(this.errorMSG);
                })
            );
            await new Promise((r) => setTimeout(r, 300));
          }

          localStorage.setItem(
            "infoFinances",
            JSON.stringify(this.infoFinances)
          );

          Promise.all(promises)
            .then(() => {})
            .catch(() => {
              this.showWarningModal(this.errorMSG);
            });
        }

        let options = {
          method: "GET",
          url:
            "https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v11/finance/quoteSummary/" +
            this.id,
          params: {
            modules:
              "assetProfile,financialData,recommendationTrend,incomeStatementHistory",
          },
          headers: {
            "x-rapidapi-host":
              "stock-data-yahoo-finance-alternative.p.rapidapi.com",
            "x-rapidapi-key": this.apiKey,
          },
        };
        let responseStockInfo = await axios.request(options);
        this.infoStock =
          responseStockInfo.data.quoteSummary.result[0].assetProfile;
        this.infoRecommendationStock =
          responseStockInfo.data.quoteSummary.result[0];
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
        document.querySelector(".errorDiv").style.display = "block";
        return;
      }

      try {
        let responseForPic = await axios.get(
          "https://api.polygon.io/v3/reference/tickers/" +
            this.id +
            "?apikey=" +
            this.apiKeyForImage
        );
        let responseNews = await axios.get(
          "https://api.polygon.io/v2/reference/news?ticker=" +
            this.id +
            "&limit=5&apiKey=" +
            this.apiKeyForImage
        );

        if (responseForPic.data.status !== "NOT_FOUND") {
          this.img = responseForPic.data.results;
        }
        if (responseNews.data.status !== "NOT_FOUND") {
          this.news = responseNews.data.results;
        }
        this.getRecommendationData();
        this.showView = true;
      } catch (err) {
        this.getRecommendationData();
        this.showView = true;
        console.log(err);
      }
    },
    showWarningModal(message) {
      this.$bvModal.show("modal");
      this.modal.message = message;
      this.modal.title = "¡Operación Fallida!";
      this.modal.variant = "warning";
    },
    load: function (args) {
      let selectedTheme = location.hash.split("/")[1];
      selectedTheme = selectedTheme ? selectedTheme : "Material";
      args.chart.theme = (
        selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
      )
        .replace(/-dark/i, "Dark")
        .replace(/contrast/i, "Contrast");
    },
    getLast4Months() {
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      var today = new Date();
      var last4Months = [];

      for (let i = 0; i < 4; i++) {
        if (today.getMonth() - i < 0) {
          last4Months.unshift(monthNames[today.getMonth() - i + 12]);
        } else {
          last4Months.unshift(monthNames[today.getMonth() - i]);
        }
      }
      return last4Months;
    },

    async getRecommendationData() {
      this.chartOptions.xaxis.categories = this.getLast4Months();

      try {
        //series[0].data son los valores de strongSell
        for (let i = 0; i < 4; i++) {
          this.series[0].data.unshift(
            this.infoRecommendationStock.recommendationTrend.trend[i].strongSell
          );
        }

        //series[1].data son los valores de sell
        for (let i = 0; i < 4; i++) {
          this.series[1].data.unshift(
            this.infoRecommendationStock.recommendationTrend.trend[i].sell
          );
        }

        //series[2].data son los valores de hold
        for (let i = 0; i < 4; i++) {
          this.series[2].data.unshift(
            this.infoRecommendationStock.recommendationTrend.trend[i].hold
          );
        }

        //series[3].data son los valores de buy
        for (let i = 0; i < 4; i++) {
          this.series[3].data.unshift(
            this.infoRecommendationStock.recommendationTrend.trend[i].buy
          );
        }

        //series[4].data son los valores de strongBuy
        for (let i = 0; i < 4; i++) {
          this.series[4].data.unshift(
            this.infoRecommendationStock.recommendationTrend.trend[i].strongBuy
          );
        }
        this.showRecommendationGraph = true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.titleStock {
  display: flex;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: 40px;
}

.detailPage {
  text-align: left;
  padding: 30px;
}

.stockDescription {
  padding-top: 25px;
}

a {
  color: black;
  text-decoration: none;
}

.errorDiv {
  display: none;
  padding: 35px;
}

hr {
  border: none;
  height: 1px;
  color: #333;
  background-color: #333;
}

.imgNews {
  height: 150px;
  width: 200px;
  margin: 20px;
}

.newsText {
  font-size: 15px;
  margin-top: 20px;
}

.linkNews {
  color: rgba(54, 107, 157, 0.74);
}

.itemNews {
  display: flex;
}
</style>
