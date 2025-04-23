document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("regionSelect");
    const ctx = document.getElementById("chart1").getContext("2d");
    let chart;
  
    fetch("data.json")
      .then(res => res.json())
      .then(data => {
        const regiones = [...new Set(data.map(d => d.region))];
  
        regiones.forEach(region => {
          const option = document.createElement("option");
          option.value = region;
          option.textContent = region;
          select.appendChild(option);
        });
  
        select.addEventListener("change", () => {
          const seleccionadas = Array.from(select.selectedOptions).map(opt => opt.value);
          const fechas = [...new Set(data.map(d => d.fecha))].sort();
  
          const datasets = seleccionadas.map(region => {
            const datos = fechas.map(fecha => {
              const entrada = data.find(d => d.region === region && d.fecha === fecha);
              return entrada ? parseInt(entrada.confirmados) : 0;
            });
  
            return {
              label: region,
              data: datos,
              borderWidth: 2,
              fill: false
            };
          });
  
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: fechas,
              datasets: datasets
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Comparación de Regiones por Fecha' }
              }
            }
          });
        });
      });
  });
  