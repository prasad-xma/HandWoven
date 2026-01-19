using System;
using HandWoven.Api.DTOs.Seller;

namespace HandWoven.Api.Services.Seller;

public interface ISellerService
{
    Task RegisterSellerAsync(int userId, CreateSellerRequestDto dto);
}
