using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.DTOs.Order;

public class AddShippingAddressDto
{
    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = null!;
    public string? State { get; set; }
    public string Country { get; set; } = null!;
    public string PostalCode { get; set; } = null!;

    public string? AdditionalPhoneNo { get; set; }
}
