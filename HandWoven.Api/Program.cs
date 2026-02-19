using Microsoft.EntityFrameworkCore;
using HandWoven.Api.Data;
using HandWoven.Api.Configurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HandWoven.Api.Services.Auth;
using HandWoven.Api.Helpers;
using HandWoven.Api.Services.Seller;
using HandWoven.Api.Services.Product;
using HandWoven.Api.Services.Users;
using HandWoven.Api.Services;

using Stripe;

using DotNetEnv;
// using HandWoven.Api.Services.Order;

var builder = WebApplication.CreateBuilder(args);

// Database MySQL and Pomelo
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36))
    );
});

// controllers ------------------------------
builder.Services.AddControllers();


// JWT Settings ----------------------------
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings")
);

// Authentication ---------------------------
var jwtSettings = builder.Configuration.GetSection("JwtSettings")
    .Get<JwtSettings>();

builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(option =>
{
    option.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings!.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.key)
        )
    };
});

// Authorization ------------------------------------------
builder.Services.AddAuthorization();



// Services ------------------------------------------------
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtTokenGenerator>();

// seller service
builder.Services.AddScoped<ISellerService, SellerService>();
builder.Services.AddScoped<ISellerProductImageService, SellerProductImageService>();
// product service
// builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductService, HandWoven.Api.Services.Product.ProductService>();
// user service
builder.Services.AddScoped<IUserService, UserService>();
// cart service
builder.Services.AddScoped<ICartService, CartService>();
// shipping service
// builder.Services.AddScoped<IShippingAdService, ShippingAddressService>();

// sripe 
Env.Load();

StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

/*
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
*/

// Swagger (API Testing) ---------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



// CROS for react frontend --------------------------------------

/*
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
}); */

// allow only handwoven client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowHandWovenClient",
    policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }
    );
});

var app = builder.Build();

// seed Admin User --------------------------------
using (var scope = app.Services.CreateScope())
{
    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    await authService.SeedAdminAsync();
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseCors("AllowHandWovenClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();