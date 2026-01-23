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

    public async Task<int> CreateProductAsync(int sellerId, ProductCreateDto dto)
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

        return product.ProductId;
    }

    public async Task<List<Models.Product>> GetMyProductAsync(int sellerId)
    {
        return await _context.Products
            .Include(p => p.Images)
            .Where(p => p.Shop.UserId == sellerId)
            .ToListAsync();
    }

    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Promotions)
            .Include(p => p.Shop)
            .Where(p => p.isActive == ProductStatus.Active)
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

    public async Task<Product> GetByIdAsync(int sellerId, int productId)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Promotions)
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        return product;
    }

    public async Task UpdateProductAsync(int sellerId, int productId, ProductUpdateDto dto)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        if (dto.ProductName != null) product.ProductName = dto.ProductName;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        if (dto.Quantity.HasValue) product.Quantity = dto.Quantity.Value;
        if (dto.DiscountPrice.HasValue) product.DiscountPrice = dto.DiscountPrice.Value;
        if (dto.Weight.HasValue) product.Weight = dto.Weight.Value;
        if (dto.Dimensions != null) product.Dimensions = dto.Dimensions;
        if (dto.MaterialType != null) product.MaterialType = dto.MaterialType;
        if (dto.HashTags != null) product.HashTags = dto.HashTags;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(int sellerId, int productId)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Promotion>> GetPromotionsAsync(int sellerId, int productId)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        return await _context.Promotions
            .Where(pr => pr.ProductId == productId)
            .ToListAsync();
    }

    public async Task<Promotion> AddPromotionAsync(int sellerId, int productId, PromotionCreateDto dto)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        if (dto.ValidUntil < dto.ValidFrom)
        {
            throw new Exception("ValidUntil cannot be earlier than ValidFrom");
        }

        var promotion = new Promotion
        {
            ProductId = productId,
            DiscountValue = dto.DiscountValue,
            ValidFrom = dto.ValidFrom,
            ValidUntil = dto.ValidUntil
        };

        _context.Promotions.Add(promotion);
        await _context.SaveChangesAsync();
        return promotion;
    }

    public async Task DeletePromotionAsync(int sellerId, int productId, int promoId)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == productId && p.Shop.UserId == sellerId)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        var promo = await _context.Promotions
            .Where(pr => pr.PromoId == promoId && pr.ProductId == productId)
            .FirstOrDefaultAsync();

        if (promo == null)
        {
            throw new Exception("Promotion not found!");
        }

        _context.Promotions.Remove(promo);
        await _context.SaveChangesAsync();
    }
}
