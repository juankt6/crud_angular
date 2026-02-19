export interface Categoria {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoriaId: number;
    categoria: Categoria; 
}