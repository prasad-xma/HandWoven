using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.DTOs.Cart;

public class CartUpdateDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}
