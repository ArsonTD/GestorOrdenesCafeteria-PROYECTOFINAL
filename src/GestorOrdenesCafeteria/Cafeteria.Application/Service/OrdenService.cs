using Cafeteria.Application.Contract;
using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Orden;
using Cafeteria.Domain.Enums;
using Cafeteria.Infraestructure.Interfaces;
using OrdenEntity = Cafeteria.Domain.Entities.Orden;
using DetalleEntity = Cafeteria.Domain.Entities.DetalleOrden;

namespace Cafeteria.Application.Service
{
    public class OrdenService : BaseService, IOrdenService
    {
        private readonly IOrdenRepository _ordenRepo;
        private readonly IClienteRepository _clienteRepo;
        private readonly IProductoRepository _productoRepo;

        public OrdenService(
            IOrdenRepository ordenRepo,
            IClienteRepository clienteRepo,
            IProductoRepository productoRepo)
        {
            _ordenRepo = ordenRepo;
            _clienteRepo = clienteRepo;
            _productoRepo = productoRepo;
        }

        public Task<ServiceResult> GetAll() => ExecuteAsync(async () =>
        {
            var items = await _ordenRepo.GetAllWithDetallesAsync();
            return ServiceResult.Ok(items.Select(Map).ToList());
        });

        public Task<ServiceResult> GetById(int id) => ExecuteAsync(async () =>
        {
            var o = await _ordenRepo.GetByIdWithDetallesAsync(id);
            if (o is null) return ServiceResult.NotFound($"No existe una orden con Id {id}.");
            return ServiceResult.Ok(Map(o));
        });

        public Task<ServiceResult> Crear(CrearOrdenDto dto) => ExecuteAsync(async () =>
        {
            if (!await _clienteRepo.ExistsAsync(dto.ClienteId))
                return ServiceResult.Fail($"No existe un cliente con Id {dto.ClienteId}.");

            if (dto.Detalles is null || dto.Detalles.Count == 0)
                return ServiceResult.Fail("La orden debe tener al menos un producto.");

            var detalles = new List<DetalleEntity>();
            decimal total = 0;

            foreach (var item in dto.Detalles)
            {
                if (item.Cantidad < 1)
                    return ServiceResult.Fail("La cantidad de cada producto debe ser al menos 1.");

                var producto = await _productoRepo.GetByIdAsync(item.ProductoId);
                if (producto is null)
                    return ServiceResult.Fail($"No existe un producto con Id {item.ProductoId}.");
                if (!producto.Disponible)
                    return ServiceResult.Fail($"El producto '{producto.Nombre}' no está disponible.");

                var subtotal = producto.Precio * item.Cantidad;
                total += subtotal;

                detalles.Add(new DetalleEntity
                {
                    ProductoId = producto.Id,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.Precio,
                    Subtotal = subtotal
                });
            }

            var orden = new OrdenEntity
            {
                ClienteId = dto.ClienteId,
                Fecha = DateTime.UtcNow,
                Estado = EstadoOrden.Pendiente,
                Total = total,
                Detalles = detalles
            };
            await _ordenRepo.AddAsync(orden);

            var creada = await _ordenRepo.GetByIdWithDetallesAsync(orden.Id);
            return ServiceResult.Ok(Map(creada!), "Orden creada correctamente.");
        });

        public Task<ServiceResult> Pagar(int id, PagarOrdenDto dto) => ExecuteAsync(async () =>
        {
            if (!Enum.TryParse<MetodoPago>(dto.MetodoPago, true, out var metodo))
                return ServiceResult.Fail("Método de pago inválido. Use Efectivo, Tarjeta o Transferencia.");

            var orden = await _ordenRepo.GetByIdAsync(id);
            if (orden is null) return ServiceResult.NotFound($"No existe una orden con Id {id}.");

            if (orden.Estado != EstadoOrden.Pendiente)
                return ServiceResult.Fail("Solo se pueden pagar órdenes en estado Pendiente.");

            orden.Estado = EstadoOrden.Pagada;
            orden.MetodoPago = metodo;
            orden.FechaPago = DateTime.UtcNow;
            await _ordenRepo.UpdateAsync(orden);

            var actualizada = await _ordenRepo.GetByIdWithDetallesAsync(id);
            return ServiceResult.Ok(Map(actualizada!), "Orden pagada correctamente.");
        });

        public Task<ServiceResult> Cancelar(int id) => ExecuteAsync(async () =>
        {
            var orden = await _ordenRepo.GetByIdAsync(id);
            if (orden is null) return ServiceResult.NotFound($"No existe una orden con Id {id}.");

            if (orden.Estado == EstadoOrden.Pagada)
                return ServiceResult.Fail("No se puede cancelar una orden que ya fue pagada.");
            if (orden.Estado == EstadoOrden.Cancelada)
                return ServiceResult.Fail("La orden ya está cancelada.");

            orden.Estado = EstadoOrden.Cancelada;
            await _ordenRepo.UpdateAsync(orden);

            var actualizada = await _ordenRepo.GetByIdWithDetallesAsync(id);
            return ServiceResult.Ok(Map(actualizada!), "Orden cancelada.");
        });

        public Task<ServiceResult> Remove(int id) => ExecuteAsync(async () =>
        {
            if (!await _ordenRepo.ExistsAsync(id)) return ServiceResult.NotFound($"No existe una orden con Id {id}.");
            await _ordenRepo.DeleteAsync(id);
            return ServiceResult.Ok(message: "Orden eliminada correctamente.");
        });

        private static OrdenGetDto Map(OrdenEntity o) => new()
        {
            Id = o.Id,
            ClienteId = o.ClienteId,
            ClienteNombre = o.Cliente?.Nombre ?? string.Empty,
            Fecha = o.Fecha,
            Estado = o.Estado.ToString(),
            MetodoPago = o.MetodoPago?.ToString(),
            FechaPago = o.FechaPago,
            Total = o.Total,
            Detalles = o.Detalles.Select(d => new DetalleOrdenGetDto
            {
                Id = d.Id,
                ProductoId = d.ProductoId,
                ProductoNombre = d.Producto?.Nombre ?? string.Empty,
                Cantidad = d.Cantidad,
                PrecioUnitario = d.PrecioUnitario,
                Subtotal = d.Subtotal
            }).ToList()
        };
    }
}
