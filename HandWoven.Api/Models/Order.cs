using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Order
{
    [Key]
    public int OrderId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int AddressId { get; set; }
    public ShippingAddress ShippingAddress { get; set; } = null!;

    public decimal TotalAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }

    // stripe payment intent id
    public string? PaymentIntentId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();


}
