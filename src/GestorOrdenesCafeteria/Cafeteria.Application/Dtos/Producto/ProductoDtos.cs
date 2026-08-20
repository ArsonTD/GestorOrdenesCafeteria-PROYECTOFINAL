using System.ComponentModel.DataAnnotations;

namespace Cafeteria.Application.Dtos.Producto
{
    public class ProductoGetDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public bool Disponible { get; set; }
    }

    public class ProductoSaveDto
    {
        [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [Range(0.01, 999999, ErrorMessage = "El precio debe ser mayor que 0 y menor o igual a 999999.")]
        public decimal Precio { get; set; }

        public bool Disponible { get; set; } = true;
    }
}
