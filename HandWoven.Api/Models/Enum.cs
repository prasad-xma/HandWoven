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

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Delivered,
    Cancelled
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}

public enum PaymentMethod
{
    CashOnDelivery,
    Card,
    BankTransfer,
    Wallet
}