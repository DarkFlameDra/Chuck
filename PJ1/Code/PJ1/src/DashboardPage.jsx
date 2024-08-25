import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardPage.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

function DashboardPage() {
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState({});
  const [barData, setBarData] = useState({});

  useEffect(() => {
    fetch('/data/taladrod-cars.json')
      .then(response => response.json())
      .then(data => {
        const { Cars, MMList } = data;
        const summaryData = {};
        const brandCount = {};
        const brandModels = {};

        Cars.forEach(car => {
          const brand = MMList.find(m => m.mkID === car.MkID)?.Name || 'Unknown';
          if (!summaryData[brand]) {
            summaryData[brand] = {
              totalCars: 0,
              totalValue: 0,
              models: {}
            };
            brandModels[brand] = {
              labels: [],
              data: []
            };
          }

          summaryData[brand].totalCars += 1;
          summaryData[brand].totalValue += parseFloat(car.Prc.replace(/,/g, ''));

          const modelKey = car.Model;
          if (!summaryData[brand].models[modelKey]) {
            summaryData[brand].models[modelKey] = { count: 0, value: 0 };
          }

          summaryData[brand].models[modelKey].count += 1;
          summaryData[brand].models[modelKey].value += parseFloat(car.Prc.replace(/,/g, ''));

          brandCount[brand] = (brandCount[brand] || 0) + 1;

          if (!brandModels[brand].labels.includes(modelKey)) {
            brandModels[brand].labels.push(modelKey);
          }
          brandModels[brand].data.push(summaryData[brand].models[modelKey].count);
        });

        setSummary(Object.entries(summaryData));

        const pieData = {
          labels: Object.keys(brandCount),
          datasets: [
            {
              data: Object.values(brandCount),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#E7E9ED',
                '#76D7C4',
                '#F7DC6F',
                '#A569BD'
              ],
            },
          ],
        };

        setChartData(pieData);

        const barChartData = Object.keys(brandModels).map(brand => ({
          label: brand,
          data: brandModels[brand].data,
          backgroundColor: getRandomColor()
        }));

        const maxYValue = Math.max(...Object.values(brandModels).flatMap(model => model.data)) * 1.1; // Add 10% margin

        setBarData({
          labels: brandModels[Object.keys(brandModels)[0]]?.labels || [],
          datasets: barChartData,
          maxYValue: maxYValue
        });
      })
      .catch(error => console.error('Error fetching the car data:', error));
  }, []);

  function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
  }

  if (!summary.length || !chartData.labels || !barData.labels) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="mb-4">Dashboard</h1>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Number of Cars</th>
              <th>Total Value (Baht)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(([brand, details]) => (
              <React.Fragment key={brand}>
                <tr>
                  <td rowSpan={Object.keys(details.models).length + 1}>{brand}</td>
                  <td colSpan="3">Total: {details.totalCars} cars, {details.totalValue.toLocaleString()} Baht</td>
                </tr>
                {Object.entries(details.models).map(([model, modelDetails]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td>{modelDetails.count}</td>
                    <td>{modelDetails.value.toLocaleString()} Baht</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <h2>Car Distribution by Brand</h2>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const label = tooltipItem.label || '';
                    const value = tooltipItem.raw;
                    return `${label}: ${value}`;
                  },
                },
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>

      <div className="chart-container">
        <h2>Model Distribution by Brand</h2>
        <Bar
          data={barData}
          options={{
            plugins: {
              legend: {
                position: 'top',
              },
              datalabels: {
                display: true,
                color: '#fff',
                anchor: 'end',
                align: 'top',
              },
            },
            scales: {
              x: {
                stacked: true,
                ticks: {
                  maxRotation: 90,
                  minRotation: 0,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                max: barData.maxYValue,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
