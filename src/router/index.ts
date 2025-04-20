import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'root',
		component: () => import(/* webpackChunkName: "home" */ '@/AppLayout.vue'),
		children: [
			{
				path: '',
				name: 'Home',
				component: () =>
					import(/* webpackChunkName: "home" */ '@/views/home/HomeView.vue'),
			},
			{
				path: '/instructions',
				name: 'Instrucciones',
				component: () =>
					import(/* webpackChunkName: "home" */ '@/views/instructions/InstructionsView.vue'),
			},
			{
				path: '/esiosData',
				name: 'EsiosData',
				component: () =>
					import(/* webpackChunkName: "home" */ '@/views/data/EsiosData.vue'),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
