using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using DataAccess;
using DataAccess.Model;
using AngularjsAndTypescriptProto.Helpers;

namespace AngularjsAndTypescriptProto.Controllers
{
    [RoutePrefix("api/Like")]
    public class LikeController : ApiController
    {
        [HttpPost]
        [Route("Hello")]
        public string Hello()
        {
            return "Hello";
        }

        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("{nodeId}")]
        public bool LikeNode(int nodeId)
        {
            var dal = new Neo4JCamperDataAccess();
            var user = Membership.GetUser();
            if (user != null && user.ProviderUserKey != null)
            {
                var id = (int)user.ProviderUserKey;
                if (user.AsType<UserInfo>().Likes(nodeId))
                {
                    dal.UnLikeNode(nodeId, id);
                    return false;
                }
                dal.LikeNode(nodeId, id);
                
            }
            return true;
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("getLikes/{nodeId}")]
        public IEnumerable<UserInfo> NodeLikedBy(int nodeId)
        {
            var dal = new Neo4JCamperDataAccess();

            return dal.GetLikedByList(nodeId);

        }
    }
}