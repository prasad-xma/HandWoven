using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Product
{
    [Key]
    public int ProductId {get; set;}

    [Required]
    public string ProductName {get; set;} = null!;

    [Required]
    public string Description {get; set; } = null!;

    public string? ProductImgUrl { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int Quantity { get; set; }

    public decimal? DiscountPrice { get; set; }

    public double? Weight {get; set;}

    public string? Dimensions { get; set; }

    public string? MaterialType { get; set; }

    [Required]
    public ProductStatus isActive { get; set; } = ProductStatus.Active;

    public string? HashTags { get; set; }

    public int ShopId { get; set; }
    public Shop Shop { get; set; } = null!;

    
}
