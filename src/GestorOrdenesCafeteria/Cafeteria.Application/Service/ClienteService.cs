using Cafeteria.Application.Contract;
using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Cliente;
using Cafeteria.Infraestructure.Interfaces;
using ClienteEntity = Cafeteria.Domain.Entities.Cliente;

namespace Cafeteria.Application.Service
{
    public class ClienteService : BaseService, IClienteService
    {
        private readonly IClienteRepository _repo;

        public ClienteService(IClienteRepository repo)
        {
            _repo = repo;
        }

        public Task<ServiceResult> GetAll() => ExecuteAsync(async () =>
        {
            var items = await _repo.GetAllAsync();
            return ServiceResult.Ok(items.Select(Map).ToList());
        });

        public Task<ServiceResult> GetById(int id) => ExecuteAsync(async () =>
        {
            var c = await _repo.GetByIdAsync(id);
            if (c is null) return ServiceResult.NotFound($"No existe un cliente con Id {id}.");
            return ServiceResult.Ok(Map(c));
        });

        public Task<ServiceResult> Save(ClienteSaveDto dto) => ExecuteAsync(async () =>
        {
            var error = Validar(dto);
            if (error is not null) return ServiceResult.Fail(error);

            var c = new ClienteEntity
            {
                Nombre = dto.Nombre.Trim(),
                Telefono = string.IsNullOrWhiteSpace(dto.Telefono) ? null : dto.Telefono.Trim()
            };
            await _repo.AddAsync(c);
            return ServiceResult.Ok(Map(c), "Cliente creado correctamente.");
        });

        public Task<ServiceResult> Update(int id, ClienteSaveDto dto) => ExecuteAsync(async () =>
        {
            var error = Validar(dto);
            if (error is not null) return ServiceResult.Fail(error);

            var c = await _repo.GetByIdAsync(id);
            if (c is null) return ServiceResult.NotFound($"No existe un cliente con Id {id}.");

            c.Nombre = dto.Nombre.Trim();
            c.Telefono = string.IsNullOrWhiteSpace(dto.Telefono) ? null : dto.Telefono.Trim();
            await _repo.UpdateAsync(c);
            return ServiceResult.Ok(Map(c), "Cliente actualizado correctamente.");
        });

        public Task<ServiceResult> Remove(int id) => ExecuteAsync(async () =>
        {
            if (!await _repo.ExistsAsync(id)) return ServiceResult.NotFound($"No existe un cliente con Id {id}.");
            await _repo.DeleteAsync(id);
            return ServiceResult.Ok(message: "Cliente eliminado correctamente.");
        });

        private static string? Validar(ClienteSaveDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre)) return "El nombre del cliente es obligatorio.";
            var n = dto.Nombre.Trim();
            if (n.Length < 2 || n.Length > 120) return "El nombre debe tener entre 2 y 120 caracteres.";
            if (dto.Telefono is not null && dto.Telefono.Length > 30) return "El teléfono no puede superar los 30 caracteres.";
            return null;
        }

        private static ClienteGetDto Map(ClienteEntity c) => new()
        {
            Id = c.Id,
            Nombre = c.Nombre,
            Telefono = c.Telefono
        };
    }
}
