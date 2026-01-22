namespace HandWoven.Api.DTOs.Users;

public class UserProfileDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? ProfileImgUrl { get; set; }
}
