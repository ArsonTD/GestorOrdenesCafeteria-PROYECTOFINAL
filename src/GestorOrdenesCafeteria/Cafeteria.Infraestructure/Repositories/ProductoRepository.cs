using Cafeteria.Domain.Entities;
using Cafeteria.Infraestructure.Context;
using Cafeteria.Infraestructure.Core;
using Cafeteria.Infraestructure.Interfaces;

namespace Cafeteria.Infraestructure.Repositories
{
    public class ProductoRepository : BaseRepository<Producto>, IProductoRepository
    {
        public ProductoRepository(CafeteriaDbContext context) : base(context)
        {
        }
    }
}
