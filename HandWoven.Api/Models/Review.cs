using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Review
{
    [Key]
    public int ReviewId { get; set; }

    [Range(0, 5)]
    public int Rating { get; set; }

    [Required]
    public string? Description { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int ShopId { get; set; }
    public Shop Shop { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
