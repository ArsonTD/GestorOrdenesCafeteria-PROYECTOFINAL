using Cafeteria.Application.Contract;
using Cafeteria.Application.Dtos.Producto;
using Microsoft.AspNetCore.Mvc;

namespace GestorCafeteria.API.Controllers
{
    public class ProductosController : ApiControllerBase
    {
        private readonly IProductoService _service;

        public ProductosController(IProductoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetProductos() => ToResponse(await _service.GetAll());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProducto(int id) => ToResponse(await _service.GetById(id));

        [HttpPost]
        public async Task<IActionResult> CrearProducto(ProductoSaveDto dto) => ToResponse(await _service.Save(dto));

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarProducto(int id, ProductoSaveDto dto) => ToResponse(await _service.Update(id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProducto(int id) => ToResponse(await _service.Remove(id));
    }
}
