using MiApiCrud.Data;
using MiApiCrud.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MiApiCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Usuario usuario)
        {
            var existe = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == usuario.Correo && u.Clave == usuario.Clave);

            if (existe == null)
                return Unauthorized(new { mensaje = "Usuario o clave incorrectos" });

            return Ok(new { mensaje = "Bienvenido al sistema" });
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(Usuario usuario)
        {

            bool correoOcupado = await _context.Usuarios.AnyAsync(u => u.Correo == usuario.Correo);

            if (correoOcupado)
                return BadRequest(new { mensaje = "Ese correo ya está registrado" });

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado con éxito" });
        }
    }
}
