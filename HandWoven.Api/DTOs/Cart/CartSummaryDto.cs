namespace HandWoven.Api.DTOs.Cart;

public class CartSummaryDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal Total => Subtotal - TotalDiscount;
}
