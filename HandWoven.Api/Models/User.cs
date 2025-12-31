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

    // relations
    
    public SellerProfile? SellerProfile {get; set;}
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<ShippingAddress> ShippingAddresses { get; set; } = new List<ShippingAddress>();

}
