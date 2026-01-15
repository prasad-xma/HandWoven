using System;

namespace HandWoven.Api.Configurations;

public class JwtSettings
{
    public string key { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public int ExpiryMinutes { get; set; }
}
