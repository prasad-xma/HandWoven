namespace HandWoven.Api.DTOs.Cart;

public class CartItemDto
{
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? ImageUrl { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; }
    public decimal TotalPrice => Quantity * (DiscountPrice ?? Price);
}
