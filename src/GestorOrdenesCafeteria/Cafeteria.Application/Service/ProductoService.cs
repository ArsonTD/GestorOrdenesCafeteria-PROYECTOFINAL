using Cafeteria.Application.Contract;
using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Producto;
using Cafeteria.Infraestructure.Interfaces;
using ProductoEntity = Cafeteria.Domain.Entities.Producto;

namespace Cafeteria.Application.Service
{
    public class ProductoService : BaseService, IProductoService
    {
        private readonly IProductoRepository _repo;

        public ProductoService(IProductoRepository repo)
        {
            _repo = repo;
        }

        public Task<ServiceResult> GetAll() => ExecuteAsync(async () =>
        {
            var items = await _repo.GetAllAsync();
            return ServiceResult.Ok(items.OrderBy(p => p.Nombre).Select(Map).ToList());
        });

        public Task<ServiceResult> GetById(int id) => ExecuteAsync(async () =>
        {
            var p = await _repo.GetByIdAsync(id);
            if (p is null) return ServiceResult.NotFound($"No existe un producto con Id {id}.");
            return ServiceResult.Ok(Map(p));
        });

        public Task<ServiceResult> Save(ProductoSaveDto dto) => ExecuteAsync(async () =>
        {
            var error = Validar(dto);
            if (error is not null) return ServiceResult.Fail(error);

            var p = new ProductoEntity
            {
                Nombre = dto.Nombre.Trim(),
                Precio = dto.Precio,
                Disponible = dto.Disponible
            };
            await _repo.AddAsync(p);
            return ServiceResult.Ok(Map(p), "Producto creado correctamente.");
        });

        public Task<ServiceResult> Update(int id, ProductoSaveDto dto) => ExecuteAsync(async () =>
        {
            var error = Validar(dto);
            if (error is not null) return ServiceResult.Fail(error);

            var p = await _repo.GetByIdAsync(id);
            if (p is null) return ServiceResult.NotFound($"No existe un producto con Id {id}.");

            p.Nombre = dto.Nombre.Trim();
            p.Precio = dto.Precio;
            p.Disponible = dto.Disponible;
            await _repo.UpdateAsync(p);
            return ServiceResult.Ok(Map(p), "Producto actualizado correctamente.");
        });

        public Task<ServiceResult> Remove(int id) => ExecuteAsync(async () =>
        {
            if (!await _repo.ExistsAsync(id)) return ServiceResult.NotFound($"No existe un producto con Id {id}.");
            await _repo.DeleteAsync(id);
            return ServiceResult.Ok(message: "Producto eliminado correctamente.");
        });

        private static string? Validar(ProductoSaveDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre)) return "El nombre del producto es obligatorio.";
            var n = dto.Nombre.Trim();
            if (n.Length < 2 || n.Length > 100) return "El nombre debe tener entre 2 y 100 caracteres.";
            if (dto.Precio <= 0) return "El precio debe ser mayor que 0.";
            if (dto.Precio > 999999) return "El precio no puede superar 999999.";
            return null;
        }

        private static ProductoGetDto Map(ProductoEntity p) => new()
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Precio = p.Precio,
            Disponible = p.Disponible
        };
    }
}
