using Microsoft.AspNetCore.Http;

namespace HandWoven.Api.DTOs.Users;

public class UserProfileImageUploadDto
{
    public IFormFile Image { get; set; } = null!;
}
