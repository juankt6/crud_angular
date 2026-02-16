using MiApiCrud.Data;
using MiApiCrud.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiTienda.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Productos (Obtener TODOS)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            // El .Include es IMPORTANTE: Trae los datos de la Categoría relacionada
            return await _context.Productos
                                 .Include(p => p.Categoria)
                                 .ToListAsync();
        }

        // 2. GET: api/Productos/5 (Obtener UNO por ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                                         .Include(p => p.Categoria)
                                         .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            return producto;
        }

        // 3. POST: api/Productos (CREAR nuevo)
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            // Validamos que la categoría exista antes de guardar (Opcional pero recomendado)
            var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == producto.CategoriaId);
            if (!categoriaExiste)
            {
                return BadRequest("La Categoría especificada no existe.");
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProducto", new { id = producto.Id }, producto);
        }

        // 4. PUT: api/Productos/5 (MODIFICAR existente)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest("El ID de la URL no coincide con el del cuerpo.");
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. DELETE: api/Productos/5 (BORRAR)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar para verificar si existe
        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}