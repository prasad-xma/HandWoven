using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HandWoven.Api.Models;

public class ProductImage
{
    [Key]
    public int ProductImageId { get; set; }

    [Required]
    public string ImageUrl { get; set; } = null!;

    public int ProductId { get; set; }
    [JsonIgnore]
    public Product Product { get; set; } = null!;
}
