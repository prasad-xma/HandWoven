using System;
using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Auth;
using HandWoven.Api.Helpers;
using HandWoven.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _jwtTokenGenerator;

    public AuthService(AppDbContext context, JwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    // register
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var existingUser = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (existingUser)
        {
            throw new Exception("Email already registered!");
        }

        var user = new User
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Address = dto.Address ?? string.Empty,
            UserType = UserType.User,
            UserStatus = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = PasswordHasher.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var (token, expiresAt) = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            UserId = user.UserId,
            Email = user.Email,
            Role = user.UserType.ToString()
        };
    }

    // LOGIN
    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            throw new Exception("Invalid email or password!");
        }

        if (!PasswordHasher.VerifyPassword(user.PasswordHash, dto.Password))
        {
            throw new Exception("Invalid password!");
        }

        if (user.UserStatus != UserStatus.Active)
        {
            throw new Exception("User account is not active!");
        }

        // generate a jwt token for the authorizations
        var (token, expiresAt) = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            UserId = user.UserId,
            Email = user.Email,
            Role = user.UserType.ToString()
        };
    }


    // ADMIN SEEDING
    public async Task SeedAdminAsync()
    {
        // fetch admin to see if admin alreayd exist
        var adminExists = await _context.Users
            .AnyAsync(u => u.UserType == UserType.Admin);

        // if admin already exist then return
        if (adminExists)
        {
            return;
        }

        // assign admin data
        var admin = new User
        {
            Email = "adminPrasad@handwoven.com",
            FirstName = "System",
            LastName = "Admin",
            Phone = "0716500000",
            Address = "System",
            UserType = UserType.Admin,
            UserStatus = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = PasswordHasher.HashPassword("Prasa@123")
        };


        _context.Users.Add(admin); // create admin user
        await _context.SaveChangesAsync(); // save admin 
    }

}
