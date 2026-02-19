import { Component, OnInit } from '@angular/core';
import { ApiService, Producto, Categoria, LoginRequest } from './services/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  
  estaLogueado: boolean = false;
  modoRegistro: boolean = false;
  
  loginData: LoginRequest = { correo: '', clave: '' };

  vistaActual: string = 'productos';
  listaCategorias: Categoria[] = [];
  listaProductos: Producto[] = [];
  productoForm: Producto = { id: 0, nombre: '', precio: 0, categoriaId: 0 };
  categoriaForm: Categoria = { id: 0, nombre: '' };

  constructor(private api: ApiService) {}

  ngOnInit() { 
 
  }

  procesarAuth() {
    if (!this.loginData.correo || !this.loginData.clave) {
      alert("Completa los campos");
      return;
    }

    if (this.modoRegistro) {
      // REGISTRAR
      this.api.registrar(this.loginData).subscribe({
        next: (res) => {
          alert("✅ " + res.mensaje);
          this.modoRegistro = false;
        },
        error: (e) => alert("❌ " + e.error.mensaje)
      });
    } else {
      // LOGIN
      this.api.login(this.loginData).subscribe({
        next: (res) => {
          this.estaLogueado = true;
          this.cargarTodo(); 
        },
        error: () => alert("❌ Credenciales incorrectas")
      });
    }
  }

  cerrarSesion() {
    this.estaLogueado = false;
    this.loginData = { correo: '', clave: '' };
    this.listaProductos = [];
  }

  cargarTodo() {
    this.api.getCategorias().subscribe(data => this.listaCategorias = data);
    this.api.getProductos().subscribe(data => this.listaProductos = data);
  }


   guardarProducto() { /* ... */ }
   editarProducto(p: Producto) { /* ... */ }
   eliminarProducto(id: number) { /* ... */ }
   limpiarProducto() { /* ... */ }
   guardarCategoria() { /* ... */ }
   editarCategoria(c: Categoria) { /* ... */ }
   eliminarCategoria(id: number) { /* ... */ }
   limpiarCategoria() { /* ... */ }
}