using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AngularjsAndTypescriptProto
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AntiForgeryValidate());
        }
    }

    public class AntiForgeryValidate : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string cookieToken = "";
            string formToken = "";

            IEnumerable<string> tokenHeaders =
                filterContext.RequestContext.HttpContext.Request.Headers.GetValues("RequestVerificationToken");
            if (tokenHeaders != null && tokenHeaders.Count() == 2)
            {
                string[] tokens = tokenHeaders.First().Split(':');
                if (tokens.Length == 2)
                {
                    cookieToken = tokens[0].Trim();
                    formToken = tokens[1].Trim();
                }

                System.Web.Helpers.AntiForgery.Validate(cookieToken, formToken);
            }
            base.OnActionExecuting(filterContext);
        }
    }
}