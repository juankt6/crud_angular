using System.ComponentModel.DataAnnotations.Schema;
namespace MiApiCrud.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }

        // --- RELACIÓN (CLAVE FORÁNEA) ---
        public int CategoriaId { get; set; } // El número que une las tablas

        [ForeignKey("CategoriaId")]
        public virtual Categoria? Categoria { get; set; } // Para poder navegar a los datos de la categoría
    }
}