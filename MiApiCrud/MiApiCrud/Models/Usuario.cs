namespace MiApiCrud.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Correo { get; set; } = string.Empty;
        public string Clave { get; set; } = string.Empty;
    }
}