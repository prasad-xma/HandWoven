using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Cart
{
    [Key]
    public int CartId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    [Required]
    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
