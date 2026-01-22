using System;

namespace HandWoven.Api.DTOs.Product;

public class PromotionCreateDto
{
    public decimal DiscountValue { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
}
