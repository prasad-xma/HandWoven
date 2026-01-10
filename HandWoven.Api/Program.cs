using Microsoft.EntityFrameworkCore;
using HandWoven.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// controllers
builder.Services.AddControllers();

// Swagger (API Testing)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database MySQL and Pomelo
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36))
    )
);

// CROS for react frontend
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
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.Run();