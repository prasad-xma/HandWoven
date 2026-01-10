using System;
using System.Reflection.Emit;
using HandWoven.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Shop> Shops { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<ShippingAddress> ShippingAddresses { get; set; }

    public DbSet<SellerProfile> SellerProfiles { get; set; }
    public DbSet<Promotion> Promotions { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.SellerProfile)
            .WithOne(sp => sp.User)
            .HasForeignKey<SellerProfile>(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Shop
        modelBuilder.Entity<Shop>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        // Product
        modelBuilder.Entity<Product>()
        .HasOne(p => p.Shop)
        .WithMany(s => s.Products)
        .HasForeignKey(p => p.ShopId)
        .OnDelete(DeleteBehavior.Cascade);

        // ProductImage 
        modelBuilder.Entity<ProductImage>()
        .HasOne(pi => pi.Product)
        .WithMany(p => p.Images)
        .HasForeignKey(pi => pi.ProductId)
        .OnDelete(DeleteBehavior.Cascade);

        // Review
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Shop)
            .WithMany(s => s.Reviews)
            .HasForeignKey(r => r.ShopId)
            .OnDelete(DeleteBehavior.Cascade);


        // Wishlist
        modelBuilder.Entity<Wishlist>()
            .HasIndex(w => new { w.UserId, w.ProductId })
            .IsUnique();

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Product)
            .WithMany()
            .HasForeignKey(w => w.ProductId)
            .OnDelete(DeleteBehavior.Cascade);


        // Cart
        modelBuilder.Entity<Cart>()
            .HasIndex(c => new { c.UserId, c.ProductId })
            .IsUnique();

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User) // each cart has one user
            .WithMany(u => u.Carts) // each user can have many carts
            .HasForeignKey(c => c.UserId) // the foreignkey is UserId in the cart table
            .OnDelete(DeleteBehavior.Cascade); // if a user is deleted, all their cart is deleted too

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.Product)
            .WithMany()
            .HasForeignKey(c => c.ProductId)
            .OnDelete(DeleteBehavior.Cascade);



        // Shipping address
        modelBuilder.Entity<ShippingAddress>()
            .HasOne(sa => sa.User)
            .WithMany(u => u.ShippingAddresses)
            .HasForeignKey(sa => sa.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // Order
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.AddressId)
            .OnDelete(DeleteBehavior.Restrict);

        // Order Item
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Seller)
            .WithMany()
            .HasForeignKey(oi => oi.SellerId)
            .OnDelete(DeleteBehavior.Restrict);


        // Promotion
        modelBuilder.Entity<Promotion>()
            .HasOne(p => p.Product)
            .WithMany(pr => pr.Promotions)
            .HasForeignKey(p => p.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}
