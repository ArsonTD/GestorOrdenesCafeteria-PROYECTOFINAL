using Cafeteria.Application.Core;
using Microsoft.AspNetCore.Mvc;

namespace GestorCafeteria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected IActionResult ToResponse(ServiceResult result)
        {
            if (result.Success)
                return Ok(result.Data ?? result.Message);

            return result.IsNotFound
                ? NotFound(result.Message)
                : BadRequest(result.Message);
        }
    }
}
