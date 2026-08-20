using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Cliente;

namespace Cafeteria.Application.Contract
{
    public interface IClienteService
    {
        Task<ServiceResult> GetAll();
        Task<ServiceResult> GetById(int id);
        Task<ServiceResult> Save(ClienteSaveDto dto);
        Task<ServiceResult> Update(int id, ClienteSaveDto dto);
        Task<ServiceResult> Remove(int id);
    }
}
