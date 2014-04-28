using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Security;
using AngularjsAndTypescriptProto.Helpers;
using AngularjsAndTypescriptProto.Models;
using DataAccess;
using DataAccess.Model;

namespace AngularjsAndTypescriptProto.Controllers
{
    [ModelBinder(typeof(SessionModelBinder))]
    public class SessionController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Session> Get()
        {
            ICamperDataAccess dal = new Neo4JCamperDataAccess();
            var retval = dal.GetSessions();
            return retval;
        }
        //"api/Session/{id}"
        // GET api/<controller>/5
        public Session Get(string id)
        {
            ICamperDataAccess dal = new Neo4JCamperDataAccess();
            //return dal.GetSessionByPropertyValue("Username", id).FirstOrDefault();
            return dal.GetSessionByPropertyValue("SessionName", id).FirstOrDefault();
        }

        // POST api/<controller>
        [AntiForgeryValidate]
        [Authorize(Roles = "Administrator")]
        public void Post([FromBody]Session session)
        {
            if (session.Name == null || session.SpeakerName == null)
            {
                throw new Exception("Cannot be null");
            }
            ICamperDataAccess dal = new Neo4JCamperDataAccess();
            var user = Membership.GetUser();
            if (user != null)
            {
                long id = (int)user.ProviderUserKey;
                dal.AddSession(session, id);    
            }
            
        }

        // PUT api/<controller>/5
        [AntiForgeryValidate]
        [Authorize(Roles = "Adminsitrator")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}