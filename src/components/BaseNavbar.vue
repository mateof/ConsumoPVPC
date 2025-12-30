<template>
	<v-app-bar elevation="0" class="navbar-modern">
		<v-container class="d-flex align-center py-0">
			<!-- Logo / Titulo -->
			<router-link to="/" class="navbar-brand">
				<v-icon size="28" class="mr-2">mdi-lightning-bolt</v-icon>
				<span class="brand-text">Consumo PVPC</span>
			</router-link>

			<v-spacer></v-spacer>

			<!-- Navigation Links -->
			<nav class="navbar-links">
				<router-link
					v-for="link in navLinks"
					:key="link.to"
					:to="link.to"
					class="nav-link"
					active-class="nav-link-active"
				>
					<v-icon size="20" class="mr-1">{{ link.icon }}</v-icon>
					<span>{{ link.text }}</span>
				</router-link>
			</nav>

			<!-- Theme Toggle -->
			<v-btn
				icon
				variant="text"
				class="theme-toggle ml-2"
				@click="toggleTheme"
				:title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
			>
				<v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
			</v-btn>
		</v-container>
	</v-app-bar>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify';
import { computed, onMounted } from 'vue';

const THEME_STORAGE_KEY = 'consumo-pvpc-theme';

const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
	const newTheme = isDark.value ? 'myCustomLightTheme' : 'myCustomDarkTheme';
	theme.global.name.value = newTheme;
	localStorage.setItem(THEME_STORAGE_KEY, newTheme);
};

onMounted(() => {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	if (savedTheme && (savedTheme === 'myCustomLightTheme' || savedTheme === 'myCustomDarkTheme')) {
		theme.global.name.value = savedTheme;
	}
});

const navLinks = [
	{ to: '/', text: 'Inicio', icon: 'mdi-home-outline' },
	{ to: '/instructions', text: 'Instrucciones', icon: 'mdi-book-open-outline' },
	{ to: '/esiosData', text: 'Datos ESIOS', icon: 'mdi-database-outline' },
];
</script>

<style scoped>
.navbar-modern {
	background: rgba(var(--v-theme-surface), 0.95) !important;
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.navbar-brand {
	display: flex;
	align-items: center;
	text-decoration: none;
	color: rgb(var(--v-theme-on-surface));
	font-weight: 700;
	transition: opacity 0.2s ease;
}

.navbar-brand:hover {
	opacity: 0.8;
}

.navbar-brand .v-icon {
	color: rgb(var(--v-theme-primary));
}

.brand-text {
	font-size: 1.25rem;
	letter-spacing: -0.5px;
}

.navbar-links {
	display: flex;
	gap: 0.5rem;
}

.nav-link {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	text-decoration: none;
	color: rgba(var(--v-theme-on-surface), 0.7);
	font-weight: 500;
	font-size: 0.9rem;
	border-radius: 8px;
	transition: all 0.2s ease;
}

.nav-link:hover {
	color: rgb(var(--v-theme-primary));
	background: rgba(var(--v-theme-primary), 0.08);
}

.nav-link-active {
	color: rgb(var(--v-theme-primary));
	background: rgba(var(--v-theme-primary), 0.12);
}

.theme-toggle {
	color: rgba(var(--v-theme-on-surface), 0.7);
	transition: all 0.2s ease;
}

.theme-toggle:hover {
	color: rgb(var(--v-theme-primary));
	background: rgba(var(--v-theme-primary), 0.08);
}

@media (max-width: 600px) {
	.brand-text {
		display: none;
	}

	.nav-link span {
		display: none;
	}

	.nav-link {
		padding: 0.5rem;
	}
}
</style>
