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
					{{ link.text }}
				</router-link>
			</nav>
		</v-container>
	</v-app-bar>
</template>

<script lang="ts" setup>
const navLinks = [
	{ to: '/', text: 'Inicio', icon: 'mdi-home-outline' },
	{ to: '/instructions', text: 'Instrucciones', icon: 'mdi-book-open-outline' },
	{ to: '/esiosData', text: 'Datos ESIOS', icon: 'mdi-database-outline' },
];
</script>

<style scoped>
.navbar-modern {
	background: rgba(255, 255, 255, 0.95) !important;
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.navbar-brand {
	display: flex;
	align-items: center;
	text-decoration: none;
	color: #1e293b;
	font-weight: 700;
	transition: opacity 0.2s ease;
}

.navbar-brand:hover {
	opacity: 0.8;
}

.navbar-brand .v-icon {
	color: #2563eb;
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
	color: #64748b;
	font-weight: 500;
	font-size: 0.9rem;
	border-radius: 8px;
	transition: all 0.2s ease;
}

.nav-link:hover {
	color: #2563eb;
	background: rgba(37, 99, 235, 0.08);
}

.nav-link-active {
	color: #2563eb;
	background: rgba(37, 99, 235, 0.12);
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
