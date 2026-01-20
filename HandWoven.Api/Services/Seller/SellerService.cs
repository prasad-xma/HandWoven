using System;
using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Seller;
using Microsoft.EntityFrameworkCore;
using HandWoven.Api.Models;

namespace HandWoven.Api.Services.Seller;

public class SellerService : ISellerService
{
    private readonly AppDbContext _context;

    public SellerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task RegisterSellerAsync(int userId, CreateSellerRequestDto dto)
    {
        var user = await _context.Users
            .Include(u => u.SellerProfile)
            .Include(u => u.Shop)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if(user.UserType != UserType.User)
        {
            throw new Exception("User is already a seller or admin");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // seller 
            var sellerProfile = new SellerProfile
            {
                UserId = userId,
                BusinessName = dto.BusinessName,
                BusinessAddress = dto.BusinessAddress,
                ContactPhone = dto.ContactPhone,
                CreatedAt = DateTime.UtcNow
            };

            // save seller profile
            _context.SellerProfiles.Add(sellerProfile); 

            // shop 
            var shop = new Shop
            {
                ShopName = dto.ShopName,
                Address = dto.Address,
                ShopContact = dto.ShopContact,
                ShopEmail = dto.ShopEmail,
                ImgUrl = dto.ImgUrl,
                SocialAcc = dto.SocialAcc,
                Bio = dto.Bio ?? "",
                UserId = userId
            };

            _context.Shops.Add(shop); // save shop data

            // update user role
            user.UserType = UserType.Seller;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

    }
}
