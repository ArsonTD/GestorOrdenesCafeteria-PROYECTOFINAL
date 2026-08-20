using Cafeteria.Application.Core;
using Cafeteria.Application.Dtos.Producto;

namespace Cafeteria.Application.Contract
{
    public interface IProductoService
    {
        Task<ServiceResult> GetAll();
        Task<ServiceResult> GetById(int id);
        Task<ServiceResult> Save(ProductoSaveDto dto);
        Task<ServiceResult> Update(int id, ProductoSaveDto dto);
        Task<ServiceResult> Remove(int id);
    }
}
