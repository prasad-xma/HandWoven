using HandWoven.Api.DTOs.Seller;

namespace HandWoven.Api.Services.Seller;

public interface ISellerProductImageService
{
    Task UploadImagesAsync(int sellerId, ProductImageUploadDto dto);
    Task DeleteImageAsync(int sellerId, int productImageId);
}
