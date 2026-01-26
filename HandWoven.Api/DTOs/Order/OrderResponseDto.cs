using HandWoven.Api.Models;

namespace HandWoven.Api.DTOs.Order;

public class OrderResponseDto
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public ShippingAddressDto ShippingAddress { get; set; } = null!;
    public decimal TotalAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<OrderItemResponseDto> OrderItems { get; set; } = new();
}

public class ShippingAddressDto
{
    public int AddressId { get; set; }
    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = null!;
    public string? State { get; set; }
    public string Country { get; set; } = null!;
    public string PostalCode { get; set; } = null!;
    public string? AdditionalPhoneNo { get; set; }
}

public class OrderItemResponseDto
{
    public int OrderItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public int SellerId { get; set; }
    public string SellerName { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
}
