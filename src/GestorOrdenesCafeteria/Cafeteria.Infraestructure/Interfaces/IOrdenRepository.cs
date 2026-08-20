using Cafeteria.Domain.Entities;
using Cafeteria.Domain.Repository;

namespace Cafeteria.Infraestructure.Interfaces
{
    public interface IOrdenRepository : IBaseRepository<Orden>
    {
        Task<IEnumerable<Orden>> GetAllWithDetallesAsync();
        Task<Orden?> GetByIdWithDetallesAsync(int id);
    }
}
