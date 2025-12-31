using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Wishlist
{
    [Key]
    public int WishListId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
