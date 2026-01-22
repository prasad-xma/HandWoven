using System.Security.Claims;
using HandWoven.Api.DTOs.Product;
using HandWoven.Api.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers.Product
{
    [Route("api/seller/product")]
    [ApiController]
    [Authorize(Roles = "Seller")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProductCreateDto dto)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var productId = await _service.CreateProductAsync(sellerId, dto);

            return Ok(new { message = "Product Created Successfully!", productId });
        }

        [HttpGet("mine")]
        public async Task<IActionResult> MyProducts()
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _service.GetMyProductAsync(sellerId));
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetById(int productId)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var product = await _service.GetByIdAsync(sellerId, productId);
            return Ok(product);
        }

        [HttpPatch("{productId}")]
        public async Task<IActionResult> Update(int productId, ProductUpdateDto dto)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.UpdateProductAsync(sellerId, productId, dto);
            return Ok(new { message = "Product updated" });
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Delete(int productId)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.DeleteProductAsync(sellerId, productId);
            return Ok(new { message = "Product deleted" });
        }

        [HttpPatch("{productId}/availability")]
        public async Task<IActionResult> UpdateAvailability(int productId, ProductIsActiveDto dto)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.UpdateAvailabilityAsync(sellerId, productId, dto.isActive);

            return Ok(new { message = "Availability updated!"});
        }
    }
}
