import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Registering components including Title for better accessibility
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function DoughnutChart({ data }) {
  // --- CUSTOM CONFIGURATION ---
  const options = {
    cutout: "75%", // Makes the ring thinner and "premium"
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
          color: "#64748b", // var(--text-muted)
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 10,
        displayColors: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  // --- CENTER TEXT PLUGIN ---
  // This draws text (like "Assets") in the empty center of the doughnut
  const plugins = [{
    beforeDraw: function(chart) {
      var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
      ctx.restore();
      var fontSize = (height / 160).toFixed(2);
      ctx.font = fontSize + "em 'Inter', sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#94a3b8"; // Muted label color
      
      var text = "Allocation",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2.4; // Slightly above center
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }];

  return (
    <div style={styles.chartWrapper}>
      <Doughnut data={data} options={options} plugins={plugins} />
    </div>
  );
}

const styles = {
  chartWrapper: {
    position: "relative",
    height: "320px", // Fixed height to prevent layout jumps
    width: "100%",
    padding: "10px",
  }
};