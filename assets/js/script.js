// https://mindicador.cl/api
// https://mindicador.cl/api/dolar
// https://mindicador.cl/api/uf
// https://mindicador.cl/api/euro

let data;
let moneda;
let valor;
let myChart;
let simboloMoneda;

//Llamada a la API
async function obtenerDatos(){
        try {
                const res = await fetch('https://mindicador.cl/api');
                data = await res.json();
                return data;
        } catch (error) {
                document.querySelector('#resultado').innerHTML=`<span class="cls-error"> Error al consultar datos </span>`;
        }
}

async function convertirValor (){
        try {
                valor = document.querySelector('#valor').value;
                moneda = document.querySelector('#moneda').value;
                //Simbolo de las monedas
                switch (moneda){
                        case 'uf': simboloMoneda='UF';
                        break;
                        case 'dolar': simboloMoneda='$';
                        break;
                        case 'euro': simboloMoneda='€';
                        break;
                default:
                        break;
                }
                //Carga de datos en DATA
                const data = await obtenerDatos();
                //Modificamos el endpoint para obtener datos para el grafico
                const valorConvertido = valor / data[moneda].valor;
                document.querySelector('#resultado').innerHTML=`<span> Resultado: ${simboloMoneda} ${valorConvertido.toFixed(2)}</span>`;
                //Metodo para generar el grafico
                crearGrafico(moneda);
        } catch (error) {
                //En caso de error muestra mensaje en el DOM
                document.querySelector('#resultado').innerHTML=`<span class="cls-error"> Error al convertir monto </span>`;
        }
}

// Función para crear el gráfico
async function crearGrafico(moneda) {
        try {
                 //API con la moneda para obtener los valores
                const res = await fetch(`https://mindicador.cl/api/${moneda}`);

                const data = await res.json();

                // Extraer las fechas y los valores de la moneda filtrada
                const fechas = data.serie.map(item => item.fecha.split('T')[0]);
                const valores = data.serie.map(item => item.valor);

                // Tomar solo los últimos 10 valores
                const diezFechas = fechas.slice(0, 10).reverse();
                const diezValores = valores.slice(0, 10).reverse();

                const ctx = document.querySelector('#grafMonedas');

                // Destruir la instancia previa antes de crear la nueva
                if (myChart) {
                        myChart.destroy();
                }

                myChart = new Chart(ctx, {
                type: 'line',
                data: {
                        labels: diezFechas,
                        datasets: [{
                                label: `Valor de la moneda ${moneda}`,
                                data: diezValores,
                                borderColor: 'rgba(255, 0, 0, 1)',
                                borderWidth: 1,
                                //     fill: false
                                pointBackgroundColor: 'rgba(255, 255, 0, 1)',   //amarillo
                                pointBorderColor: 'rgba(255, 255, 0, 1)'        //amarillo
                                }]
                },
                options: {
                        responsive:true,
                        scales: {
                        x: {
                                beginAtZero: false
                        },
                        y: {
                                beginAtZero: false
                        }
                        }
                }
                });
        } catch (error) {
                //En caso de error muestra mensaje en el DOM
                document.querySelector('#resultado').innerHTML=`<span class="cls-error"> Error al convertir monto </span>`;
        }
}

obtenerDatos();