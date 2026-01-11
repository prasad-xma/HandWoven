using System;
using System.ComponentModel.DataAnnotations;

namespace HandWoven.Api.DTOs.Auth;

public class RegisterRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;

    [Required, MinLength(6)]
    public string Phone { get; set; } = null!;

    [Required]
    public string? Address { get; set; }
}
