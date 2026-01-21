using System.Security.Claims;
using HandWoven.Api.DTOs.Seller;
using HandWoven.Api.Services.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers.Seller;

[ApiController]
[Route("api/seller/products/images")]
[Authorize(Roles = "Seller")]
public class SellerProductImageController : ControllerBase
{
    private readonly ISellerProductImageService _service;

    public SellerProductImageController(ISellerProductImageService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] ProductImageUploadDto dto)
    {
        var sellerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _service.UploadImagesAsync(sellerId, dto);
        return Ok(new { message = "Images uploaded" });
    }
}
