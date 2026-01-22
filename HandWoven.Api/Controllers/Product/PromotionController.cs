using System.Security.Claims;
using HandWoven.Api.DTOs.Product;
using HandWoven.Api.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers.Product
{
    [ApiController]
    [Route("api/seller/product/{productId}/promotions")]
    [Authorize(Roles = "Seller")]
    public class PromotionController : ControllerBase
    {
        private readonly IProductService _service;

        public PromotionController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> List(int productId)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var promos = await _service.GetPromotionsAsync(sellerId, productId);
            return Ok(promos);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int productId, PromotionCreateDto dto)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var created = await _service.AddPromotionAsync(sellerId, productId, dto);
            return Ok(new { message = "Promotion created", promotion = created });
        }

        [HttpDelete("{promoId}")]
        public async Task<IActionResult> Delete(int productId, int promoId)
        {
            var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.DeletePromotionAsync(sellerId, productId, promoId);
            return Ok(new { message = "Promotion deleted" });
        }
    }
}
