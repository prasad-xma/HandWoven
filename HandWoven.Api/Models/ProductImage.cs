using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class ProductImage
{
    [Key]
    public int ProductImageId { get; set; }

    [Required]
    public string ImageUrl { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
