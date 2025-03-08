export const fetchPVPCData = async (fecha: string): Promise<any> => {

  const token = 'YOUR_API_TOKEN'; // Reemplaza con tu token de acceso
  //const url = `https://api.esios.ree.es/indicators/1001?start_date=${startDate}&end_date=${endDate}`;
  const url = `https://api.esios.ree.es/archives/70/download_json?locale=es&date=${fecha}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Token token="${token}"`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

    const data = await response.json();
    return data;
};

// Ejemplo de uso
// const startDate = '2025-03-01T00:00:00Z';
// const endDate = '2025-03-02T23:59:59Z';

// fetchPVPCData(startDate, endDate)
//   .then(data => {
//     console.log('PVPC Data:', data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });