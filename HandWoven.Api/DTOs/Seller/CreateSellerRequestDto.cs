using System;

namespace HandWoven.Api.DTOs.Seller;

public class CreateSellerRequestDto
{
    // Seller profile
    public string BusinessName { get; set; } = null!;
    public string BusinessAddress { get; set; } = null!;
    public string ContactPhone { get; set; } = null!;

    // Shop
    public string ShopName { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string ShopContact { get; set; } = null!;
    public string ShopEmail { get; set; } = null!;
    public string? ImgUrl { get; set; }
    public string? SocialAcc { get; set; }
    public string? Bio { get; set; }
}
