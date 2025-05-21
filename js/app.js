new Vue({
  el: '#app',
  data: {
    started: false,
    isWeighing: false,
    currentLoadLeft: 0,
    currentLoadRight: 0,
    axles: [],
    simInterval: null
  },
  computed: {
    totalWeight() {
      return this.axles.reduce((sum, axle) => sum + axle.total, 0);
    }
  },
  methods: {
    startMeasurement() {
      this.started = true;
      this.axles = [];
      this.currentLoadLeft = 0;
      this.currentLoadRight = 0;

      this.simInterval = setInterval(() => {
        this.currentLoadLeft = this.generateLoad();
        this.currentLoadRight = this.generateLoad();
      }, 3000);
    },
    endMeasurement() {
      this.started = false;
      this.isWeighing = false;
      clearInterval(this.simInterval);
    },
    async registerAxle() {
      this.isWeighing = true;
      clearInterval(this.simInterval);
      await this.simulateWeighing(3000);

      const left = this.currentLoadLeft;
      const right = this.currentLoadRight;

      this.axles.push({
        left,
        right,
        total: left + right
      });

      this.simInterval = setInterval(() => {
        this.currentLoadLeft = this.generateLoad();
        this.currentLoadRight = this.generateLoad();
      }, 3000);

      this.isWeighing = false;
    },
    generateLoad() {
      return Math.floor(Math.random() * 2000 + 1000); // 1000 a 3000 kg
    },
    simulateWeighing(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    downloadJSON() {
      const data = {
        timestamp: new Date().toISOString(),
        eixos: this.axles,
        total: this.totalWeight
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pesagem_estatica_' + Date.now() + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
});
