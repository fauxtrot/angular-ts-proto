using System.IO;
using System.Web.Mvc;

namespace AngularjsAndTypescriptProto.Controllers
{
    public class ModuleController : Controller
    {
        //
        // GET: /Module/

        public ActionResult Controllers()
        {
            var files = Directory.GetFiles(Server.MapPath(@"~\App\Controllers"), "*.js");
            var retval = new JavaScriptResult();
            foreach (var file in files)
            {
                var reader = new StreamReader(file);
                var text = reader.ReadToEnd();
                retval.Script += text + "\r\n";
            }
            
            return retval;
        }
    }
}
