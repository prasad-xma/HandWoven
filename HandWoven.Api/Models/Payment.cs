using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class Payment
{
    [Key]
    public int PaymentId { get; set; }
    public int OrderId { get; set; }

    public string StripePaymentIntentId { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "usd";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
