import React, { useRef, useEffect, useCallback } from "react";

/**
 * Canvas-based chart components for data visualization.
 * No external charting library needed — pure HTML5 Canvas.
 */

// Color palette for charts
const COLORS = {
  primary: "#059669",
  secondary: "#0ea5e9",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#8b5cf6",
  grid: "#e5e7eb",
  text: "#6b7280",
  line1: "#059669",
  line2: "#0ea5e9",
  line3: "#f59e0b",
  area1: "rgba(5, 150, 105, 0.15)",
  area2: "rgba(14, 165, 233, 0.15)",
};

// ==================== LINE CHART ====================
export function LineChart({ data = [], labels = [], title = "", height = 250, color = COLORS.line1, areaColor = COLORS.area1, showDots = true, showArea = true, ylabel = "" }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...data) * 1.1 || 1;
    const minVal = Math.min(0, Math.min(...data) * 0.9);
    const range = maxVal - minVal;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = COLORS.text;
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      const val = maxVal - (range / 5) * i;
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + "k" : val.toFixed(1), padding.left - 5, y + 4);
    }

    // Y-axis label
    if (ylabel) {
      ctx.save();
      ctx.fillStyle = COLORS.text;
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.translate(12, padding.top + chartH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(ylabel, 0, 0);
      ctx.restore();
    }

    // Data points
    const points = data.map((val, i) => ({
      x: padding.left + (chartW / Math.max(1, data.length - 1)) * i,
      y: padding.top + chartH - ((val - minVal) / range) * chartH,
    }));

    // Area fill
    if (showArea && points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = areaColor;
      ctx.fill();
    }

    // Line
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i - 1].x + points[i].x) / 2;
        const yc = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Dots
    if (showDots) {
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // X-axis labels
    if (labels.length > 0) {
      ctx.fillStyle = COLORS.text;
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "center";
      const step = Math.max(1, Math.floor(labels.length / 8));
      labels.forEach((label, i) => {
        if (i % step === 0 || i === labels.length - 1) {
          const x = padding.left + (chartW / Math.max(1, labels.length - 1)) * i;
          ctx.fillText(label, x, h - padding.bottom + 15);
        }
      });
    }
  }, [data, labels, color, areaColor, showDots, showArea, ylabel]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(draw);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => resizeObserver.disconnect();
  }, [draw]);

  return (
    <div>
      {title && <h4 className="text-sm font-bold text-gray-700 mb-2">{title}</h4>}
      <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />
    </div>
  );
}

// ==================== BAR CHART ====================
export function BarChart({ data = [], labels = [], title = "", height = 250, colors = null }) {
  const canvasRef = useRef(null);
  const defaultColors = [COLORS.primary, COLORS.secondary, COLORS.warning, COLORS.danger, COLORS.info];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...data) * 1.15 || 1;
    const barWidth = Math.min(40, (chartW / data.length) * 0.6);
    const gap = (chartW - barWidth * data.length) / (data.length + 1);

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = COLORS.text;
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      const val = maxVal - (maxVal / 4) * i;
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + "k" : val.toFixed(0), padding.left - 5, y + 4);
    }

    // Bars
    data.forEach((val, i) => {
      const barH = (val / maxVal) * chartH;
      const x = padding.left + gap + (barWidth + gap) * i;
      const y = padding.top + chartH - barH;
      const c = (colors || defaultColors)[i % (colors || defaultColors).length];

      // Rounded corner bar
      const radius = Math.min(6, barWidth / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, padding.top + chartH);
      ctx.lineTo(x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();

      // Value on top
      ctx.fillStyle = COLORS.text;
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + "k" : val.toFixed(0), x + barWidth / 2, y - 5);
    });

    // X-axis labels
    if (labels.length > 0) {
      ctx.fillStyle = COLORS.text;
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "center";
      labels.forEach((label, i) => {
        const x = padding.left + gap + (barWidth + gap) * i + barWidth / 2;
        ctx.fillText(label, x, h - padding.bottom + 15);
      });
    }
  }, [data, labels, colors, defaultColors]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(draw);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => resizeObserver.disconnect();
  }, [draw]);

  return (
    <div>
      {title && <h4 className="text-sm font-bold text-gray-700 mb-2">{title}</h4>}
      <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />
    </div>
  );
}

