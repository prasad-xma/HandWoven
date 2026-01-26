using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.DTOs.Order;

public class PreorderDto
{
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
    
    public List<OrderItemDto> OrderItems { get; set; } = new();
}

public class OrderItemDto
{
    [Required]
    public int ProductId { get; set; }
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    public decimal UnitPrice { get; set; }
    
    [Required]
    public int SellerId { get; set; }
}
