using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;
using System.Web.Http.ValueProviders;
using DataAccess.Model;

namespace AngularjsAndTypescriptProto.Helpers
{
    public class SessionModelBinder : IModelBinder
    {
        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != typeof(Session))
            {
                return false;
            }

            ValueProviderResult val = bindingContext.ValueProvider.GetValue(
                bindingContext.ModelName);
            if (val == null)
            {
                return false;
            }

            string key = val.RawValue as string;
            if (key == null)
            {
                bindingContext.ModelState.AddModelError(
                    bindingContext.ModelName, "Wrong value type");
                return false;
            }

            Session result = new Session();
            
            return false;
            //if (_locations.TryGetValue(key, out result) || GeoPoint.TryParse(key, out result))
            //{
            //    bindingContext.Model = result;
            //    return true;
            //}

            //bindingContext.ModelState.AddModelError(
            //    bindingContext.ModelName, "Cannot convert value to Location");
            //return false;
        }
    }
}