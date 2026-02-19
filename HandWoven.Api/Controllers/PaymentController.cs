using HandWoven.Api.Data;
using HandWoven.Api.DTOs.Payment;
using HandWoven.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace HandWoven.Api.Controllers
{
    [ApiController]
    // [Route("api/payment")]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {

        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }


        [HttpPost("create-intent")]
        // [Authorize]
        public async Task<IActionResult> CreatePaymentIntent(
            [FromBody] CreateCheckoutDto dto
        )
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(dto.Amount * 100), // cents
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);
            
            return Ok(new
            {
                clientSecret = intent.ClientSecret
            });
        }


        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmRequestDto req)
        {
            try
            {
                // retrive the payment Intent 
                var service = new PaymentIntentService();
                var intent = await service.GetAsync(req.PaymentIntentId);

                // verify the payment success
                if (intent.Status != "succeeded")
                {
                    return BadRequest("Payment not successful...");
                }

                // find the order
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.PaymentIntentId == req.PaymentIntentId);

                if (order == null)
                {
                    return NotFound("Order not found for this payment..");
                }

                // check if a payment already exists
                var existingPayment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.StripePaymentIntentId == req.PaymentIntentId);

                if (existingPayment != null)
                {
                    return Ok("Payment already recorded");
                }

                // create a new payment record
                var payment = new Payment
                {
                    OrderId = order.OrderId,
                    StripePaymentIntentId = req.PaymentIntentId,
                    Amount = (decimal)intent.Amount / 100,
                    Currency = intent.Currency,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Payments.Add(payment);

                // Update order status
                order.PaymentStatus = PaymentStatus.Paid;
                order.OrderStatus = OrderStatus.Processing;
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment confirmed and recorded..."});
            
            }
            catch (StripeException e)
            {
                return BadRequest($"Stripe error: {e.Message}");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }   
    }
}
