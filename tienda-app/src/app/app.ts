import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, Producto, Categoria, LoginRequest } from './services/api';
import { PdfService } from './services/pdfmake.service';
import { lastValueFrom } from 'rxjs';

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
  clienteFactura = { nombre: 'Consumidor Final', identificacion: '9999999999', direccion: 'Ecuador' };
  carritoVentas: any[] = [];
  productoSeleccionadoId: number = 0;
  cantidadSeleccionada: number = 1;
  constructor(
    private api: ApiService, 
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const tienePase = localStorage.getItem('pase_secreto');
    if (tienePase === 'autorizado') {
      this.estaLogueado = true;
      await this.cargarTodo();
    }
  }
  // --- AUTH ---
  async procesarAuth() {
    if (!this.loginData.correo || !this.loginData.clave) { return; }

    try {
      if (this.modoRegistro) {
        await lastValueFrom(this.api.registrar(this.loginData)); 
        alert("✅ Registro exitoso. Ahora inicia sesión.");
        this.modoRegistro = false; 
        this.loginData.clave = ''; 
      } else {
        await lastValueFrom(this.api.login(this.loginData));
        localStorage.setItem('pase_secreto', 'autorizado');
        this.estaLogueado = true; 
        await this.cargarTodo(); 
      }
      this.cdr.detectChanges();
    } catch (error: any) {
      alert("❌ Error: " + (error.error?.mensaje || "Credenciales incorrectas"));
    }
  }

  cerrarSesion() {
    localStorage.removeItem('pase_secreto');
    this.estaLogueado = false;
    this.loginData = { correo: '', clave: '' };
    this.listaProductos = [];
    this.cdr.detectChanges();
  }
  // --- CARGA DE DATOS ---
  async cargarTodo() {
    try {
      this.listaCategorias = await lastValueFrom(this.api.getCategorias());
      this.listaProductos = await lastValueFrom(this.api.getProductos());
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  }
  // --- PRODUCTOS ---
  async guardarProducto() {
    try {
      if (this.productoForm.id === 0) {
        await lastValueFrom(this.api.crearProducto(this.productoForm));
      } else {
        await lastValueFrom(this.api.actualizarProducto(this.productoForm.id, this.productoForm));
      }
      this.limpiarProducto();
      await this.cargarTodo();
    } catch (error) {
      alert("❌ Hubo un error al guardar el producto");
    }
  }

  editarProducto(p: Producto) { 
    this.productoForm = { ...p }; 
    this.cdr.detectChanges();
  }

  async eliminarProducto(id: number) {
    if(confirm("¿Estás seguro de borrar este producto?")) {
      try {
        await lastValueFrom(this.api.borrarProducto(id));
        await this.cargarTodo();
      } catch (error) {
        alert("❌ Error: No se pudo eliminar el producto.");
      }
    }
  }

  limpiarProducto() { 
    this.productoForm = { id: 0, nombre: '', precio: 0, categoriaId: 0 }; 
    this.cdr.detectChanges();
  }

  // --- CATEGORÍAS ---

  async guardarCategoria() {
    try {
      if (this.categoriaForm.id === 0) {
        await lastValueFrom(this.api.crearCategoria(this.categoriaForm));
      } else {
        await lastValueFrom(this.api.actualizarCategoria(this.categoriaForm.id, this.categoriaForm));
      }
      this.limpiarCategoria();
      await this.cargarTodo();
    } catch (error) {
      alert("❌ Hubo un error al guardar la categoría");
    }
  }

  editarCategoria(c: Categoria) { 
    this.categoriaForm = { ...c }; 
    this.cdr.detectChanges();
  }

  async eliminarCategoria(id: number) {
    if(confirm("¿Borrar categoría?")) {
      try {
        await lastValueFrom(this.api.borrarCategoria(id));
        await this.cargarTodo();
      } catch (error) {
        alert("❌ No se puede borrar esta categoría porque tiene productos asignados.");
      }
    }
  }

  limpiarCategoria() { 
    this.categoriaForm = { id: 0, nombre: '' }; 
    this.cdr.detectChanges();
  }

  // --- PDF ---
  generarFacturaPDF() {
    this.pdfService.generarFacturaProductos(this.listaProductos);
  }
}