using Microsoft.AspNetCore.Http;

namespace HandWoven.Api.DTOs.Seller;

public class ProductImageUploadDto
{
    public int ProductId { get; set; }
    public List<IFormFile> Images { get; set; } = new();
}
