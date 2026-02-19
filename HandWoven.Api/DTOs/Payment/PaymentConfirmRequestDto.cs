using System;

namespace HandWoven.Api.DTOs.Payment;

public class PaymentConfirmRequestDto
{
    public string PaymentIntentId { get; set; } = null!;
}
