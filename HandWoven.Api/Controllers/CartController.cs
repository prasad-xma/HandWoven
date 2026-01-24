using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandWoven.Api.DTOs.Cart;
using HandWoven.Api.Services;
using System.Security.Claims;

namespace HandWoven.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<CartSummaryDto>> GetCart()
    {
        try
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User ID not found in token");
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while retrieving your cart");
        }
    }

    [HttpPost("add")]
    public async Task<ActionResult<CartItemDto>> AddToCart([FromBody] CartAddDto cartAddDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var cartItem = await _cartService.AddToCartAsync(userId, cartAddDto);
            return Ok(cartItem);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User ID not found in token");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while adding item to cart");
        }
    }

    [HttpPut("{cartId}")]
    public async Task<ActionResult<CartItemDto>> UpdateCartItem(int cartId, [FromBody] CartUpdateDto cartUpdateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var cartItem = await _cartService.UpdateCartItemAsync(userId, cartId, cartUpdateDto);
            return Ok(cartItem);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User ID not found in token");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while updating cart item");
        }
    }

    [HttpDelete("{cartId}")]
    public async Task<ActionResult> RemoveFromCart(int cartId)
    {
        try
        {
            var userId = GetUserId();
            var result = await _cartService.RemoveFromCartAsync(userId, cartId);
            
            if (!result)
            {
                return NotFound("Cart item not found");
            }

            return Ok("Item removed from cart successfully");
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User ID not found in token");
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while removing item from cart");
        }
    }

    [HttpDelete("clear")]
    public async Task<ActionResult> ClearCart()
    {
        try
        {
            var userId = GetUserId();
            var result = await _cartService.ClearCartAsync(userId);
            
            if (!result)
            {
                return BadRequest("Cart is already empty");
            }

            return Ok("Cart cleared successfully");
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User ID not found in token");
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while clearing cart");
        }
    }
}
