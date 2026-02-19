using System;

namespace HandWoven.Api.DTOs.Checkouts;

public class CreateOrderResponse
{
    public int OrderId { get; set; }
    public string ClientSecret { get; set; } = null!;
}
