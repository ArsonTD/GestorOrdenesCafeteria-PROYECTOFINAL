using Cafeteria.Infraestructure.Context;
using Cafeteria.Infraestructure.Interfaces;
using Cafeteria.Infraestructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Cafeteria.Infraestructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfraestructure(
            this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<CafeteriaDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<IClienteRepository, ClienteRepository>();
            services.AddScoped<IProductoRepository, ProductoRepository>();
            services.AddScoped<IOrdenRepository, OrdenRepository>();

            return services;
        }
    }
}
