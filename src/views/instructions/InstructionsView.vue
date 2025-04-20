<template>
	<v-container>
	<h1 class="text-h3">Instrucciones</h1>

	<v-divider :thickness="6"></v-divider>

	<ul>
		<li class="text-h4">Para que sirve esta herramienta</li>
		<p>Esta heramienta te permite controlar tu consumo de energía visualizándolo graficamente</p>
		<p>Podrás ver:</p>
		<ul style="list-style-type: disc; padding-left: 4%;">
			<li>Tu consumo total por día y mes (Por día y por horas)</li>
			<li>El consumo máximo y mínimo por día y mes</li>
			<li>Tu gasto total por día y mes (Por día y por horas)</li>
			<li>El precio medio por día y mes</li>
			<li>El precio máximo y mínimo por día y mes</li>
		</ul>
		<v-divider :thickness="6"></v-divider>
		<li class="text-h4">1. Obtener datos de DataDis</li>
		<p>DataDis es un servicio que te permite descargar los datos de los consumos eléctricos de todos tus contratos.</p>
		<h5 class="text-h5">¿Que es Datadis?</h5>
		<p>Datadis es una plataforma para acceso a los datos eléctricos creado por las empresas distribuidoras</p>
		<p>Para obtener los datos de consumo, puedes descargarlos desde la página de <a href="https://datadis.es/login" target="_blank">DataDis</a></p>
		<h5 class="text-h5">¿Cómo se descargan los datos?</h5>
		<ol style="padding-left: 4%; list-style-type: decimal;">
			<li>Accede a la página de <a href="https://datadis.es/login" target="_blank">DataDis</a> e inicia sesión con tus credenciales.</li>
			<li>Selecciona el contrato del cual deseas obtener los datos.</li>
			<p>En la sección "Mis Suministros", podrás ver una lista de tus contratos registrados.</p>
			<img src="/img/MisSuministros.png" alt="Mis Suministros"/>
			<li>Selecciona tu contrato, pulsa en el botón <b>Preparar descarga</b> y selecciona el rango de fechas deseado.</li>
			<div style="width: 50%; height: 50%;"><img src="/img/PrepararLaDescarga.png" alt="Preparar descarga"/></div>
			
			<li>Descarga el archivo en formato JSON.</li>
			<p>Dirígete al centro de descargas, espera a que termine de procesas y descarga el fichero generado.</p>
			<img src="/img/CentroDeDescargas.png" alt="Centro de descargas"/>
			<li>Importa el fichero descargado en esta herramienta <a href="/">ConsumoPVPC</a>.</li>
		</ol>
		<v-divider :thickness="6"></v-divider>
		<li class="text-h4">2. Mostrar tu consumo</li>
		<p>Una vez descargado el fichero, podrás importarlo en la herramienta.</p>
		<p>Para ello, dirígete a la sección de <b>Importar</b> y selecciona el fichero descargado.</p>
		<p>Una vez importado, podrás visualizar los datos de consumo con distintos criterios y de una forma gráfica.</p>
		<v-divider :thickness="6"></v-divider>
		<li class="text-h4">3. Calcular tu gasto</li>
		<p>Una vez importado el fichero, en el apartado de <b>Cálculo de gasto</b> podrás seleccionar un intervalo de fechas y la región de tu facturación.</p>
		<p>Con ello se calculará el gasto a partir de tus consumos y el precio por hora obtenido de datos de Esios.</p>
		<v-divider :thickness="6"></v-divider>
		<li class="text-h4">4. Visualiza los datos descargados de Esios</li>
		<p>En el apartado de Datos de Esios, podrás gestionar los datos almacenados en la caché del navegador.</p>
		<p>Estos datos se almacenan para ahorrar carga a los servidores de Esios, además de mejorar los tiempos de carga de consultas futuras de datos repetitivos.</p>
	</ul>
</v-container>
</template>

<style lang="css" scoped>
ul {
  padding: 2%;
}
.text-h4 {
  margin-bottom: 2%;
}
.text-h5 {
	margin-top: 2%;
  margin-bottom: 2%;
}
</style>