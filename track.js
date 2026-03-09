import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const glowPlugin = {
  id: 'glowPlugin',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const activeElements = chart.getActiveElements();

    if (activeElements.length === 0) return;

    ctx.save();
    activeElements.forEach(({ datasetIndex, index }) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      const bar = meta.data[index];
      const backgroundColor =
        chart.data.datasets[datasetIndex].backgroundColor[index];

      ctx.shadowColor = backgroundColor;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = -1;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(bar.x - bar.width / 2, bar.y, bar.width, bar.base - bar.y);
    });
    ctx.restore();
  },
};

Chart.register(glowPlugin);

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('myChart');

  const xValues = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const yValues = [2900, 3150, 2400, 1500, 2212, 3322, 3000];
  const barColors = [
    '#aa91d9',
    '#9966FF',
    '#6702bf',
    '#4e04c4',
    '#522999',
    '#441366',
    '#300659',
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xValues,
      datasets: [
        {
          label: 'Calories Burned',
          data: yValues,
          backgroundColor: barColors,
          hoverBackgroundColor: barColors.map((c) => `${c}CC`),
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: true,
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Calories Burned Per Day',
          font: {
            size: 20,
            family: 'Stick No Bills, sans-serif',
            style: 'normal',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    plugins: ['glowPlugin'],
  });
});
