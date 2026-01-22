using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Seller;
using HandWoven.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Services.Seller;

public class SellerProductImageService : ISellerProductImageService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public SellerProductImageService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task UploadImagesAsync(int sellerId, ProductImageUploadDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Shop)
            .FirstOrDefaultAsync(p => p.ProductId == dto.ProductId);

        if (product == null)
        {
            throw new Exception("Product not found!");
        }

        if (product.Shop.UserId != sellerId)
        {
            throw new UnauthorizedAccessException("Not your product");
        }

        if (dto.Images == null || dto.Images.Count == 0)
        {
            throw new Exception("No images uploaded!");
        }

        var uploadPath = Path.Combine(_env.WebRootPath, "uploads", "products");
        Directory.CreateDirectory(uploadPath);

        foreach (var image in dto.Images)
        {
            if (image.Length == 0)
            {
                continue;
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            _context.ProductImages.Add(new ProductImage
            {
                ProductId = product.ProductId,
                ImageUrl = $"/uploads/products/{fileName}"
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteImageAsync(int sellerId, int productImageId)
    {
        var image = await _context.ProductImages
            .Include(pi => pi.Product)
            .ThenInclude(p => p.Shop)
            .FirstOrDefaultAsync(pi => pi.ProductImageId == productImageId);

        if (image == null)
        {
            throw new Exception("Image not found!");
        }

        if (image.Product?.Shop?.UserId != sellerId)
        {
            throw new UnauthorizedAccessException("Not your product");
        }

        var imageUrl = image.ImageUrl;

        _context.ProductImages.Remove(image);
        await _context.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(imageUrl) && imageUrl.StartsWith("/uploads/products/"))
        {
            var relativePath = imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var filePath = Path.Combine(_env.WebRootPath, relativePath);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
