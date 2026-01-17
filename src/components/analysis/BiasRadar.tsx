import { useEffect, useRef } from "react";

interface BiasRadarProps {
  data: {
    political: number;
    emotional: number;
    sensational: number;
    commercial: number;
    ideological: number;
  };
}

const BiasRadar = ({ data }: BiasRadarProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 30;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const labels = Object.keys(data);
    const values = Object.values(data);
    const numPoints = labels.length;
    const angleStep = (2 * Math.PI) / numPoints;

    // Draw background circles
    for (let i = 1; i <= 4; i++) {
      const radius = (maxRadius / 4) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + maxRadius * Math.cos(angle);
      const y = centerY + maxRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw labels
      const labelX = centerX + (maxRadius + 20) * Math.cos(angle);
      const labelY = centerY + (maxRadius + 20) * Math.sin(angle);
      
      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i].charAt(0).toUpperCase() + labels[i].slice(1), labelX, labelY);
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = values[i] / 100;
      const x = centerX + maxRadius * value * Math.cos(angle);
      const y = centerY + maxRadius * value * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Create gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, "rgba(20, 184, 166, 0.4)");
    gradient.addColorStop(1, "rgba(20, 184, 166, 0.1)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "rgba(20, 184, 166, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = values[i] / 100;
      const x = centerX + maxRadius * value * Math.cos(angle);
      const y = centerY + maxRadius * value * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "hsl(175, 80%, 50%)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="max-w-full"
      />
      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-xs">
            <div className={`font-semibold ${value > 50 ? "text-warning" : value > 25 ? "text-suspicious" : "text-success"}`}>
              {value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiasRadar;
