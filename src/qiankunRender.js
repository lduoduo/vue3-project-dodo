// import Vue from 'vue/dist/vue.esm-browser';
import { createApp } from 'vue';

function vueRender({ loading }) {
  return createApp({
    template: `
      <div id="subapp-container">
        <h4 v-if="loading" class="subapp-loading">Loading...</h4>
        <div id="subapp-viewport"></div>
      </div>
    `,
    el: '#third',
    data() {
      return {
        loading
      };
    }
  });
}

let app = null;

export default function render({ loading }) {
  if (!app) {
    app = vueRender({ loading });
  } else {
    app.loading = loading;
  }
}
