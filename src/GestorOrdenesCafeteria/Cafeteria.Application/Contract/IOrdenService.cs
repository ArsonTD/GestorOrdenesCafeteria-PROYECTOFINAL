using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Orden;

namespace Cafeteria.Application.Contract
{
    public interface IOrdenService
    {
        Task<ServiceResult> GetAll();
        Task<ServiceResult> GetById(int id);
        Task<ServiceResult> Crear(CrearOrdenDto dto);
        Task<ServiceResult> Pagar(int id, PagarOrdenDto dto);
        Task<ServiceResult> Cancelar(int id);
        Task<ServiceResult> Remove(int id);
    }
}
