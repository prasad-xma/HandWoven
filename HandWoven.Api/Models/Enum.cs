namespace HandWoven.Api.Models;

public enum UserType
{
    Admin,
    SysManager,
    User, // buyer
    Seller
}

public enum UserStatus
{
    Verified,
    Active,
    Deactivate
}

public enum ProductStatus
{
    Active,
    Deactivate
}
