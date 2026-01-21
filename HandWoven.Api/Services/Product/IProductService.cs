using System;
using HandWoven.Api.DTOs.Product;
namespace HandWoven.Api.Services.Product;
using HandWoven.Api.Models;

public interface IProductService
{
    Task<int> CreateProductAsync(int sellerId, ProductCreateDto dto);
    Task<List<Product>> GetMyProductAsync(int sellerId);
    Task UpdateAvailabilityAsync(int sellerId, int productId, ProductStatus status);
}
