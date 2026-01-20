using System;
using System.Security.Claims;
using HandWoven.Api.DTOs.Seller;
using HandWoven.Api.Services.Seller;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers;

[ApiController]
[Route("api/seller")]
[Authorize]
public class SellerController : ControllerBase
{
    private readonly ISellerService _sellerService;

    public SellerController(ISellerService sellerService)
    {
        _sellerService = sellerService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterSeller(CreateSellerRequestDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(ClaimTypes.Name)!
        );

        await _sellerService.RegisterSellerAsync(userId, dto);

        return Ok(new { message = "Seller registration sucessful!"});
    }
}
