using Microsoft.EntityFrameworkCore;
using MiApiCrud.Data;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

// 1. Configurar conexión SQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configurar CORS (Permitir acceso desde VS Code)
builder.Services.AddCors(options => {
    options.AddPolicy("PermitirTodo", app => {
        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// 3. Evitar el error de "Ciclos" al convertir relaciones a JSON
builder.Services.AddControllers().AddJsonOptions(x =>
   x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar el pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("PermitirTodo"); // Activar CORS
app.UseAuthorization();
app.MapControllers();
app.Run();