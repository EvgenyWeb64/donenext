import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DayView from '../views/DayView.vue';

// createWebHashHistory — используем hash режим (#/)
// это важно для GitHub Pages, там нет серверного роутинга
// URL будет выглядеть так: mysite.com/#/day/2024-01-15
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: HomeView,
        },
        {
            path: '/day/:date', // :date — динамический параметр маршрута
            component: DayView,
        },
    ],
});

export default router;
