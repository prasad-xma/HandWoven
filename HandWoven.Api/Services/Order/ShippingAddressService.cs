using System;
using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Order;
using HandWoven.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HandWoven.Api.Services.Order;

public class ShippingAddressService : IShippingAdService
{
    private readonly AppDbContext _context;

    public ShippingAddressService(AppDbContext context)
    {
        _context = context;
    }
    public async Task AddShippingAddressAsync(int userId, AddShippingAddressDto dto)
    {
        // check user is exist or if not throw an exception
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId) ?? throw new Exception("User not found!");

        var newshippingAddress = new ShippingAddress
        {
            UserId = userId,
            AddressLine1 = dto.AddressLine1,
            AddressLine2 = dto.AddressLine2,
            City = dto.City,
            State = dto.State,
            Country = dto.Country,
            PostalCode = dto.PostalCode,
            AdditionalPhoneNo = dto.AdditionalPhoneNo
        };

        _context.ShippingAddresses.Add(newshippingAddress);
        await _context.SaveChangesAsync();

    }
}
