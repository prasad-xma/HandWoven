using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Shop
{
    [Key]
    public int ShopId {get; set; }

    [Required]
    public string ShopName {get; set; } = null!;

    [Required]
    public string Address {get; set;} = null!;

    [Required]
    public string ShopContact { get; set; } = null!;

    [Required, EmailAddress]
    public string ShopEmail { get; set; } = null!;
    public string? ImgUrl { get; set; }

    public string? SocialAcc {get; set;}

    public string Bio {get; set;} = null!;

    public int UserId {get; set;} // owner
    public User User {get; set;} = null!;
}
