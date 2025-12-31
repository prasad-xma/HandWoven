using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class SellerProfile
{
    [Key]
    public int SellerProfileId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public string BusinessName { get; set; } = null!;

    public string? BusinessAddress { get; set; }
    public string? ContactPhone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
