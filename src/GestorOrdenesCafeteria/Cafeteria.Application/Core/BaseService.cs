namespace Cafeteria.Application.Core
{
    public abstract class BaseService
    {
        protected static async Task<ServiceResult> ExecuteAsync(Func<Task<ServiceResult>> operation)
        {
            try
            {
                return await operation();
            }
            catch (Exception ex)
            {
                return ServiceResult.Fail($"Ocurrió un error al procesar la solicitud: {ex.Message}");
            }
        }
    }
}
