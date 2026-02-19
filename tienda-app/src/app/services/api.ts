import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- MODELOS ---
export interface LoginRequest {
    correo: string;
    clave: string;
}

export interface Categoria { id: number; nombre: string; }
export interface Producto { id: number; nombre: string; precio: number; categoriaId: number; categoria?: Categoria; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  

  private apiUrl = 'https://localhost:7267/api'; 

  constructor(private http: HttpClient) { }

  // --- AUTENTICACIÓN ---
  login(datos: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/login`, datos);
  }

  registrar(datos: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/registrar`, datos);
  }

  // --- CATEGORIAS ---
  getCategorias(): Observable<Categoria[]> { return this.http.get<Categoria[]>(`${this.apiUrl}/Categorias`); }
  crearCategoria(c: Categoria) { return this.http.post(`${this.apiUrl}/Categorias`, c); }
  actualizarCategoria(id: number, c: Categoria) { return this.http.put(`${this.apiUrl}/Categorias/${id}`, c); }
  borrarCategoria(id: number) { return this.http.delete(`${this.apiUrl}/Categorias/${id}`); }

  // --- PRODUCTOS ---
  getProductos(): Observable<Producto[]> { return this.http.get<Producto[]>(`${this.apiUrl}/Productos`); }
  crearProducto(p: Producto) { return this.http.post(`${this.apiUrl}/Productos`, p); }
  actualizarProducto(id: number, p: Producto) { return this.http.put(`${this.apiUrl}/Productos/${id}`, p); }
  borrarProducto(id: number) { return this.http.delete(`${this.apiUrl}/Productos/${id}`); }
}