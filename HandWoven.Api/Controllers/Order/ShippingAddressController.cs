using System.Security.Claims;
using HandWoven.Api.DTOs.Order;
using HandWoven.Api.Services.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers.Order
{
    [Route("api/user/shipping-address")]
    [ApiController]
    [Authorize]
    public class ShippingAddressController : ControllerBase
    {
        private readonly IShippingAdService _shippingService;

        public ShippingAddressController(IShippingAdService shippingAdService)
        {
            _shippingService = shippingAdService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(AddShippingAddressDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _shippingService.AddShippingAddressAsync(userId, dto);

            return Ok(new {message = "Shipping Data created"});
        }
    }
}
