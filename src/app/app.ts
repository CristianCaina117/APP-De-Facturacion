import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common'; // ✅ Import necesario

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgIf], // ✅ Agregar NgIf aquí
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Facturacion');

  constructor(private router: Router) {}

  showMenu(): boolean {
    const menuRoutes = ['/', '/menu'];
    return menuRoutes.includes(this.router.url);
  }
}
