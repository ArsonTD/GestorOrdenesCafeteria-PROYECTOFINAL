using Cafeteria.Application.Contract;
using Cafeteria.Application.Dtos.Cliente;
using Microsoft.AspNetCore.Mvc;

namespace GestorCafeteria.API.Controllers
{
    public class ClientesController : ApiControllerBase
    {
        private readonly IClienteService _service;

        public ClientesController(IClienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetClientes() => ToResponse(await _service.GetAll());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCliente(int id) => ToResponse(await _service.GetById(id));

        [HttpPost]
        public async Task<IActionResult> CrearCliente(ClienteSaveDto dto) => ToResponse(await _service.Save(dto));

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, ClienteSaveDto dto) => ToResponse(await _service.Update(id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCliente(int id) => ToResponse(await _service.Remove(id));
    }
}
