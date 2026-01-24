using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.DTOs.Cart;

public class CartAddDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}
