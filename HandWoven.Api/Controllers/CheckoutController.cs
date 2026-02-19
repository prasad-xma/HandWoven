using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HandWoven.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using HandWoven.Api.Configurations;
using HandWoven.Api.Services;
using System.Security.Claims;
using HandWoven.Api.DTOs.Checkouts;
using HandWoven.Api.Models;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace HandWoven.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly AppDbContext _context; // Database context
        private readonly IOptions<StripeSettings> _stripeSettings; // Stripe settings
        private readonly ICartService _cartService; // Cart service

        // Constructor for dependency injection
        public CheckoutController(AppDbContext context, IOptions<StripeSettings> stripeSettings, ICartService cartService)
        {
            _context = context;
            _stripeSettings = stripeSettings;
            _cartService = cartService;
        }

        // get the current user's ID from the JWT token
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return userId;
        }

        [HttpPost("create-order")]
        public async Task<ActionResult<CreateOrderResponse>> CreateOrder(CreateOrderRequest request)
        {
            var userId = GetUserId();

            // get user cart items and their product details
            var cartItems = await _context.Carts
                .Include(c => c.Product).ThenInclude(p => p.Shop)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest("Cart is empty...");
            }

            // create shipping address
            var shippingAddress = new ShippingAddress
            {
                UserId = userId,
                AddressLine1 = request.ShippingAddress.AddressLine1,
                AddressLine2 = request.ShippingAddress.AddressLine2,
                City = request.ShippingAddress.City,
                State = request.ShippingAddress.State,
                Country = request.ShippingAddress.Country,
                PostalCode = request.ShippingAddress.PostalCode,
                AdditionalPhoneNo = request.ShippingAddress.AdditionalPhoneNo
            };

            _context.ShippingAddresses.Add(shippingAddress);
            // save changes 
            await _context.SaveChangesAsync();

            // calculate total
            decimal subtotal = 0;
            decimal totalDiscount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cartItems)
            {
                var product = cartItem.Product;
                decimal unitPrice = product.Price;
                decimal? discountPrice = product.DiscountPrice;

                decimal itemSubtotal = unitPrice * cartItem.Quantity;
                decimal itemDiscount = discountPrice.HasValue
                    ? (unitPrice - discountPrice.Value) * cartItem.Quantity
                    : 0;

                subtotal += itemSubtotal;
                totalDiscount += itemDiscount;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.ProductId,
                    // seller id
                    SellerId = product.Shop.UserId,
                    Quantity = product.Quantity,
                    UnitPrice = unitPrice,
                    SubTotal = discountPrice.HasValue
                    ? discountPrice.Value * cartItem.Quantity
                    : itemSubtotal
                });
            }

            // shipping and tax 0
            decimal shippingAmount = 0;
            decimal taxAmount = 0;
            decimal finalAmount = subtotal - totalDiscount + shippingAmount + taxAmount;

            // create order
            var order = new Models.Order
            {
                UserId = userId,
                TotalAmount = subtotal,
                AddressId = shippingAddress.AddressId,
                ShippingAmount = shippingAmount,
                TaxAmount = taxAmount,
                DiscountAmount = totalDiscount,
                FinalAmount = finalAmount,
                PaymentStatus = PaymentStatus.Pending,
                OrderStatus = OrderStatus.Pending,
                PaymentMethod = Models.PaymentMethod.Card,
                CreatedAt = DateTime.UtcNow,
                OrderItems = orderItems
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // create stripe payment intent
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(finalAmount * 100),
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
                Metadata = new Dictionary<string, string>
                {
                    {"orderId", order.OrderId.ToString()}
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            // store payment intent in order
            order.PaymentIntentId = intent.Id;
            await _context.SaveChangesAsync();

            // clear cart
            await _cartService.ClearCartAsync(userId);

            // return client secret and order id
            return Ok(new CreateOrderResponse
            {
                OrderId = order.OrderId,
                ClientSecret = intent.ClientSecret
            });
        }

    }
}
