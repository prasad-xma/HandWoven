using System;

namespace HandWoven.Api.DTOs.Order;

public class CreateOrderRequest
{
    public ShippingAddressDto ShippingAddress { get; set; } = null!;
}

// create shipping address dto
public class ShippingAddressDto
{
    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = null!;
    public string? State { get; set; }
    public string Country { get; set; } = null!;
    public string PostalCode { get; set; } = null!;
    public string? AdditionalPhoneNo { get; set; }
}
