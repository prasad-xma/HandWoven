using System;
using HandWoven.Api.DTOs.Product;
namespace HandWoven.Api.Services.Product;
using HandWoven.Api.Models;

public interface IProductService
{
    Task<int> CreateProductAsync(int sellerId, ProductCreateDto dto);
    Task<List<Product>> GetMyProductAsync(int sellerId);
    Task UpdateAvailabilityAsync(int sellerId, int productId, ProductStatus status);
    Task<Product> GetByIdAsync(int sellerId, int productId);
    Task UpdateProductAsync(int sellerId, int productId, ProductUpdateDto dto);
    Task DeleteProductAsync(int sellerId, int productId);
    Task<List<Promotion>> GetPromotionsAsync(int sellerId, int productId);
    Task<Promotion> AddPromotionAsync(int sellerId, int productId, PromotionCreateDto dto);
    Task DeletePromotionAsync(int sellerId, int productId, int promoId);
}
