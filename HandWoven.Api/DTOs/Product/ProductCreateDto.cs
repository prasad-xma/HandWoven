using System;
using HandWoven.Api.Models;
namespace HandWoven.Api.DTOs.Product;

public class ProductCreateDto
{
    public string ProductName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal? DiscountPrice { get; set; }
    public double? Weight {get; set;}
    public string? Dimensions { get; set; }
    public string? MaterialType { get; set; }
    //public ProductStatus isActive {get; set;}
    public string? HashTags {get; set;}
}
