using System.ComponentModel.DataAnnotations;
using Cafeteria.Domain.Core;

namespace Cafeteria.Domain.Entities
{
    public class Producto : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        public decimal Precio { get; set; }

        public bool Disponible { get; set; } = true;

        public ICollection<DetalleOrden> Detalles { get; set; } = new List<DetalleOrden>();
    }
}
