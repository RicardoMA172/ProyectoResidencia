import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalidadAireService } from '../../servicios/calidad_aire/calidad-aire.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sox.html',
  styleUrls: ['./sox.css']
})
export class SoxComponent implements OnInit {
  // 🔹 Tabla (últimos 5)
  data: any[] = [];

  // 🔹 Gráfica (todos)
  chart: any;
  avg: number = 0;
  min: number = 0;
  max: number = 0;

  constructor(private SoxService: CalidadAireService) {}

  ngOnInit(): void {
    // ✅ Tabla: últimos 5 registros
    this.SoxService.getLatest(5).subscribe({
      next: (tableData: any) => {
        this.data = tableData.reverse(); // tabla de más antiguo → reciente
      },
      error: (err) => console.error('Error al cargar últimos registros:', err)
    });

    // ✅ Gráfica + estadísticas: todos los registros
    this.SoxService.getAll().subscribe({
      next: (chartData: any) => {
        this.computeStats(chartData); // estadísticas con todos
        this.loadChart(chartData);    // gráfica con todos
      },
      error: (err) => console.error('Error al cargar todos los registros:', err)
    });
  }

  // 🔹 Calcular promedio, mínimo y máximo (para todos los registros)
  computeStats(data: any[]) {
    if (!data.length) return;
    const soxValues = data.map(r => r.sox);
    this.avg = soxValues.reduce((a,b) => a+b, 0) / soxValues.length;
    this.min = Math.min(...soxValues);
    this.max = Math.max(...soxValues);
  }

  // 🔹 Inicializar Chart.js con todos los registros
  loadChart(data: any[]) {
    const ctx = document.getElementById('soxChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(r => r.fecha_hora),
        datasets: [{
          label: 'SOx',
          data: data.map(r => r.sox),
          borderColor: '#2980b9',
          backgroundColor: 'rgba(41, 128, 185, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { x: { display: true }, y: { display: true } }
      }
    });
  }
}
