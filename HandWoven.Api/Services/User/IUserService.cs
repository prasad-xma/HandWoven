using HandWoven.Api.DTOs.Users;
using Microsoft.AspNetCore.Http;

namespace HandWoven.Api.Services.Users;

public interface IUserService
{
    Task<UserProfileDto> GetMyProfileAsync(int userId);
    Task UpdateMyProfileAsync(int userId, UserUpdateDto dto);
    Task<string> UploadProfileImageAsync(int userId, IFormFile image);
}
