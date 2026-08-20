using Cafeteria.Domain.Core;

namespace Cafeteria.Domain.Entities
{
    public class DetalleOrden : BaseEntity
    {
        public int OrdenId { get; set; }
        public Orden? Orden { get; set; }

        public int ProductoId { get; set; }
        public Producto? Producto { get; set; }

        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}