// ==================== GAUGE CHART ====================
export function GaugeChart({ value = 0, max = 100, title = "", size = 160, color = COLORS.primary, label = "" }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = (size * 0.65) * dpr;
    ctx.scale(dpr, dpr);
    const w = size, h = size * 0.65;

    const centerX = w / 2, centerY = h * 0.85;
    const radius = Math.min(centerX, h * 0.75) - 10;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const progress = Math.min(value / max, 1);
    const progressAngle = startAngle + progress * Math.PI;

    ctx.clearRect(0, 0, w, h);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();

    // Progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, progressAngle);
    ctx.strokeStyle = value >= 80 ? COLORS.primary : value >= 50 ? COLORS.warning : COLORS.danger;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();

    // Value text
    ctx.fillStyle = "#1f2937";
    ctx.font = `bold ${radius * 0.45}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(Math.round(value), centerX, centerY - 5);

    // Label
    if (label) {
      ctx.fillStyle = COLORS.text;
      ctx.font = `${radius * 0.2}px Inter, sans-serif`;
      ctx.fillText(label, centerX, centerY + 12);
    }
  }, [value, max, size, color, label]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="text-center">
      {title && <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{title}</h4>}
      <canvas ref={canvasRef} style={{ width: `${size}px`, height: `${size * 0.65}px` }} />
    </div>
  );
}

// ==================== MULTI-LINE CHART ====================
export function MultiLineChart({ datasets = [], labels = [], title = "", height = 280, legend = [] }) {
  const canvasRef = useRef(null);
  const lineColors = [COLORS.line1, COLORS.line2, COLORS.line3, COLORS.danger, COLORS.info];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || datasets.length === 0) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const allVals = datasets.flat();
    const maxVal = Math.max(...allVals) * 1.1 || 1;
    const minVal = Math.min(0, Math.min(...allVals) * 0.9);
    const range = maxVal - minVal;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = COLORS.text;
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      const val = maxVal - (range / 5) * i;
      ctx.fillText(val.toFixed(1), padding.left - 5, y + 4);
    }

    // Draw each dataset
    datasets.forEach((data, di) => {
      const c = lineColors[di % lineColors.length];
      const points = data.map((val, i) => ({
        x: padding.left + (chartW / Math.max(1, data.length - 1)) * i,
        y: padding.top + chartH - ((val - minVal) / range) * chartH,
      }));

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = c;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Legend
    if (legend.length > 0) {
      let lx = padding.left;
      legend.forEach((label, i) => {
        const c = lineColors[i % lineColors.length];
        ctx.fillStyle = c;
        ctx.fillRect(lx, h - 12, 12, 3);
        ctx.fillStyle = COLORS.text;
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, lx + 16, h - 7);
        lx += ctx.measureText(label).width + 30;
      });
    }

    // X-axis labels
    if (labels.length > 0) {
      ctx.fillStyle = COLORS.text;
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "center";
      const step = Math.max(1, Math.floor(labels.length / 8));
      labels.forEach((label, i) => {
        if (i % step === 0) {
          const x = padding.left + (chartW / Math.max(1, labels.length - 1)) * i;
          ctx.fillText(label, x, h - padding.bottom + 15);
        }
      });
    }
  }, [datasets, labels, legend, lineColors]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(draw);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => resizeObserver.disconnect();
  }, [draw]);

  return (
    <div>
      {title && <h4 className="text-sm font-bold text-gray-700 mb-2">{title}</h4>}
      <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />
    </div>
  );
}

export default { LineChart, BarChart, GaugeChart, MultiLineChart };
