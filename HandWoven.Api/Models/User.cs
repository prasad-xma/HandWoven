using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required, EmailAddress]
    public string Email {get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public string Phone { get; set; } = null!;

    [Required]
    public string Address { get; set; } = null!;

    [Required]
    public UserType UserType { get; set; }

    public string? ProfileImgUrl { get; set; }

    public UserStatus UserStatus { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? ShopId { get; set;}
    public Shop? Shop { get; set; }
}
