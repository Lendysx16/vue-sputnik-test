import Main from './Main.vue';
import './style.scss';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const app = createApp(Main);

const router = createRouter({
    history: createWebHistory(import.meta.env.APP_URL),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: () => import('./App.vue'),
            props: (route) => ({ query: route.query }),
        },
    ],
});

app.use(router);

app.mount('#app');
