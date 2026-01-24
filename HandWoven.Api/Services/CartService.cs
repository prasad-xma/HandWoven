using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Cart;
using Microsoft.EntityFrameworkCore;
using HandWoven.Api.Models;

namespace HandWoven.Api.Services;

public interface ICartService
{
    Task<CartSummaryDto> GetCartAsync(int userId);
    Task<CartItemDto> AddToCartAsync(int userId, CartAddDto cartAddDto);
    Task<CartItemDto> UpdateCartItemAsync(int userId, int cartId, CartUpdateDto cartUpdateDto);
    Task<bool> RemoveFromCartAsync(int userId, int cartId);
    Task<bool> ClearCartAsync(int userId);
}

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CartSummaryDto> GetCartAsync(int userId)
    {
        var cartItems = await _context.Carts
            .Include(c => c.Product)
            .ThenInclude(p => p.Images)
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto
            {
                CartId = c.CartId,
                ProductId = c.ProductId,
                ProductName = c.Product.ProductName,
                Description = c.Product.Description,
                Price = c.Product.Price,
                DiscountPrice = c.Product.DiscountPrice,
                ImageUrl = c.Product.Images.FirstOrDefault() == null ? null : c.Product.Images.FirstOrDefault()!.ImageUrl,
                Quantity = c.Quantity,
                AddedAt = c.AddedAt
            })
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();

        var subtotal = cartItems.Sum(item => item.TotalPrice);
        var totalDiscount = cartItems.Where(item => item.DiscountPrice.HasValue)
            .Sum(item => item.Quantity * (item.Price - item.DiscountPrice!.Value));

        return new CartSummaryDto
        {
            Items = cartItems,
            TotalItems = cartItems.Sum(item => item.Quantity),
            Subtotal = cartItems.Sum(item => item.Quantity * item.Price),
            TotalDiscount = totalDiscount
        };
    }

    public async Task<CartItemDto> AddToCartAsync(int userId, CartAddDto cartAddDto)
    {
        // Check if product exists and is active
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.ProductId == cartAddDto.ProductId);

        if (product == null || product.isActive != ProductStatus.Active)
        {
            throw new ArgumentException("Product not found or not available");
        }

        // Check if item already exists in cart
        var existingCartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == cartAddDto.ProductId);

        if (existingCartItem != null)
        {
            // Update quantity
            existingCartItem.Quantity += cartAddDto.Quantity;
            await _context.SaveChangesAsync();
        }
        else
        {
            // Add new item
            var newCartItem = new Cart
            {
                UserId = userId,
                ProductId = cartAddDto.ProductId,
                Quantity = cartAddDto.Quantity,
                AddedAt = DateTime.UtcNow
            };

            _context.Carts.Add(newCartItem);
            await _context.SaveChangesAsync();
            existingCartItem = newCartItem;
        }

        // Return the updated cart item
        return new CartItemDto
        {
            CartId = existingCartItem.CartId,
            ProductId = existingCartItem.ProductId,
            ProductName = product.ProductName,
            Description = product.Description,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            ImageUrl = product.Images.FirstOrDefault()?.ImageUrl,
            Quantity = existingCartItem.Quantity,
            AddedAt = existingCartItem.AddedAt
        };
    }

    public async Task<CartItemDto> UpdateCartItemAsync(int userId, int cartId, CartUpdateDto cartUpdateDto)
    {
        var cartItem = await _context.Carts
            .Include(c => c.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

        if (cartItem == null)
        {
            throw new ArgumentException("Cart item not found");
        }

        cartItem.Quantity = cartUpdateDto.Quantity;
        await _context.SaveChangesAsync();

        return new CartItemDto
        {
            CartId = cartItem.CartId,
            ProductId = cartItem.ProductId,
            ProductName = cartItem.Product.ProductName,
            Description = cartItem.Product.Description,
            Price = cartItem.Product.Price,
            DiscountPrice = cartItem.Product.DiscountPrice,
            ImageUrl = cartItem.Product.Images.FirstOrDefault()?.ImageUrl,
            Quantity = cartItem.Quantity,
            AddedAt = cartItem.AddedAt
        };
    }

    public async Task<bool> RemoveFromCartAsync(int userId, int cartId)
    {
        var cartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

        if (cartItem == null)
        {
            return false;
        }

        _context.Carts.Remove(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cartItems = await _context.Carts
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
        {
            return false;
        }

        _context.Carts.RemoveRange(cartItems);
        await _context.SaveChangesAsync();
        return true;
    }
}
