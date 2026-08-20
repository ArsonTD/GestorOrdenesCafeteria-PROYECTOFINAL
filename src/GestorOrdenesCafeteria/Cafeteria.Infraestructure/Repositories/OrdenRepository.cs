using Cafeteria.Domain.Entities;
using Cafeteria.Infraestructure.Context;
using Cafeteria.Infraestructure.Core;
using Cafeteria.Infraestructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cafeteria.Infraestructure.Repositories
{
    public class OrdenRepository : BaseRepository<Orden>, IOrdenRepository
    {
        public OrdenRepository(CafeteriaDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Orden>> GetAllWithDetallesAsync()
            => await _entities.AsNoTracking()
                              .Include(o => o.Cliente)
                              .Include(o => o.Detalles)
                                  .ThenInclude(d => d.Producto)
                              .OrderByDescending(o => o.Fecha)
                              .ToListAsync();

        public async Task<Orden?> GetByIdWithDetallesAsync(int id)
            => await _entities.AsNoTracking()
                              .Include(o => o.Cliente)
                              .Include(o => o.Detalles)
                                  .ThenInclude(d => d.Producto)
                              .FirstOrDefaultAsync(o => o.Id == id);
    }
}
