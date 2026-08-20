using System.ComponentModel.DataAnnotations;

namespace Cafeteria.Application.Dtos.Orden
{
    public class DetalleOrdenGetDto
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class OrdenGetDto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string ClienteNombre { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string? MetodoPago { get; set; }
        public DateTime? FechaPago { get; set; }
        public decimal Total { get; set; }
        public List<DetalleOrdenGetDto> Detalles { get; set; } = new();
    }

    public class CrearDetalleDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Debe indicar un producto válido.")]
        public int ProductoId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Cantidad { get; set; }
    }

    public class CrearOrdenDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Debe indicar un cliente válido.")]
        public int ClienteId { get; set; }

        [MinLength(1, ErrorMessage = "La orden debe tener al menos un producto.")]
        public List<CrearDetalleDto> Detalles { get; set; } = new();
    }

    public class PagarOrdenDto
    {
        [Required(ErrorMessage = "El método de pago es obligatorio.")]
        public string MetodoPago { get; set; } = string.Empty;
    }
}
