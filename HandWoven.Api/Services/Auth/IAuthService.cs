using System;
using HandWoven.Api.DTOs.Auth;

namespace HandWoven.Api.Services.Auth;

public interface IAuthService
{
    // Registration 
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
    // User login
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
    
    // insert an admin
    Task SeedAdminAsync();
}
