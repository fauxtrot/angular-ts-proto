using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AngularjsAndTypescriptProto.Controllers
{
    public class TemplateController : Controller
    {
        //
        // GET: /Template/

        protected override void HandleUnknownAction(string actionName)
        {
            this.View(actionName).ExecuteResult(ControllerContext);
        }

    }
}
