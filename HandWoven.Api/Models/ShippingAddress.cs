using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.Models;

public class ShippingAddress
{
    [Key]
    public int AddressId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }

    [Required]
    public string City { get; set; } = null!;
    public string? State { get; set; }

    [Required]
    public string Country { get; set; } = null!;

    [Required]
    public string PostalCode { get; set; } = null!;

    public string? AdditionalPhoneNo { get; set; }
}
