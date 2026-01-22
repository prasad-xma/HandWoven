using System;

namespace HandWoven.Api.DTOs.Product;

public class ProductUpdateDto
{
    public string? ProductName { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? Quantity { get; set; }
    public decimal? DiscountPrice { get; set; }
    public double? Weight { get; set; }
    public string? Dimensions { get; set; }
    public string? MaterialType { get; set; }
    public string? HashTags { get; set; }
}
