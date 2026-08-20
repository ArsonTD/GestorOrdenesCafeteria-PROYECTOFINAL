using Cafeteria.Application.Contract;
using Cafeteria.Application.Dtos.Orden;
using Microsoft.AspNetCore.Mvc;

namespace GestorCafeteria.API.Controllers
{
    public class OrdenesController : ApiControllerBase
    {
        private readonly IOrdenService _service;

        public OrdenesController(IOrdenService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrdenes() => ToResponse(await _service.GetAll());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrden(int id) => ToResponse(await _service.GetById(id));

        [HttpPost]
        public async Task<IActionResult> CrearOrden(CrearOrdenDto dto) => ToResponse(await _service.Crear(dto));

        [HttpPost("{id}/pagar")]
        public async Task<IActionResult> PagarOrden(int id, PagarOrdenDto dto) => ToResponse(await _service.Pagar(id, dto));

        [HttpPost("{id}/cancelar")]
        public async Task<IActionResult> CancelarOrden(int id) => ToResponse(await _service.Cancelar(id));

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarOrden(int id) => ToResponse(await _service.Remove(id));
    }
}
