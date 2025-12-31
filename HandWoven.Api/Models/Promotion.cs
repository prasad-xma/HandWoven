using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Promotion
{
    [Key]
    public int PromoId { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    [Required]
    public decimal DiscountValue { get; set; }

    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
}
