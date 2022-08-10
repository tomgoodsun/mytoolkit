<template>
  <b-row>
    <b-col col lg="6" md="12" sm="12">
      <b-form-group id="input-group-min" label="Min Length:" label-for="min-exclude">
        <b-form-input
          id="min-exclude"
          name="min-exclude"
          v-model="minLength"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-max" label="Max Length:" label-for="max-exclude">
        <b-form-input
          id="max-exclude"
          name="max-exclude"
          v-model="maxLength"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-settings" label="Setting:" label-for="settings">
        <b-form-checkbox
          v-for="form in forms"
          v-model="checked"
          :key="form.id"
          :value="form.id"
          name="settings"
        >
          {{ form.name }}
        </b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-exclude" label="Exclude Chars:" label-for="exclude">
        <b-form-input
          id="exclude"
          name="exclude"
          v-model="excludeChars"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-num" label="Sampling Num:" label-for="num">
        <b-form-input
          id="num"
          name="num"
          v-model="samplingNum"
        ></b-form-input>
      </b-form-group>

      <b-button variant="outline-primary" name="generate" @click="generate()">Generate</b-button>

    </b-col>
    <b-col col lg="6" md="12" sm="12">
      <h3>Password Results</h3>
      <h4>
        Drawn
        <b-button
          variant="primary"
          size="sm"
          name="generate"
          @click="draw()"
        >
          Draw from results
        </b-button>
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#drawn-result"
          title="Copy to clipboard"
        >
          <b-icon icon="clipboard" aria-hidden="true"></b-icon> Copy
        </b-button>
        <b-button variant="light" size="sm" class="stock" @click="stock()">Stock</b-button>
      </h4>
      <div id="drawn-result">
        {{ drawnPassword }}
      </div>
      <h4>Generated</h4>
      <div id="result-area">
        <ul id="result">
          <li
           v-for="password in passwords"
           v-bind:key="password.id"
           v-bind:class="{'is-selected': password.isSelected}"
           class="password"
          >
            {{ password.password }}
          </li>
        </ul>
      </div>

      <h4>
        Stock
        <b-button
          variant="light"
          size="sm"
          class="clipboard"
          data-clipboard-target="#password-stocker"
          title="Copy to clipboard"
        >
          <b-icon icon="clipboard" aria-hidden="true"></b-icon> Copy
        </b-button>
        <b-button
          variant="light"
          size="sm"
          class="clear-stock"
          @click="clearStock()"
        >
          Clear
        </b-button>
      </h4>

      <b-form-textarea
        id="password-stocker"
        v-model="$data.stockedPasswords"
        readonly
      ></b-form-textarea>
     </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import {
  BootstrapVue,
  ButtonPlugin,
  FormCheckboxPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  BFormTextarea,
  LayoutPlugin
} from 'bootstrap-vue';
import Clipboard from 'clipboard';

Vue.use(ButtonPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormPlugin);

var generator = require('generate-password');

export default {
  data() {
    return {
      forms: [
        {id: 'length', name: 'Length'},
        {id: 'numbers', name: 'Include Numbers'},
        {id: 'symbols', name: 'Include Symbols'},
        {id: 'excludeSimilarCharacters', name: 'Exclude Similar Chars'},
        {id: 'exclude', name: 'Exclude'},
        {id: 'strict', name: 'Strict'},
      ],
      checked: [
        'length',
        'numbers',
        'symbols',
        'excludeSimilarCharacters',
        'exclude',
        'strict',
      ],
      minLength: 6,
      maxLength: 10,
      excludeChars: '',
      samplingNum: 100,
      passwords: [],
      drawnPassword: '',
      stockedPasswords: '',
    };
  },
  mounted() {
    new Clipboard('.clipboard');
  },
  updated() {
    let resultAreaElem = this.$el.querySelector('#result-area'),
      resultElem = this.$el.querySelector('#result'),
      selectedElem = this.$el.querySelector('#result .is-selected');
    resultAreaElem.scrollTop = 0;

    if (selectedElem) {
      let parentPos = resultElem.getBoundingClientRect(),
        childPos = selectedElem.getBoundingClientRect(),
        relativePos = {};

      relativePos.top = childPos.top - parentPos.top,
      relativePos.right = childPos.right - parentPos.right,
      relativePos.bottom = childPos.bottom - parentPos.bottom,
      relativePos.left = childPos.left - parentPos.left;

      resultAreaElem.scrollTop = relativePos.top;
    }
  },
  methods: {
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generate() {
      this.drawnPassword = '';
      let passwords = [];
      let options = {};

      this.forms.forEach(function (currentValue) {
        options[currentValue] = false;
      });
      this.checked.forEach(function (currentValue) {
        options[currentValue] = true;
      });
      options.exclude = this.excludeChars;

      for (let i = 0; i < this.samplingNum; i++) {
        options.length = this.getRandomInt(this.minLength, this.maxLength);
        passwords.push({
          id: i,
          password: generator.generate(options),
          isSelected: false
        });
      }
      this.passwords = passwords;
    },
    draw() {
      if (this.passwords.length > 0) {
        for (let i = 0; i < this.passwords.length; i++) {
          this.passwords[i].isSelected = false;
        }
        let index = this.getRandomInt(0, this.passwords.length - 1);
        this.passwords[index].isSelected = true;
        this.drawnPassword = this.passwords[index].password;
      }
    },
    stock() {
      if (this.drawnPassword.length > 0) {
        let stockedPasswords = this.stockedPasswords.split('\n');
        if (stockedPasswords.includes(this.drawnPassword)) {
          alert('This word is already stocked.');
          return;
        }
        this.stockedPasswords += this.drawnPassword + '\n';
        let stocker = this.$el.querySelector('#password-stocker');
        stocker.scrollTop = stocker.scrollHeight;
      }
    },
    clearStock() {
      this.stockedPasswords = '';
    }
  },
  components: {
    BFormTextarea
  }
}
</script>

<style>
#result-area {
  border: 1px solid #eee;
  height: 200px;
  margin-bottom: 10px;
  min-height: 100px;
  overflow-y: scroll;
}
#result {
  list-style: none;
  margin: 0;
  padding: 0;
}
#drawn-result,
#result .password {
  background: #eee;
  color: #666;
  display: inline-block;
  font: 12px Monaco, monospace;
  margin: 3px 2px 3px 2px;
  padding: 3px 5px 3px 5px;
}
#result .is-selected {
  background: #666;
  color: #eee;
}

#drawn-result {
  display: block;
  font-size: 30px;
  height: 1.5em;
  min-height: 1.5em;
  text-align: center;
}
#password-stocker {
  font-family: Monaco, monospace;
  font-size: 100%;
  height: 100px;
  min-height: 100px;
}
</style>
