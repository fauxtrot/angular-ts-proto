using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;
using DataAccess.Model;

namespace AngularjsAndTypescriptProto.Controllers
{
    public class CommentController : ApiController
    {
        // GET api/<controller>/5 <-session id
        public IEnumerable<Comment> Get(int id)
        {
            var dal = new DataAccess.Neo4JCamperDataAccess();
            var comments = dal.GetCommentsForSession(id);
            return comments;
        }

        // POST api/<controller>
        [Route("api/Comment/On/{nodeId:int}")]
        public Comment Post([FromBody]Comment value, int nodeId)
        {
            var dal = new DataAccess.Neo4JCamperDataAccess();
            var session = dal.GetSessionById(nodeId);
            var user = Membership.GetUser();
            return dal.AddCommentToSession(session, (int)user.ProviderUserKey, value);
            
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]Comment value)
        {
            //update comment
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}