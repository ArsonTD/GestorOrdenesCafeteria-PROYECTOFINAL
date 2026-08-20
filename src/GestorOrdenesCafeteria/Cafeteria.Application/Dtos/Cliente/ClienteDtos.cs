using System.ComponentModel.DataAnnotations;

namespace Cafeteria.Application.Dtos.Cliente
{
    public class ClienteGetDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Telefono { get; set; }
    }

    public class ClienteSaveDto
    {
        [Required(ErrorMessage = "El nombre del cliente es obligatorio.")]
        [StringLength(120, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 120 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(30, ErrorMessage = "El teléfono no puede superar los 30 caracteres.")]
        public string? Telefono { get; set; }
    }
}
