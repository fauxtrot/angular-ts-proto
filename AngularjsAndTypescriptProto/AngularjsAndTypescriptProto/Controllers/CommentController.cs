using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
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
        public void Post([FromBody]Comment value)
        {
            //new comment
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