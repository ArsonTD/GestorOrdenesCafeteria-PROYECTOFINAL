using System.ComponentModel.DataAnnotations;
using Cafeteria.Domain.Core;

namespace Cafeteria.Domain.Entities
{
    public class Cliente : BaseEntity
    {
        [Required]
        [MaxLength(120)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(30)]
        public string? Telefono { get; set; }

        public ICollection<Orden> Ordenes { get; set; } = new List<Orden>();
    }
}
