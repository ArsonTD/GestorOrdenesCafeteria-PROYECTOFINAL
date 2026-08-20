using Cafeteria.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cafeteria.Infraestructure.Context
{
    public class CafeteriaDbContext : DbContext
    {
        public CafeteriaDbContext(DbContextOptions<CafeteriaDbContext> options) : base(options)
        {
        }

        public DbSet<Cliente> Clientes => Set<Cliente>();
        public DbSet<Producto> Productos => Set<Producto>();
        public DbSet<Orden> Ordenes => Set<Orden>();
        public DbSet<DetalleOrden> DetallesOrden => Set<DetalleOrden>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Producto>().Property(p => p.Precio).HasColumnType("decimal(10,2)");
            modelBuilder.Entity<Orden>().Property(o => o.Total).HasColumnType("decimal(10,2)");
            modelBuilder.Entity<DetalleOrden>().Property(d => d.PrecioUnitario).HasColumnType("decimal(10,2)");
            modelBuilder.Entity<DetalleOrden>().Property(d => d.Subtotal).HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Orden>().Property(o => o.Estado).HasConversion<string>().HasMaxLength(20);
            modelBuilder.Entity<Orden>().Property(o => o.MetodoPago).HasConversion<string>().HasMaxLength(20);

            modelBuilder.Entity<Orden>()
                .HasOne(o => o.Cliente)
                .WithMany(c => c.Ordenes)
                .HasForeignKey(o => o.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleOrden>()
                .HasOne(d => d.Orden)
                .WithMany(o => o.Detalles)
                .HasForeignKey(d => d.OrdenId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetalleOrden>()
                .HasOne(d => d.Producto)
                .WithMany(p => p.Detalles)
                .HasForeignKey(d => d.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cliente>().HasData(
                new Cliente { Id = 1, Nombre = "Cliente General" }
            );

            modelBuilder.Entity<Producto>().HasData(
                new Producto { Id = 1, Nombre = "Café Americano", Precio = 90m, Disponible = true },
                new Producto { Id = 2, Nombre = "Café Latte", Precio = 120m, Disponible = true },
                new Producto { Id = 3, Nombre = "Cheesecake", Precio = 160m, Disponible = true }
            );
        }
    }
}
