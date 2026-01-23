using Microsoft.AspNetCore.Mvc;
using HandWoven.Api.DTOs.Product;
using HandWoven.Api.Services.Product;

namespace HandWoven.Api.Controllers.Product
{
    [Route("api/products")]
    [ApiController]
    public class PublicProductController : ControllerBase
    {
        private readonly IProductService _service;

        public PublicProductController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _service.GetAllProductsAsync();
            
            var result = products.Select(p => new
            {
                productId = p.ProductId,
                productName = p.ProductName,
                description = p.Description,
                price = p.Price,
                discountPrice = p.DiscountPrice,
                isActive = (int)p.isActive,
                images = p.Images.Select(img => new
                {
                    imageUrl = img.ImageUrl
                }).ToList(),
                
                promotions = p.Promotions.Where(promo => 
                    promo.ValidFrom <= DateTime.Now && promo.ValidUntil >= DateTime.Now
                ).Select(promo => new
                {
                    promotionId = promo.PromoId,
                    discountPercentage = (double)(promo.DiscountValue / p.Price * 100),
                    startDate = promo.ValidFrom,
                    endDate = promo.ValidUntil,
                    isActive = promo.ValidFrom <= DateTime.Now && promo.ValidUntil >= DateTime.Now
                }).ToList()
            });

            return Ok(result);
        }
    }
}
