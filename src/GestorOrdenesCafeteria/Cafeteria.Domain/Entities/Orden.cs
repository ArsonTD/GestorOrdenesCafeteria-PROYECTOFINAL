using Cafeteria.Domain.Core;
using Cafeteria.Domain.Enums;

namespace Cafeteria.Domain.Entities
{
    public class Orden : BaseEntity
    {
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public DateTime Fecha { get; set; }
        public EstadoOrden Estado { get; set; } = EstadoOrden.Pendiente;

        public MetodoPago? MetodoPago { get; set; }
        public DateTime? FechaPago { get; set; }

        public decimal Total { get; set; }

        public ICollection<DetalleOrden> Detalles { get; set; } = new List<DetalleOrden>();
    }
}
