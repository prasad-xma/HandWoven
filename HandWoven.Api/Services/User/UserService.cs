using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Services.Users;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public UserService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task<UserProfileDto> GetMyProfileAsync(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return new UserProfileDto
        {
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.Phone,
            Address = user.Address,
            Role = user.UserType.ToString(),
            ProfileImgUrl = user.ProfileImgUrl
        };
    }

    public async Task UpdateMyProfileAsync(int userId, UserUpdateDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (dto.FirstName != null) user.FirstName = dto.FirstName;
        if (dto.LastName != null) user.LastName = dto.LastName;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.Address != null) user.Address = dto.Address;

        await _context.SaveChangesAsync();
    }

    public async Task<string> UploadProfileImageAsync(int userId, IFormFile image)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (image == null || image.Length == 0)
        {
            throw new Exception("No image uploaded");
        }

        var uploadPath = Path.Combine(_env.WebRootPath, "uploads", "users");
        Directory.CreateDirectory(uploadPath);

        if (!string.IsNullOrWhiteSpace(user.ProfileImgUrl) && user.ProfileImgUrl.StartsWith("/uploads/users/"))
        {
            var relativeOld = user.ProfileImgUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var oldPath = Path.Combine(_env.WebRootPath, relativeOld);
            if (File.Exists(oldPath))
            {
                File.Delete(oldPath);
            }
        }

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(uploadPath, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(stream);

        user.ProfileImgUrl = $"/uploads/users/{fileName}";
        await _context.SaveChangesAsync();

        return user.ProfileImgUrl;
    }
}
