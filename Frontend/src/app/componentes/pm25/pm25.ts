import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalidadAireService } from '../../servicios/calidad_aire/calidad-aire.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-co',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pm25.html',
  styleUrls: ['./pm25.css']
})
export class Pm25Component implements OnInit, AfterViewInit {
  data: any[] = [];
  chart: any;
  avg: number = 0;
  min: number = 0;
  max: number = 0;

  constructor(private caService: CalidadAireService) {}

  ngOnInit(): void {
    // 🔹 Obtener últimos registros
    this.caService.getLatest(5).subscribe({
      next: (d: any) => {
        console.log('Datos recibidos:', d);
        this.data = d.reverse(); // opcional: ordenar de más antiguo a más reciente
        this.computeStats();
        this.loadChart();
        // 🔹 Tabla de registros lista automáticamente con this.data
      },
      error: (err) => console.error('Error al cargar latest:', err)
    });
  }

  ngAfterViewInit(): void {
    if (this.data.length) {
      this.loadChart();
    }
  }

  // 🔹 Calcular promedio, mínimo y máximo
  computeStats() {
    if (!this.data.length) return;
    const pm25Values = this.data.map(r => r.pm25);
    this.avg = pm25Values.reduce((a,b) => a+b, 0) / pm25Values.length;
    this.min = Math.min(...pm25Values);
    this.max = Math.max(...pm25Values);
  }

  // 🔹 Inicializar Chart.js
  loadChart() {
    const ctx = document.getElementById('pm25Chart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.map(r => r.fecha_hora),
        datasets: [{
          label: 'PM2.5',
          data: this.data.map(r => r.pm25),
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
