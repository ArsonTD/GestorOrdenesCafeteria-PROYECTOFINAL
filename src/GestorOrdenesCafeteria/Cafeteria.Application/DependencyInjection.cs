using Cafeteria.Application.Contract;
using Cafeteria.Application.Service;
using Microsoft.Extensions.DependencyInjection;

namespace Cafeteria.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IClienteService, ClienteService>();
            services.AddScoped<IProductoService, ProductoService>();
            services.AddScoped<IOrdenService, OrdenService>();
            return services;
        }
    }
}
