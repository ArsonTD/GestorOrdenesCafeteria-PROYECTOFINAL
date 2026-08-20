namespace Cafeteria.Application.Core
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public bool IsNotFound { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }

        public static ServiceResult Ok(object? data = null, string message = "")
            => new() { Success = true, Data = data, Message = message };

        public static ServiceResult Fail(string message)
            => new() { Success = false, Message = message };

        public static ServiceResult NotFound(string message)
            => new() { Success = false, IsNotFound = true, Message = message };
    }
}
