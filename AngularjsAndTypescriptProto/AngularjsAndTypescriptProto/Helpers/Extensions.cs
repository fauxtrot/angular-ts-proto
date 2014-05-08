using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Nextwave.Neo4J.Membership.Interfaces;

namespace AngularjsAndTypescriptProto.Helpers
{
    public static class Extensions
    {
    }

    public static class AntiForgeryExtension
    {
        public static string RequestVerificationToken(this HtmlHelper helper)
        {
            return String.Format("ncg-request-verification-token={0}", GetTokenHeaderValue());
        }

        internal static string GetTokenHeaderValue()
        {
            string cookieToken, formToken;
            System.Web.Helpers.AntiForgery.GetTokens(null, out cookieToken, out formToken);
            return cookieToken + ":" + formToken;
        }
    }
}