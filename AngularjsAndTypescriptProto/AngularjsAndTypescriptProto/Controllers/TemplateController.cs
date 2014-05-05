using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace AngularjsAndTypescriptProto.Controllers
{
    public class TemplateController : Controller
    {
        //
        // GET: /Template/
        private static IDictionary<string, string> vrDictionary = new Dictionary<string, string>();
        private static bool isInit = false;
        public TemplateController()
        {
            if (isInit)
            {
                return;
            }
            if (!vrDictionary.Any(x => x.Value == "AddSessionButton"))
            {
                var addSessionButtonId = Guid.NewGuid().ToString("n");
                vrDictionary.Add(addSessionButtonId, "AddSessionButton");
            }
            isInit = true;
        }

        public ActionResult AddSessionButton()
        {
            return View();
        }

        protected override void HandleUnknownAction(string actionName)
        {
            foreach (var viewBagKvp in vrDictionary)
            {
                ViewData.Add(viewBagKvp.Value, viewBagKvp.Key);
            }
            if (vrDictionary.ContainsKey(actionName))
            {
                this.View(vrDictionary[actionName]).ExecuteResult(ControllerContext);
                return;
            }
            this.View(actionName).ExecuteResult(ControllerContext);
        }

    }

    public class KeyedAccessAttribute : Attribute
    {
        private string _key;
        public string Key 
        {
            get { return _key; }
        }

        public KeyedAccessAttribute()
        {
            _key = Guid.NewGuid().ToString("n");
        }
    }
}
