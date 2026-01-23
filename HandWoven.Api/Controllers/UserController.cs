using System.Security.Claims;
using HandWoven.Api.DTOs.Users;
using HandWoven.Api.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HandWoven.Api.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name)!);
        var profile = await _service.GetMyProfileAsync(userId);
        return Ok(profile);
    }

    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe(UserUpdateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name)!);
        await _service.UpdateMyProfileAsync(userId, dto);
        return Ok(new { message = "Profile updated" });
    }

    [HttpPost("me/image")]
    public async Task<IActionResult> UploadImage([FromForm] UserProfileImageUploadDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name)!);
        var url = await _service.UploadProfileImageAsync(userId, dto.Image);
        return Ok(new { message = "Profile image uploaded", profileImgUrl = url });
    }
}
