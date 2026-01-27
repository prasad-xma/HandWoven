using System;
using HandWoven.Api.DTOs.Order;

namespace HandWoven.Api.Services.Order;

public interface IShippingAdService
{
    Task AddShippingAddressAsync(int userId, AddShippingAddressDto dto);
}
