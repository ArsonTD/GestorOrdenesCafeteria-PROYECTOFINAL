using Cafeteria.Domain.Core;
using Cafeteria.Domain.Repository;
using Cafeteria.Infraestructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Cafeteria.Infraestructure.Core
{
    public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : BaseEntity
    {
        protected readonly CafeteriaDbContext _context;
        protected readonly DbSet<TEntity> _entities;

        protected BaseRepository(CafeteriaDbContext context)
        {
            _context = context;
            _entities = context.Set<TEntity>();
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
            => await _entities.AsNoTracking().ToListAsync();

        public virtual async Task<TEntity?> GetByIdAsync(int id)
            => await _entities.FindAsync(id);

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            await _entities.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task UpdateAsync(TEntity entity)
        {
            _entities.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await _entities.FindAsync(id);
            if (entity is not null)
            {
                _entities.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public virtual async Task<bool> ExistsAsync(int id)
            => await _entities.AnyAsync(e => e.Id == id);
    }
}
