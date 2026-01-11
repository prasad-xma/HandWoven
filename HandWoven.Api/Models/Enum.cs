namespace HandWoven.Api.Models;

public enum UserType
{
    Admin = 1,
    SysManager = 2,
    User = 3, // buyer
    Seller = 4
}

public enum UserStatus
{
    Verified = 1,
    Active = 2,
    Deactivate = 3
}

public enum ProductStatus
{
    Active = 1,
    Deactivate = 2
}

public enum OrderStatus
{
    Pending = 1,
    Confirmed = 2,
    Processing = 3,
    Delivered = 4,
    Cancelled = 5
}

public enum PaymentStatus
{
    Pending = 1,
    Paid = 2,
    Failed = 3,
    Refunded = 4
}

public enum PaymentMethod
{
    CashOnDelivery = 1,
    Card = 2,
    BankTransfer = 3,
    Wallet = 4
}