using Cafeteria.Domain.Entities;
using Cafeteria.Infraestructure.Context;
using Cafeteria.Infraestructure.Core;
using Cafeteria.Infraestructure.Interfaces;

namespace Cafeteria.Infraestructure.Repositories
{
    public class ClienteRepository : BaseRepository<Cliente>, IClienteRepository
    {
        public ClienteRepository(CafeteriaDbContext context) : base(context)
        {
        }
    }
}
