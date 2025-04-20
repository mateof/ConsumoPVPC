<template>
	<v-app-bar density="compact" color="primary" flat class="text-white px-10">
		<v-btn data-testid="button">
			<router-link to="/"> Inicio </router-link>
		</v-btn>
		<v-btn>
			<router-link to="/instructions"> Instrucciones </router-link>
		</v-btn>
		<v-btn>
			<router-link to="/esiosData"> Datos de Esios </router-link>
		</v-btn>
	</v-app-bar>
</template>
