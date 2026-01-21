using System;
using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Product;

using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Services.Product;

using HandWoven.Api.Models;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateProductAsync(int sellerId, ProductCreateDto dto)
    {
        var shop = await _context.Shops
            .FirstOrDefaultAsync(s => s.UserId == sellerId);

        if (shop == null)
        {
            throw new Exception("Shop not found!");
        }

        var product = new Product
        {
            ProductName = dto.ProductName,
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            DiscountPrice = dto.DiscountPrice,
            Weight = dto.Weight,
            Dimensions = dto.Dimensions,
            MaterialType = dto.MaterialType,
            HashTags = dto.HashTags,
            isActive = ProductStatus.Active,
            ShopId = shop.ShopId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Models.Product>> GetMyProductAsync(int sellerId)
    {
        return await _context.Products
            .Include(p => p.Images)
            .Where(p => p.Shop.UserId == sellerId)
            .ToListAsync();
    }

    public async Task UpdateAvailabilityAsync(int sellerId, int productId, ProductStatus status)
    {
        var product = await _context.Products
            .Include(p => p.Shop)
            .FirstOrDefaultAsync(p => p.ProductId == productId);

        if(product == null)
        {
            throw new Exception("Product not found!");
        }

        if (product.Shop.UserId != sellerId)
        {
            throw new UnauthorizedAccessException("Unauthorized!");
        }

        product.isActive = status;
        await _context.SaveChangesAsync();
    }
}
