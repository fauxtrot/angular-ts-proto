using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Security;
using AngularjsAndTypescriptProto;
using DataAccess;
using DataAccess.Model;

namespace CarolinaCodeCamperApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (!User.IsInRole("Administrator"))
            {
                if (User.Identity.Name == "ToddRichardson")
                {
                    if (!Roles.GetAllRoles().Contains("Administrator"))
                        Roles.CreateRole("Administrator");
                    Roles.AddUserToRole("ToddRichardson", "Administrator");
                }
            }

            return View();
        
        }

        [System.Web.Mvc.HttpPost]
        public void LikeSession([FromBody] Session session)
        {
            var dal = new Neo4JCamperDataAccess();
            var user = Membership.GetUser();
            if (user != null && user.ProviderUserKey != null)
            {
                var id = (int) user.ProviderUserKey;
                dal.LikeSession(session, id);
            }

        }

        [System.Web.Mvc.Authorize]
        [AntiForgeryValidate]
        public ActionResult SuperSecret()
        {
            return Json(new {result = "success"}, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public string GetVerificationToken()
        {
            return AngularjsAndTypescriptProto.Helpers.AntiForgeryExtension.GetTokenHeaderValue();
        }

    }


}
