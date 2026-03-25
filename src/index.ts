import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './styles/global.scss';

$(async () => {
  await waitUntil(() => typeof getVariables === 'function');
  await waitUntil(() => typeof Mvu !== 'undefined' || typeof getVariables === 'function');
  createApp(App).use(createPinia()).mount('#app');
});
